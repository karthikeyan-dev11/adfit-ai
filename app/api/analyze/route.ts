import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { adCopy, landingPageUrl } = await request.json();

    if (!adCopy || !landingPageUrl) {
      return Response.json(
        {
          error: "Ad copy and landing page URL are required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // 1. Validate URL
    // ---------------------------------------

    let url: URL;

    try {
      url = new URL(landingPageUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return Response.json(
        {
          error: "Please enter a valid landing page URL.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // 2. Fetch landing page
    // ---------------------------------------

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(
        `Could not access the landing page. Website returned ${response.status}.`
      );
    }

    const html = await response.text();

    // ---------------------------------------
    // 3. Extract useful page content
    // ---------------------------------------

    const $ = cheerio.load(html);

    $("script, style, noscript, svg").remove();

    const title = $("title").text().trim();

    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || "";

    const headings = $("h1, h2, h3")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean)
      .slice(0, 30);

    const buttons = $("button, a")
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean)
      .slice(0, 40);

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);

    // ---------------------------------------
    // 4. Build analysis prompt
    // ---------------------------------------

    const prompt = `
You are AdFit AI, an evidence-based Ad-to-Landing Page Fit Analyzer.

Your job is to compare an advertisement with the actual landing page content.

Do NOT give generic marketing advice.

Every important finding must be based on evidence from either:
1. The advertisement
2. The landing page

If evidence is missing, explicitly say that evidence is missing.

====================
ADVERTISEMENT
====================

${adCopy}

====================
LANDING PAGE
====================

TITLE:
${title}

META DESCRIPTION:
${metaDescription}

HEADINGS:
${headings.join(" | ")}

CTA / BUTTON TEXT:
${buttons.join(" | ")}

PAGE CONTENT:
${bodyText}

====================
ANALYSIS
====================

Analyze these categories:

1. Message continuity
2. Offer alignment
3. Audience/persona alignment
4. Product/value proposition alignment
5. Proof/trust
6. Objection handling
7. CTA alignment

For every category provide:

- score from 0 to 100
- status
- specific finding
- evidence from the ad
- evidence from the landing page
- confidence level

Scoring:

90-100 = very strong alignment
70-89 = good alignment with some gaps
50-69 = partial alignment
0-49 = significant mismatch

====================
EXPERIMENTS
====================

Based on detected mismatches, create practical CRO experiments.

Each experiment must include:

- title
- hypothesis
- change
- success metric
- impact
- effort

Experiments must directly connect to the detected problems.

Do not invent claims, offers, features, or evidence.

====================
OUTPUT
====================

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallFit": number,
  "summary": string,
  "categories": [
    {
      "name": string,
      "score": number,
      "status": "Strong" | "Partial" | "Weak",
      "finding": string,
      "adEvidence": string,
      "pageEvidence": string,
      "confidence": "High" | "Medium" | "Low"
    }
  ],
  "experiments": [
    {
      "title": string,
      "hypothesis": string,
      "change": string,
      "successMetric": string,
      "impact": "High" | "Medium" | "Low",
      "effort": "High" | "Medium" | "Low"
    }
  ]
}
`;

    // ---------------------------------------
    // 5. Gemini fallback system
    // ---------------------------------------

    let result: Awaited<
      ReturnType<typeof ai.models.generateContent>
    > | null = null;

    let lastError: unknown = null;

    for (const model of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(
            `Trying Gemini model: ${model} | attempt ${attempt + 1}`
          );

          result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          if (result?.text) {
            console.log(`Gemini success with model: ${model}`);
            break;
          }
        } catch (error) {
          lastError = error;

          console.error(
            `Gemini failed with ${model} on attempt ${attempt + 1}:`,
            error
          );

          // Wait before retrying the same model
          if (attempt === 0) {
            await sleep(1500);
          }
        }
      }

      if (result?.text) {
        break;
      }
    }

    // ---------------------------------------
    // 6. If every model failed
    // ---------------------------------------

    if (!result?.text) {
      console.error("All Gemini models failed:", lastError);

      return Response.json(
        {
          error:
            "AI service is temporarily busy. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    const responseText = result.text;

    // ---------------------------------------
    // 7. Parse JSON
    // ---------------------------------------

    let analysis;

    try {
      analysis = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid Gemini JSON:", responseText);

      throw new Error(
        "The AI returned an invalid analysis response. Please try again."
      );
    }

    // ---------------------------------------
    // 8. Return result
    // ---------------------------------------

    return Response.json({
      success: true,

      page: {
        title,
        metaDescription,
        headings,
      },

      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not analyze the landing page.",
      },
      { status: 500 }
    );
  }
}
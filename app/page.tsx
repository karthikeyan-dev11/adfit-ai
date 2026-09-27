"use client";

import { useState } from "react";

type CategoryStatus = "Strong" | "Good" | "Partial" | "Weak";

type Category = {
  name: string;
  score: number;
  status: CategoryStatus;
  finding: string;
  adEvidence: string;
  pageEvidence: string;
  confidence: "High" | "Medium" | "Low";
};

type Experiment = {
  title: string;
  hypothesis: string;
  change: string;
  successMetric: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
};

type Analysis = {
  overallFit: number;
  summary: string;
  categories: Category[];
  experiments: Experiment[];
};

export default function Home() {
  const [adCopy, setAdCopy] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzePage = async () => {
    if (!adCopy.trim() || !landingPageUrl.trim()) {
      setError("Please enter both ad copy and landing page URL.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adCopy,
          landingPageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setAdCopy(
      "Get 20% off your first order. Discover premium skincare for healthy-looking skin. Find the right routine for your skin. Shop now."
    );

    setLandingPageUrl("https://www.cerave.com/");
    setError("");
    setAnalysis(null);
  };

  const getStatusClass = (status: CategoryStatus) => {
    if (status === "Strong") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Good") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "Partial") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  const getStatusDot = (status: CategoryStatus) => {
    if (status === "Strong") return "bg-emerald-500";
    if (status === "Good") return "bg-blue-500";
    if (status === "Partial") return "bg-amber-500";
    return "bg-red-500";
  };

  const getImpactClass = (impact: Experiment["impact"]) => {
    if (impact === "High") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    if (impact === "Medium") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getOverallLabel = (score: number) => {
    if (score >= 90) return "Very strong alignment";
    if (score >= 70) return "Good alignment";
    if (score >= 50) return "Partial alignment";
    return "Significant mismatch";
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-lg font-bold text-white">
              A
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                AdFit AI
              </h1>

              <p className="text-xs text-slate-500">
                Ad-to-Landing Page Fit Analyzer
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 sm:block">
            Evidence-based analysis
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
        {/* Hero */}
        {!analysis && (
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              ✦ Built for conversion teams
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Does your landing page
              <span className="block text-slate-500">
                deliver on the ad promise?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              AdFit AI compares your ad message with the actual landing page
              experience and identifies specific gaps, evidence, and experiments.
            </p>
          </div>
        )}

        {/* Input Card */}
        {!analysis && (
          <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6">
              {/* Ad Copy */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800">
                    Ad Copy
                  </label>

                  <button
                    type="button"
                    onClick={loadDemo}
                    className="text-xs font-semibold text-slate-500 transition hover:text-slate-950"
                  >
                    Use demo
                  </button>
                </div>

                <textarea
                  value={adCopy}
                  onChange={(e) => setAdCopy(e.target.value)}
                  placeholder="Paste your ad headline, body copy, offer, and CTA..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
              </div>

              {/* URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Landing Page URL
                </label>

                <input
                  value={landingPageUrl}
                  onChange={(e) => setLandingPageUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <button
                type="button"
                onClick={analyzePage}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing landing page...
                  </span>
                ) : (
                  "Analyze Ad Fit →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        {!analysis && !loading && (
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                title: "Message continuity",
                text: "See whether the landing page continues the promise made in the ad.",
              },
              {
                title: "Evidence-based",
                text: "Findings are grounded in actual ad and landing page content.",
              },
              {
                title: "Actionable experiments",
                text: "Turn detected gaps into focused optimization ideas.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 h-2 w-8 rounded-full bg-slate-950" />

                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              Analyzing your ad experience
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Extracting landing page evidence and comparing it with your ad.
            </p>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <section className="mx-auto max-w-5xl">
            {/* Result Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Analysis complete
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                  Ad-to-page fit
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAnalysis(null);
                  setError("");
                }}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
              >
                ← New analysis
              </button>
            </div>

            {/* Score + Breakdown */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Overall Score */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Overall Fit
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tight text-slate-950">
                    {analysis.overallFit}
                  </span>

                  <span className="mb-2 text-lg text-slate-400">
                    /100
                  </span>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        Math.max(analysis.overallFit, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-xs font-semibold text-slate-400">
                  {getOverallLabel(analysis.overallFit)}
                </p>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {analysis.summary}
                </p>
              </div>

              {/* Breakdown */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-950">
                    Fit breakdown
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Evidence from the ad and landing page.
                  </p>
                </div>

                <div className="space-y-4">
                  {analysis.categories.map((category) => (
                    <div
                      key={category.name}
                      className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${getStatusDot(
                                category.status
                              )}`}
                            />

                            <h4 className="font-semibold text-slate-900">
                              {category.name}
                            </h4>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {category.finding}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              category.status
                            )}`}
                          >
                            {category.status}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {category.score}/100
                          </span>
                        </div>
                      </div>

                      {/* Evidence */}
                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Ad evidence
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {category.adEvidence}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Page evidence
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {category.pageEvidence}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                          Confidence: {category.confidence}
                        </span>

                        <span className="text-xs font-medium text-slate-300">
                          Evidence match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experiments */}
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Recommended next steps
                </p>

                <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  Experiment ideas
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Practical tests connected to the detected fit gaps.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {analysis.experiments.map((experiment) => (
                  <div
                    key={experiment.title}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-slate-950">
                        {experiment.title}
                      </h4>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getImpactClass(
                          experiment.impact
                        )}`}
                      >
                        {experiment.impact} impact
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        {experiment.effort} effort
                      </span>
                    </div>

                    <div className="mt-5 space-y-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">
                          Hypothesis
                        </p>

                        <p className="mt-1 leading-6 text-slate-600">
                          {experiment.hypothesis}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          Change
                        </p>

                        <p className="mt-1 leading-6 text-slate-600">
                          {experiment.change}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          Success metric
                        </p>

                        <p className="mt-1 leading-6 text-slate-600">
                          {experiment.successMetric}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-300">
                    Ready for another test?
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Compare another ad with its landing page.
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setError("");
                  }}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Start new analysis
                </button>
              </div>
            </div>
          </section>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-slate-400">
          AdFit AI · Evidence over assumptions
        </div>
      </footer>
    </main>
  );
}
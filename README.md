# AdFit AI

### Ad-to-Landing Page Fit Analyzer

AdFit AI is an LLM-powered CRO mini-tool that analyzes whether a landing page delivers on the promise made by an advertisement.

Instead of generating generic marketing recommendations, AdFit AI extracts content from the actual landing page and compares it with the ad copy to identify message gaps, offer mismatches, audience alignment issues, missing proof, objection-handling gaps, and CTA inconsistencies.

---

## Problem

A common conversion problem occurs when an advertisement makes a specific promise but the landing page does not immediately reinforce that promise.

For example:

- An ad promotes a discount, but the landing page does not mention it.
- An ad targets a specific audience, but the landing page uses generic messaging.
- An ad highlights a product benefit, but the landing page prioritizes unrelated content.
- An ad uses a specific CTA, while the landing page presents a different action.

These gaps can create friction between the user's expectation and the landing page experience.

AdFit AI is designed to make these gaps visible and actionable.

---

## What AdFit AI Does

The user provides:

1. Advertisement copy
2. Landing page URL

AdFit AI then:

1. Fetches the landing page.
2. Extracts relevant page content.
3. Identifies the page title, metadata, headings, CTAs, and visible text.
4. Sends the ad and extracted page evidence to an LLM.
5. Compares the ad promise with the landing page experience.
6. Scores the overall fit.
7. Provides category-level findings with supporting evidence.
8. Generates CRO experiment ideas based on detected gaps.

---

## Analysis Categories

AdFit AI evaluates seven areas:

### 1. Message Continuity

Does the landing page continue the main message and promise introduced in the advertisement?

### 2. Offer Alignment

Does the landing page clearly support the offer, discount, promotion, or incentive communicated in the ad?

### 3. Audience / Persona Alignment

Does the landing page speak to the audience implied by the advertisement?

### 4. Product / Value Proposition Alignment

Does the landing page reinforce the product benefits and value proposition communicated in the ad?

### 5. Proof / Trust

Does the landing page provide evidence that supports the claims or expectations created by the advertisement?

### 6. Objection Handling

Does the page address potential concerns that could prevent the visitor from taking action?

### 7. CTA Alignment

Does the landing page provide a clear next step that matches the intent created by the advertisement?

---

## Evidence-Based Analysis

A core design principle of AdFit AI is:

> Evidence over assumptions.

The analyzer is instructed to ground findings in the supplied advertisement and extracted landing page content.

Each category can contain:

- Score
- Status
- Finding
- Ad evidence
- Page evidence
- Confidence level

If evidence is not available, the model is instructed to explicitly identify the missing evidence rather than inventing information.

---

## Example

### Advertisement

```text
Get 20% off your first order.
Discover premium skincare for healthy-looking skin.
Find the right routine for your skin.
Shop now.

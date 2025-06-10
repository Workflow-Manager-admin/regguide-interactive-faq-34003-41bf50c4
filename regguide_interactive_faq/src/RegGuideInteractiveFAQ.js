import React, { useState } from "react";

/**
 * RegGuideInteractiveFAQ - Interactive FAQ for Company/Business Registration
 * Implements:
 * - Step-by-step guided question flow
 * - Progressive disclosure
 * - Dynamic FAQ and required document checklist
 * - Issued documents summary
 *
 * UI is clean, card/modal style, with modern emphasis on progressive reveal and tailored content display.
 */

// Sample data model for registration flows, FAQs, required docs, & summary outcomes
const registrationFlows = [
  {
    question: "What are you registering?",
    key: "regType",
    options: [
      { value: "company", label: "A Company" },
      { value: "business", label: "A Business/Trade Name" },
    ],
  },
  {
    question: "What is the business type?",
    key: "businessType",
    dependsOn: { regType: "company" },
    options: [
      { value: "local", label: "Local/Resident" },
      { value: "overseas", label: "Overseas/Foreign" },
    ],
  },
  {
    question: "Will you register online or in-person?",
    key: "mode",
    options: [
      { value: "online", label: "Online" },
      { value: "inperson", label: "In person" },
    ],
  },
];

// Sample FAQ/content based on answers
const scenarioContent = [
  {
    match: { regType: "company", businessType: "local" },
    faqs: [
      {
        q: "What is required to register a local company?",
        a: "You will need to provide the completed registration form (Form A1), company constitution, proof of address, director/shareholder details, and pay the prescribed fee.",
      },
      {
        q: "How long does registration take?",
        a: "Online applications are typically processed within 1-2 business days. In-person submissions may vary.",
      },
    ],
    docs: [
      {
        label: "Form A1 (Application for Incorporation)",
        type: "form",
        required: true,
        icon: "📝",
      },
      {
        label: "Company Constitution",
        type: "document",
        required: true,
        icon: "📄",
      },
      {
        label: "Proof of Registered Office Address",
        type: "address",
        required: true,
        icon: "🏢",
      },
      {
        label: "Director/Shareholder Details (IDs)",
        type: "id",
        required: true,
        icon: "🪪",
      },
      {
        label: "Fee Payment Receipt",
        type: "payment",
        required: true,
        icon: "💳",
      },
    ],
    cost: 120,
    issuedDocs: [
      { label: "Certificate of Incorporation", validity: "Permanent", icon: "🏆" },
      { label: "Company Extract", validity: "On demand", icon: "📑" },
    ],
  },
  {
    match: { regType: "company", businessType: "overseas" },
    faqs: [
      {
        q: "What extra documents are needed for an overseas company?",
        a: "You must additionally provide a letter of consent from the home country and proof of compliance with local agency requirements.",
      },
    ],
    docs: [
      {
        label: "Home Country Consent Letter",
        type: "document",
        required: true,
        icon: "🌐",
      },
      {
        label: "Proof of Local Agency Compliance",
        type: "document",
        required: true,
        icon: "✅",
      },
    ],
    cost: 200,
    issuedDocs: [
      { label: "Foreign Company Certificate", validity: "Permanent", icon: "🏆" },
      { label: "Registration Extract", validity: "On demand", icon: "📑" },
    ],
  },
  {
    match: { regType: "business" },
    faqs: [
      {
        q: "What is needed for a trade name registration?",
        a: "A completed application form (Form BN1), owner details, and payment receipt.",
      },
    ],
    docs: [
      {
        label: "Form BN1 (Business Name Application)",
        type: "form",
        required: true,
        icon: "📝",
      },
      {
        label: "Owner's Identification",
        type: "id",
        required: true,
        icon: "🪪",
      },
      {
        label: "Fee Payment Receipt",
        type: "payment",
        required: true,
        icon: "💵",
      },
    ],
    cost: 60,
    issuedDocs: [
      { label: "Business Name Certificate", validity: "1-3 years", icon: "🏆" },
    ],
  },
];

// Helper: find scenario content with best match given current answers
function getScenario(answers) {
  // Prioritize most specific matches
  let match = null;
  let matchedKeysCount = -1;
  for (const scenario of scenarioContent) {
    let keys = Object.keys(scenario.match);
    let matches = keys.every((k) => answers[k] === scenario.match[k]);
    if (matches && keys.length > matchedKeysCount) {
      match = scenario;
      matchedKeysCount = keys.length;
    }
  }
  // fallback to first scenario if not matched
  return match || scenarioContent[0];
}

// Document Checklist component
// PUBLIC_INTERFACE
function DocumentChecklist({ docs, cost }) {
  /** Checklist for required documents */
  return (
    <section style={{ margin: "24px 0 24px 0" }}>
      <h3 style={{ color: "#0a3b85", marginBottom: 4 }}>Required Documents</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {docs.map((d, i) => (
          <li key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1.25rem", marginRight: 10 }}>{d.icon}</span>
            <span>{d.label}</span>
            <span style={{ marginLeft: "auto", color: "#888", fontSize: 13 }}>
              {d.required ? "Required" : "Optional"}
            </span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>
        <span style={{ fontWeight: 500 }}>Estimated Govt. Fee:&nbsp;</span>
        <span style={{ color: "#2e7055", fontWeight: 600 }}>${cost || "-"}</span>
      </div>
    </section>
  );
}

// Issued Documents Summary component
// PUBLIC_INTERFACE
function IssuedDocumentsSummary({ issuedDocs }) {
  /** Shows summary table of documents to be given after registration */
  return (
    <section style={{ margin: "18px 0 16px 0" }}>
      <h3 style={{ color: "#0a3b85", marginBottom: 4 }}>Issued Documents Summary</h3>
      <table style={{ width: "100%", background: "#F4F5F7", borderRadius: 8, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 6, fontWeight: 500, fontSize: 15 }}>Document</th>
            <th style={{ textAlign: "center", padding: 6, fontWeight: 500, fontSize: 15 }}>Validity</th>
          </tr>
        </thead>
        <tbody>
          {issuedDocs.map((doc, i) => (
            <tr key={i} style={{ borderTop: i ? "1px solid #eee" : undefined }}>
              <td style={{ padding: 8 }}>
                <span style={{ fontSize: 18, marginRight: 8 }}>{doc.icon}</span>
                {doc.label}
              </td>
              <td style={{ textAlign: "center", padding: 8 }}>{doc.validity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// FAQ List component
// PUBLIC_INTERFACE
function FAQList({ faqs }) {
  /** Renders FAQs, with collapsible answers */
  const [openIdx, setOpenIdx] = useState(null);
  if (!faqs?.length) return null;
  return (
    <section style={{ margin: "20px 0" }}>
      <h3 style={{ color: "#0a3b85", marginBottom: 12 }}>FAQs for Your Scenario</h3>
      <div>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: "#ffffff",
            borderRadius: 5,
            marginBottom: 8,
            border: "1px solid #eaeaea",
            boxShadow: openIdx === i ? "0 2px 10px 0 #E0E5F7" : "none"
          }}>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                color: "#0a3b85",
                fontWeight: 500,
                fontSize: 16,
                borderBottom: openIdx === i ? "1px solid #eaeaea" : "none",
                display: "flex", alignItems: "center"
              }}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span style={{
                fontSize: "1rem",
                marginRight: 10,
                transition: "transform 0.15s cubic-bezier(.4,2,.5,1)",
                transform: openIdx === i ? "rotate(90deg)" : "rotate(0)"
              }}>&#9654;</span>
              {faq.q}
            </div>
            {openIdx === i && (
              <div style={{ padding: "14px 24px", color: "#333", background: "#F8F9FC", fontSize: 15 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Step question UI - A single question with options as buttons
function StepQuestion({ question, options, value, onAnswer }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      margin: "18px 0",
      padding: "28px 24px",
      boxShadow: "0 2px 22px 0 rgba(10,59,133,0.05)",
      maxWidth: 480,
      minWidth: 240,
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <div style={{ fontSize: 18, marginBottom: 18, color: "#0a3b85", fontWeight: 500 }}>
        {question}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className="btn"
            style={{
              background: value === opt.value ? "#2e7055" : "#0a3b85",
              color: "#fff",
              fontWeight: 500,
              fontSize: 16,
              transition: "background 0.18s cubic-bezier(.5,1,.4,1)",
            }}
            onClick={() => onAnswer(opt.value)}
          >{opt.label}</button>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function RegGuideInteractiveFAQ() {
  /**
   * Main container for interactive FAQ. Handles flow, state, and shows relevant info per scenario.
   */
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  // Determine active step based on answers and question dependencies
  let stepIdx = 0;
  for (let i = 0; i < registrationFlows.length; i++) {
    const dep = registrationFlows[i].dependsOn;
    if (dep && Object.entries(dep).some(([k, v]) => answers[k] !== v)) {
      continue; // skip this step, does not apply due to dependency
    }
    if (!answers[registrationFlows[i].key]) {
      stepIdx = i;
      break;
    }
    stepIdx = i + 1;
  }

  const currentStep = (() => {
    let count = -1;
    for (let i = 0; i < registrationFlows.length; i++) {
      const dep = registrationFlows[i].dependsOn;
      if (dep && Object.entries(dep).some(([k, v]) => answers[k] !== v)) {
        continue;
      }
      count++;
      if (!answers[registrationFlows[i].key]) {
        return {
          ...registrationFlows[i],
          stepNumber: count + 1,
          totalSteps: registrationFlows.filter(
            s => !s.dependsOn || Object.entries(s.dependsOn).every(([k, v]) => answers[k] === v)
          ).length,
        };
      }
    }
    return null;
  })();

  // Once all relevant questions are answered, compute scenario
  const allQuestionsAnswered = currentStep === null;
  const scenario = getScenario(answers);

  // Progressive Disclosure: fade-in/expand after last step
  return (
    <div style={{
      background: "#F4F5F7",
      minHeight: "calc(100vh - 64px)",
      paddingTop: 48, // leave space for navbar
      transition: "background 0.4s",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
        padding: "40px 0 32px 0",
        maxWidth: 520,
      }}>
        <h2 style={{
          color: "#0a3b85",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-1px",
          margin: "0 0 10px 0",
          textAlign: "center"
        }}>
          Company & Business Registration FAQ Guide
        </h2>
        <div style={{
          color: "#333",
          background: "#fff",
          borderRadius: 6,
          fontSize: 16,
          padding: "16px 24px",
          marginBottom: 14,
          boxShadow: "0 1px 11px 0 rgba(44,72,133,0.04)"
        }}>
          Start with a few questions and we’ll show exactly what you need to know.
        </div>

        {/* Step Questions */}
        <div style={{ width: "100%" }}>
          {!allQuestionsAnswered && currentStep && (
            <StepQuestion
              question={currentStep.question}
              options={currentStep.options}
              value={answers[currentStep.key] || null}
              onAnswer={(v) => {
                setAnswers({ ...answers, [currentStep.key]: v });
                setStep(step + 1);
              }}
            />
          )}
        </div>

        {/* Progressive Disclosure: Show tailored FAQ, checklist etc. */}
        {allQuestionsAnswered && (
          <div
            style={{
              width: "100%",
              marginTop: 32,
              animation: "fadeInSlide .8s cubic-bezier(.2,1,.2,1)",
            }}>
            <FAQList faqs={scenario.faqs} />
            <DocumentChecklist docs={scenario.docs} cost={scenario.cost} />
            <IssuedDocumentsSummary issuedDocs={scenario.issuedDocs} />

            {/* Restart/Start again button */}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                className="btn"
                style={{
                  background: "#0a3b85",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  minWidth: 120,
                  borderRadius: 6,
                  marginTop: 8
                }}
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Inline animation for fadeInSlide */}
      <style>
        {`
        @keyframes fadeInSlide {
          0% { opacity: 0; transform: translateY(50px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}

export default RegGuideInteractiveFAQ;

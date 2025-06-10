import React from 'react';
import './App.css';
import RegGuideInteractiveFAQ from "./RegGuideInteractiveFAQ";

// There should be no direct reference to PUBLIC_URL here to prevent build errors.

/**
 * Main app: shows navbar, passes through to the RegGuideInteractiveFAQ container.
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <span style={{
              background: "#0a3b85",
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
              borderRadius: "4px",
              padding: "8px 16px"
            }}>
              RegGuide Interactive FAQ
            </span>
          </div>
        </div>
      </nav>
      <main>
        <RegGuideInteractiveFAQ />
      </main>
    </div>
  );
}

export default App;
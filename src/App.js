import React, { useState } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");

  const generatePassword = () => {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charSet = "";
    if (includeUppercase) charSet += upperCaseChars;
    if (includeLowercase) charSet += lowerCaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    if (charSet === "") {
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      newPassword += charSet[randomIndex];
    }
    setPassword(newPassword);
    evaluateStrength(newPassword);
  };

  const copyToClipboard = () => {
    if (!password) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(password).then(() => {
        showCopiedNotification();
      }).catch((err) => {
        fallbackCopy(password);
      });
    } else {
      fallbackCopy(password);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      showCopiedNotification();
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textarea);
  };

  const showCopiedNotification = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const evaluateStrength = (pwd) => {
    let score = 0;
    if(/[A-Z]/.test(pwd)) score++;
    if(/[a-z]/.test(pwd)) score++;
    if(/[0-9]/.test(pwd)) score++;
    if(/[^A-Za-z0-9]/.test(pwd)) score++;
    if(pwd.length >= 16) score++;

    if (score <= 1) setStrength("Weak");
    else if (score === 2) setStrength("Medium");
    else if (score === 3 || score === 4) setStrength("Strong");
    else if (score >= 5) setStrength("Very Strong"); 
  };

  return (
   <div className={`container ${darkMode ? 'dark' : ''}`}> 
    <div className="App">
    <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
      <h1>Password Generator 🔐</h1>

      <div className="output">
        <input type={showPassword ? "text" : "password"} value={password} readOnly placeholder="Your password will appear here" />
        <button onClick={toggleShowPassword} title="Show/Hide">
          {showPassword ? "🙈" : "👁️"}
        </button>
        <button onClick={copyToClipboard} title="Copy">
          📋
        </button>
      </div>
      {password && <div className={`strength ${strength.toLowerCase()}`}>Strength: {strength}</div>}
      {copied && <div className="toast">✅ Password copied to clipboard!</div>}

      <div className="settings">
        <label>
          Length:
          <input
            type="number"
            min="4"
            max="50"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
          />
          Uppercase Letters
        </label>

        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
          />
          Lowercase Letters
        </label>

        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          Numbers
        </label>

        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          Symbols
        </label>
      </div>

      <button className="generate-btn" onClick={generatePassword}>
        Generate Password
      </button>
    </div>
  </div>  
  );
}

export default App;

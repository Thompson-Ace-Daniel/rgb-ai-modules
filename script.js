// Importing Roast & Compliment Data
import { roasts } from 'https://thompson-ace-daniel.github.io/rgb-ai-modules/roast.js';
import { compliments } from 'https://thompson-ace-daniel.github.io/rgb-ai-modules/compliment.js';

// DOM Elements
const nameInput = document.getElementById("nameInput");
const modeSelect = document.getElementById("mode");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("outputText");
const copyBtn = document.getElementById("copyBtn");
const ttsBtn = document.getElementById("ttsBtn");
const shareBtn = document.getElementById("shareBtn");
const toast = document.getElementById("toast");
const container = document.querySelector(".container");
const body = document.body;
const shareSection = document.getElementById("shareSection");

// Track used messages
let usedRoasts = [];
let usedCompliments = [];

// Get random line
function getRandomLine(arr, usedArr) {
  if (arr.length === 0) {
    arr.push(...usedArr);
    usedArr.length = 0;
  }
  const i = Math.floor(Math.random() * arr.length);
  const msg = arr[i];
  usedArr.push(...arr.splice(i, 1));
  return msg;
}

// Mode theme switch
modeSelect.addEventListener("change", () => {
  output.innerText = "";
  const mode = modeSelect.value;
  mode === "roast" ? applyDarkMode() : applyHeavenMode();
});

// Generate Message
generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim() || "Hey There!";
  const mode = modeSelect.value;
  const msg = mode === "roast"
    ? `${name}, ${getRandomLine(roasts, usedRoasts)}`
    : `${name}, ${getRandomLine(compliments, usedCompliments)}`;
  output.innerText = msg;
  output.classList.remove("animate");
  void output.offsetWidth;
  output.classList.add("animate");
  shareSection.style.display = "flex";
});

// Copy
copyBtn.addEventListener("click", () => {
  const text = output.innerText;
  if (!text) return;
  navigator.clipboard?.writeText(text)
    .then(() => showToast("Copied to clipboard!"))
    .catch(() => showToast("Failed to copy."));
});

// Speak via Web Speech API (Browser TTS)
function speakWithWebTTS(text) {
  if (!text || !'speechSynthesis' in window) {
    showToast("TTS not supported on this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

ttsBtn.addEventListener("click", () => {
  const text = output.innerText;
  if (!text) return;
  speakWithWebTTS(text);
});

// Share API
shareBtn.addEventListener("click", async () => {
  const text = output.innerText;
  if (!text || !navigator.share) return showToast("Sharing not supported.");
  try {
    await navigator.share({ title: "AI Generator", text, url: window.location.href });
  } catch {
    showToast("Failed to share.");
  }
});

// Toast
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Themes
function applyHeavenMode() {
  body.classList.add("heaven");
  container.classList.add("heaven");
  output.classList.add("heaven");
  toast.classList.add("heaven");
  document.querySelectorAll("button, input, select, h1, #shareSection").forEach(e => e.classList.add("heaven"));
}

function applyDarkMode() {
  body.classList.remove("heaven");
  container.classList.remove("heaven");
  output.classList.remove("heaven");
  toast.classList.remove("heaven");
  document.querySelectorAll("button, input, select, h1, #shareSection").forEach(e => e.classList.remove("heaven"));
  }

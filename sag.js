// Importing Roast & Compliment Data
import { roasts } from './roast.js';
import { compliments } from './compliment.js';

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

// Helper function: Get random line from an array
function getRandomLine(arr, usedArr) {
  if (arr.length === 0) {
    arr.push(...usedArr);
    usedArr.length = 0; // Clear used array
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  const message = arr[randomIndex];

  // Move the used message to the used array
  usedArr.push(...arr.splice(randomIndex, 1));

  return message;
}

// Helper function: Get the appropriate voice based on the mode
function getVoice(mode) {
  const voices = speechSynthesis.getVoices();
  const roastVoice = voices.find(v =>
    v.name.toLowerCase().includes("daniel") ||
    v.name.toLowerCase().includes("google") ||
    v.name.toLowerCase().includes("zira") ||
    v.lang.toLowerCase().includes("en-ng")
  ) || voices[0];

  const complimentVoice = voices.find(v =>
    v.name.toLowerCase().includes("samantha") ||
    v.name.toLowerCase().includes("google") ||
    v.name.toLowerCase().includes("zira")
  ) || voices[0];

  return mode === "roast" ? roastVoice : complimentVoice;
}

// Function to switch themes when the mode changes
modeSelect.addEventListener("change", () => {
  output.innerText = "";

  const mode = modeSelect.value;

  if (mode === "roast") {
    applyDarkMode(); // Apply dark theme for Roast
  } else {
    applyHeavenMode(); // Apply heaven theme for Compliment
  }
});

// Generate message function
generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim() || "Hey There!";
  const mode = modeSelect.value;

  let message = "";
  if (mode === "roast") {
    message = `${name}, ${getRandomLine(roasts, usedRoasts)}`;
  } else {
    message = `${name}, ${getRandomLine(compliments, usedCompliments)}`;
  }

  output.innerText = message;
  output.classList.remove("animate");
  void output.offsetWidth; // Trigger reflow
  output.classList.add("animate");
  shareSection.style.display = "flex";
});

// Copy text to clipboard
copyBtn.addEventListener("click", () => {
  const text = output.innerText;
  if (!text) return;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!");
    }).catch(() => {
      showToast("Failed to copy.");
    });
  } else {
    showToast("Clipboard API not supported.");
  }
});

// Speak text function using Eleven Labs API
async function speakWithElevenLabsAPI(text, mode) {
  const response = await fetch('/api/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      mode
    }),
  });

  if (response.ok) {
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    showToast("Failed to generate speech.");
  }
}

// Speak text
ttsBtn.addEventListener("click", () => {
  const text = output.innerText;
  if (!text) return;

  const mode = modeSelect.value;
  speakWithElevenLabsAPI(text, mode);
});

// Share text to social media or apps
shareBtn.addEventListener("click", async () => {
  const text = output.innerText;
  if (!text || !navigator.share) {
    showToast("Sharing not supported on this device.");
    return;
  }

  try {
    await navigator.share({
      text,
      title: "AI Generator",
      url: window.location.href,
    });
  } catch (err) {
    showToast("Failed to share.");
  }
});

// Toast Notification helper function
function showToast(message) {
  if (!message) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Apply Heaven Mode (Compliment theme)
function applyHeavenMode() {
  body.classList.add("heaven");
  container.classList.add("heaven");
  output.classList.add("heaven");
  toast.classList.add("heaven");
  document.querySelectorAll("button").forEach(btn => btn.classList.add("heaven"));
  document.querySelectorAll("input, select").forEach(el => el.classList.add("heaven"));
  shareSection.classList.add("heaven");
  document.querySelector("h1").classList.add("heaven");
}

// Apply Dark Mode (Roast theme)
function applyDarkMode() {
  body.classList.remove("heaven");
  container.classList.remove("heaven");
  output.classList.remove("heaven");
  toast.classList.remove("heaven");
  document.querySelectorAll("button").forEach(btn => btn.classList.remove("heaven"));
  document.querySelectorAll("input, select").forEach(el => el.classList.remove("heaven"));
  shareSection.classList.remove("heaven");
  document.querySelector("h1").classList.remove("heaven");
}

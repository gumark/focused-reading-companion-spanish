console.log("Loaded FRC extension");

document.addEventListener('mouseup', async () => {
  const phrase = window.getSelection().toString().trim();

  if (!phrase || phrase.length > 300) return;

  console.log(`🔍 Translating: "${phrase}"`);

  try {
    const encodedPhrase = encodeURIComponent(phrase);
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedPhrase}&langpair=es|en`);

    if (!response.ok) {
      console.warn(`⚠️ Translation failed for "${phrase}"`);
      return;
    }

    const data = await response.json();
    const translation = data.responseData.translatedText;

    if (translation && translation.toLowerCase() !== phrase.toLowerCase()) {
      showTooltip(phrase, translation); // 👈 use phrase, not "word"
    }

  } catch (err) {
    console.error("💥 Error during translation:", err);
  }
});


function showTooltip(original, translation) {
  // Save to history
  chrome.storage.local.get({ history: [] }, (result) => {
    const history = result.history;
    const newEntry = { original, translation, time: Date.now() };

    // Avoid duplicates
    if (!history.find(h => h.original === original && h.translation === translation)) {
      history.unshift(newEntry); // Add to front
      if (history.length > 50) history.pop(); // Limit to last 50 entries
      chrome.storage.local.set({ history });
    }
  });

  // Tooltip code...
  const old = document.getElementById('frc-tooltip');
  if (old) old.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'frc-tooltip';
  tooltip.innerText = `"${original}" → ${translation}`;
  // ... same styling code ...
  // ... same positioning code ...
  document.body.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 5000);
}

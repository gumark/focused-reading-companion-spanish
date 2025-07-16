console.log("Loaded FRC extension");

document.addEventListener('mouseup', async () => {
  const phrase = window.getSelection().toString().trim();

  if (!phrase || phrase.length > 300) return;

  console.log(`🔍 Translating: "${phrase}"`);
  console.log("Fetching:", `https://api.mymemory.translated.net/get?q=${encodeURIComponent(phrase)}&langpair=es|en`);


  try {
    const encodedPhrase = encodeURIComponent(phrase);
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedPhrase}&langpair=es|en`);

    if (!response.ok) {
      console.warn(`⚠️ Translation failed for "${phrase}"`);
      return;
    }

    const data = await response.json();
    console.log("📦 API response:", data);
    const translation = data.responseData.translatedText;

    if (translation && translation.toLowerCase() !== phrase.toLowerCase()) {
      showTooltip(phrase, translation); // 👈 use phrase, not "word"
    }

  } catch (err) {
    console.error("💥 Error during translation:", err);
  }
});


function showTooltip(original, translation) {
  const old = document.getElementById('frc-tooltip');
  if (old) old.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'frc-tooltip';
  tooltip.innerHTML = `
    <div><span style="color:#c92c2c; font-weight:bold;">${original}</span></div>
    <div style="margin-top: 4px;">→ <span style="color:#2c7ec9;">${translation}</span></div>
  `;

  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '9999';
  tooltip.style.background = '#fff';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '8px';
  tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  tooltip.style.fontFamily = 'Segoe UI, sans-serif';
  tooltip.style.fontSize = '14px';
  tooltip.style.color = '#333';
  tooltip.style.maxWidth = '300px';
  tooltip.style.wordWrap = 'break-word';

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.top - 40}px`;
    tooltip.style.left = `${window.scrollX + rect.left}px`;
  } else {
    tooltip.style.top = '20px';
    tooltip.style.left = '20px';
  }

  document.body.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 5000);
}


window.testTooltip = () => {
  showTooltip("Hola", "Hello");
};
// send help
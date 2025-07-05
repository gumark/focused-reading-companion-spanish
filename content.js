console.log("Loaded FRC extension");

document.addEventListener('mouseup', async () => {
  const selection = window.getSelection().toString().trim();

  // skip if selection is empty or too long
  if (!selection || selection.length > 300) return;

  const phrase = selection;
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
      showTooltip(phrase, translation);
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
  tooltip.innerText = `"${original}" → ${translation}`;

  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '9999';
  tooltip.style.background = '#fff';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '6px 10px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  tooltip.style.fontFamily = 'sans-serif';
  tooltip.style.fontSize = '14px';
  tooltip.style.color = '#333';
  tooltip.style.maxWidth = '300px';
  tooltip.style.wordWrap = 'break-word';

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.top = `${window.scrollY + rect.top - 40}px`;
  tooltip.style.left = `${window.scrollX + rect.left}px`;

  document.body.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 5000);
}

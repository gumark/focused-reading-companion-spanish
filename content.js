console.log("Loaded FRC extension");

document.addEventListener('mouseup', async () => {
  const selection = window.getSelection().toString().trim();

  if (!selection || selection.length < 1) return;

  const text = selection;
  console.log(`🔍 Translating: "${text}"`);

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
    const data = await response.json();

    const translated = data.responseData.translatedText;
    if (!translated) {
      console.warn("⚠️ No translation found.");
      return;
    }

    showTooltip(text, translated);
  } catch (err) {
    console.error("💥 Error during translation:", err);
  }
});

function showTooltip(original, translation) {
  const old = document.getElementById('frc-tooltip');
  if (old) old.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'frc-tooltip';
  tooltip.innerHTML = `<strong style="color: #1a73e8">${original}</strong><br><span>${translation}</span>`;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.position = 'absolute';
  tooltip.style.background = '#fff';
  tooltip.style.border = '1px solid #ccc';
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '10px';
  tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  tooltip.style.zIndex = '999999';
  tooltip.style.top = `${window.scrollY + rect.top - 50}px`;
  tooltip.style.left = `${window.scrollX + rect.left}px`;

  document.body.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 5000);
}

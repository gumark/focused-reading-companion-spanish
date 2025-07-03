document.addEventListener('mouseup', async () => {
  const selection = window.getSelection().toString().trim();

  if (!selection || selection.split(" ").length > 1) return;

  const word = selection;
  console.log(`🔍 Translating: "${word}"`);

  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: word,
        source: "es",
        target: "en",
        format: "text"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`No translation found for "${word}":`, errorText);
      return;
    }

    const data = await response.json();
    const translation = data.translatedText;

    if (translation) {
      showTooltip(word, translation);
    }

  } catch (err) {
    console.error("💥 Error translating:", err);
  }
});

function showTooltip(original, translation) {
  const old = document.getElementById('frc-tooltip');
  if (old) old.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'frc-tooltip';
  tooltip.innerText = `"${original}" → ${translation}`;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.top = `${window.scrollY + rect.top - 40}px`;
  tooltip.style.left = `${window.scrollX + rect.left}px`;

  document.body.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 4000);
}

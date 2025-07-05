chrome.storage.local.get({ history: [] }, (result) => {
  const historyDiv = document.getElementById('history');
  const history = result.history;

  if (history.length === 0) {
    historyDiv.textContent = "No translations yet.";
    return;
  }

  for (const item of history) {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <strong>${item.original}</strong><br/>
      → ${item.translation}
      <small>${new Date(item.time).toLocaleTimeString()}</small>
    `;
    historyDiv.appendChild(div);
  }
});

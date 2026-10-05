let links = JSON.parse(localStorage.getItem('linkpulse_data')) || [
  { id: 1, title: 'Gumroad Digital Store', url: 'https://atoyebi8.gumroad.com', clicks: 12 },
  { id: 2, title: 'Developer Portfolio (DevPulse)', url: 'https://devpulse-adebare.netlify.app', clicks: 24 }
];

document.getElementById('linkForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('linkTitle').value.trim();
  const url = document.getElementById('linkUrl').value.trim();

  links.push({ id: Date.now(), title, url, clicks: 0 });
  saveAndRender();
  e.target.reset();
});

window.trackClick = function(id, url) {
  links = links.map(l => l.id === id ? { ...l, clicks: l.clicks + 1 } : l);
  saveAndRender();
  window.open(url, '_blank');
};

window.deleteLink = function(id) {
  links = links.filter(l => l.id !== id);
  saveAndRender();
};

function saveAndRender() {
  localStorage.setItem('linkpulse_data', JSON.stringify(links));

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  document.getElementById('totalLinks').textContent = links.length;
  document.getElementById('totalClicks').textContent = totalClicks;

  // Render Manage List
  const manageContainer = document.getElementById('manageList');
  if (links.length === 0) {
    manageContainer.innerHTML = '<p style="color:var(--muted); text-align:center;">No links added yet.</p>';
  } else {
    manageContainer.innerHTML = links.map(l => `
      <div class="manage-item">
        <div>
          <strong>${l.title}</strong><br>
          <small style="color:var(--muted);">${l.url}</small>
        </div>
        <button class="btn-danger" onclick="deleteLink(${l.id})">Delete</button>
      </div>
    `).join('');
  }

  // Render Preview Links
  const publicContainer = document.getElementById('publicLinks');
  if (links.length === 0) {
    publicContainer.innerHTML = '<p style="color:var(--muted);">Add links to preview your bio card.</p>';
  } else {
    publicContainer.innerHTML = links.map(l => `
      <a class="link-btn" href="javascript:void(0)" onclick="trackClick(${l.id}, '${l.url}')">
        <span>${l.title}</span>
        <span class="clicks-badge">${l.clicks} clicks</span>
      </a>
    `).join('');
  }
}

// Initial render
saveAndRender();
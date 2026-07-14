// Shared UI helpers for the MindWell website
console.log('MindWell platform main.js loaded');

function setActiveNav(linkId) {
  const links = document.querySelectorAll('[data-nav-link]');
  links.forEach(link => link.classList.remove('active'));
  const active = document.getElementById(linkId);
  if (active) active.classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'homeLink',
    'about.html': 'aboutLink',
    'resources.html': 'resourcesLink',
    'contact.html': 'contactLink',
    'client_intake.html': 'intakeLink',
    'express.html': 'expressLink'
  };
  const activeId = map[path] || 'homeLink';
  setActiveNav(activeId);
});

const testModules = require('./test-module');
require('../css/app.css');

function openPopup(popupId) {
  document.getElementById(popupId).style.display = 'flex';
}

document.querySelectorAll('.add-teacher-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    openPopup('add-teacher-popup');
  });
});

document.querySelectorAll('.profile-photo').forEach((btn) => {
  btn.addEventListener('click', () => {
    openPopup('teacher-info-popup');
  });
});

document.querySelectorAll('.close-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('add-teacher-popup').style.display = 'none';
    document.getElementById('teacher-info-popup').style.display = 'none';
  });
});

console.log(testModules.hello);

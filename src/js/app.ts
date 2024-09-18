import { hello } from './test-module';
import '../css/app.css';

function openPopup(popupId: string): void {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'flex';
  }
}

// Event listeners for buttons
document.querySelectorAll<HTMLButtonElement>('.add-teacher-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    openPopup('add-teacher-popup');
  });
});

document.querySelectorAll<HTMLDivElement>('.profile-photo').forEach((btn) => {
  btn.addEventListener('click', () => {
    openPopup('teacher-info-popup');
  });
});

document.querySelectorAll<HTMLButtonElement>('.close-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const addTeacherPopup = document.getElementById('add-teacher-popup');
    const teacherInfoPopup = document.getElementById('teacher-info-popup');

    if (addTeacherPopup) addTeacherPopup.style.display = 'none';
    if (teacherInfoPopup) teacherInfoPopup.style.display = 'none';
  });
});

console.log(hello);

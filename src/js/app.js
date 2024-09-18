"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_module_1 = require("./test-module");
require("../css/app.css");
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'flex';
    }
}
// Event listeners for buttons
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
        const addTeacherPopup = document.getElementById('add-teacher-popup');
        const teacherInfoPopup = document.getElementById('teacher-info-popup');
        if (addTeacherPopup)
            addTeacherPopup.style.display = 'none';
        if (teacherInfoPopup)
            teacherInfoPopup.style.display = 'none';
    });
});
console.log(test_module_1.hello);

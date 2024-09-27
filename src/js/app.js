import { normalizedTeachers } from './teachers';
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
function getTeacherProfilePhotoHTML(teacher) {
    let pictureURL = teacher.picture_thumbnail || teacher.picture_large;
    function getInitials(teacher) {
        let firstAndLastName = teacher.full_name.split(' ');
        let firstNameInitial = firstAndLastName[0].charAt(0) + '. ';
        let lastNameInitial = firstAndLastName[1] ? firstAndLastName[1].charAt(0) : '';
        return `${firstNameInitial}${lastNameInitial}`;
    }
    return pictureURL ? `<div class="profile-photo"><img src="${pictureURL}" alt="${teacher.full_name}"/></div>` :
        `<div class="profile-photo initials"><span>${getInitials(teacher)}</span></div>`;
}
// Task 1
function createTeacherCard(teacher) {
    const profilePhotoHTML = getTeacherProfilePhotoHTML(teacher);
    return `
        <div class="teacher-card" data-teacher='${JSON.stringify(teacher)}'>
            ${profilePhotoHTML}
            <div class="teacher-info">
                <h2>${teacher.full_name}</h2>
                <p class="specialization">${teacher.course}</p>
                <p class="country">${teacher.country}</p>
            </div>
        </div>
    `;
}
function renderTeachers(teachers) {
    const container = document.querySelector('.teachers-container');
    if (container) {
        container.innerHTML = teachers.map(createTeacherCard).join('');
        addTeacherClickEvent();
    }
}
function showTeacherPopup(teacher) {
    const popup = document.querySelector('#teacher-info-popup');
    if (popup) {
        // Set the teacher photo
        const bodyElement = document.querySelector('#teacher-info-popup-body');
        bodyElement === null || bodyElement === void 0 ? void 0 : bodyElement.prepend(getTeacherProfilePhotoHTML(teacher));
        // Set the teacher name
        const nameElement = document.querySelector('#popup-teacher-name');
        if (nameElement) {
            nameElement.textContent = teacher.full_name;
        }
        // Set the teacher specialization (course)
        const specializationElement = document.querySelector('#popup-teacher-specialization');
        if (specializationElement) {
            specializationElement.textContent = teacher.course;
        }
        // Set the teacher location (city, country)
        const locationElement = document.querySelector('#popup-teacher-location');
        if (locationElement) {
            locationElement.textContent = `${teacher.city || ''}, ${teacher.country || ''}`.trim();
        }
        // Set the teacher gender and age
        const genderAgeElement = document.querySelector('#popup-teacher-gender-age');
        if (genderAgeElement) {
            genderAgeElement.textContent = `${teacher.age}, ${teacher.gender}`;
        }
        // Set the teacher email
        const emailElement = document.querySelector('#popup-teacher-email');
        if (emailElement) {
            emailElement.href = `mailto:${teacher.email}`;
            emailElement.textContent = teacher.email || 'No email provided';
        }
        // Set the teacher phone
        const phoneElement = document.querySelector('#popup-teacher-phone');
        if (phoneElement) {
            phoneElement.textContent = teacher.phone || 'No phone provided';
        }
        // Set the teacher notes or additional information
        const notesElement = document.querySelector('#popup-teacher-notes');
        if (notesElement) {
            notesElement.textContent = teacher.notes || 'No additional information available.';
        }
        // Show the popup
        popup.classList.add('visible');
        // Close the popup event
        const closeBtn = popup.querySelector('.close-btn');
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => {
            popup.classList.remove('visible');
        });
    }
}
function addTeacherClickEvent() {
    const teacherCards = document.querySelectorAll('.teacher-card');
    teacherCards.forEach((card) => {
        card.addEventListener('click', () => {
            const teacherData = card.getAttribute('data-teacher');
            if (teacherData) {
                const teacher = JSON.parse(teacherData);
                showTeacherPopup(teacher);
            }
        });
    });
}
renderTeachers(normalizedTeachers);

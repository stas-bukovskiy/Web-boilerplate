import '../css/app.css';
import {
    Courses,
    Teacher,
    normalizedTeachers,
    FilterParams,
    filterTeachers,
    validateTeacher,
    SortParams,
    sortTeachers
} from './teachers';

function openPopup(popupId: string): void {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'flex';
    }
}

document.querySelectorAll<HTMLButtonElement>('.add-teacher-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        openPopup('add-teacher-popup');
    });
});

function closePopup() {
    const addTeacherPopup = document.getElementById('add-teacher-popup');
    const teacherInfoPopup = document.getElementById('teacher-info-popup');

    if (addTeacherPopup) addTeacherPopup.style.display = 'none';
    if (teacherInfoPopup) teacherInfoPopup.style.display = 'none';
}

document.querySelectorAll<HTMLButtonElement>('.close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        closePopup();
    });
});


function getTeacherProfilePhotoHTML(teacher: Teacher): string {
    let pictureURL = teacher.picture_large || teacher.picture_thumbnail

    function getInitials(teacher: Teacher) {
        let firstAndLastName = teacher.full_name.split(' ')
        let firstNameInitial = firstAndLastName[0].charAt(0) + '. '
        let lastNameInitial = firstAndLastName[1] ? firstAndLastName[1].charAt(0) : ''
        return `${firstNameInitial}${lastNameInitial}`
    }

    const starredClass = teacher.favorite ? 'profile-starred' : '';
    return pictureURL ? `<div class="profile-photo ${starredClass}"><img src="${pictureURL}" alt="${teacher.full_name}"/></div>` :
        `<div class="profile-photo initials ${starredClass}"><span>${getInitials(teacher)}</span></div>`
}

// Task 1
function createTeacherCard(teacher: Teacher): string {
    const profilePhotoHTML = getTeacherProfilePhotoHTML(teacher);
    let firstAndLastName = teacher.full_name.split(' ')

    return `
        <div class="teacher-card" id="${teacher.id}">
            ${profilePhotoHTML}
            <div class="teacher-info">
                <h2>${firstAndLastName[0]}${'<br/>' + firstAndLastName[1] || ''}</h2>
                <p class="specialization">${teacher.course}</p>
                <p class="country">${teacher.country}</p>
            </div>
        </div>
    `;
}

function addTeacherClickEvent(): void {
    normalizedTeachers.map((teacher) => {
        const teacherCard = document.getElementById(teacher.id);
        if (teacherCard) {
            teacherCard.addEventListener('click', () => {
                showTeacherPopup(teacher);
            });
        }
    })
}

function renderTeachers(teachers: Teacher[]): void {
    const container = document.querySelector('.teachers-container');
    if (container) {
        container.innerHTML = teachers.map(createTeacherCard).join('');
    }
    addTeacherClickEvent();
}


function getStarSVGCode(favorite: boolean): string {
    if (favorite) {
        return "M199.755 73.1182C199.39 71.9962 198.074 69.3912 193.758 69.3912H126.252L105.395 5.18626C104.058 1.08103 101.169 0.638268 99.9914 0.638268C98.8093 0.638268 95.9163 1.08103 94.5966 5.18626L73.7308 69.3912H6.22878C1.78825 69.3912 0.524439 72.2455 0.249324 73.0924C-0.0429857 73.9693 -0.726474 77.03 2.88441 79.6607L57.5033 119.342L36.6333 183.564C35.7306 186.401 36.4656 188.25 37.2308 189.281C38.9503 191.658 42.5783 191.946 45.3768 189.892L99.9957 150.215L154.602 189.887C155.952 190.872 157.271 191.362 158.638 191.362C160.302 191.362 161.798 190.605 162.769 189.285C163.534 188.228 164.257 186.367 163.35 183.551L142.484 119.342L197.12 79.6564C200.58 77.1245 200.116 74.2444 199.755 73.1182Z";
    }
    return 'M199.755 73.1182C199.39 71.9962 198.074 69.3912 193.758 69.3912H126.252L105.395 5.18626C104.058 1.08103 101.169 0.638268 99.9914 0.638268C98.8093 0.638268 95.9163 1.08103 94.5966 5.18626L73.7308 69.3912H6.22878C1.78825 69.3912 0.524439 72.2455 0.249324 73.0924C-0.0429857 73.9693 -0.726474 77.03 2.88441 79.6607L57.5033 119.342L36.6333 183.564C35.7306 186.401 36.4656 188.25 37.2308 189.281C38.9503 191.658 42.5783 191.946 45.3768 189.892L99.9957 150.215L154.602 189.887C155.952 190.872 157.271 191.362 158.638 191.362C160.302 191.362 161.798 190.605 162.769 189.285C163.534 188.228 164.257 186.367 163.35 183.551L142.484 119.342L197.12 79.6564C200.58 77.1245 200.116 74.2444 199.755 73.1182ZM134.591 114.003C133.027 115.142 132.36 117.137 132.954 119.015L151.696 176.703L102.605 141.037C101.088 139.954 98.9167 139.941 97.3563 141.05L48.287 176.708L67.0335 119.006C67.631 117.162 66.9776 115.155 65.4086 114.007L16.3307 78.354H76.9892C78.9451 78.354 80.6603 77.1073 81.2449 75.2546L99.9871 17.5707L118.734 75.2675C119.348 77.1159 121.059 78.354 122.998 78.354H183.648L134.591 114.003Z'
}

function showTeacherPopup(teacher: Teacher): void {
    const popup = document.querySelector('#teacher-info-popup');
    if (popup) {
        const picture = teacher.picture_large || teacher.picture_thumbnail;

        const img = document.querySelector(".teacher-photo");
        if (picture) {
            img?.setAttribute("src", picture);
            img?.setAttribute("alt", teacher.full_name);
            img?.setAttribute("style", "display: block");
        } else {
            img?.setAttribute("style", "display: none");
        }

        const star = document.querySelector("#popup-teacher-star");
        if (star) {
            const newStar = star.cloneNode(true) as HTMLElement;
            star.replaceWith(newStar);

            newStar?.getElementsByTagName("path")[0].setAttribute("d", getStarSVGCode(teacher.favorite));

            newStar?.addEventListener('click', (e) => {
                e.preventDefault();
                teacher.favorite = !teacher.favorite;

                newStar?.getElementsByTagName("path")[0].setAttribute("d", getStarSVGCode(teacher.favorite));
                renderTeachers(normalizedTeachers);
                renderFavoriteTeachers(normalizedTeachers);
            });
        }

        const nameElement = document.querySelector('#popup-teacher-name');
        if (nameElement) {
            nameElement.textContent = teacher.full_name;
        }

        const specializationElement = document.querySelector('#popup-teacher-specialization');
        if (specializationElement) {
            specializationElement.textContent = teacher.course;
        }

        const locationElement = document.querySelector('#popup-teacher-location');
        if (locationElement) {
            locationElement.textContent = `${teacher.city || ''}, ${teacher.country || ''}`.trim();
        }

        const genderAgeElement = document.querySelector('#popup-teacher-gender-age');
        if (genderAgeElement) {
            genderAgeElement.textContent = `${teacher.age + ', ' || ''}${teacher.gender || ''}`;
        }

        const emailElement = document.querySelector<HTMLAnchorElement>('#popup-teacher-email');
        if (emailElement) {
            emailElement.href = `mailto:${teacher.email}`;
            emailElement.textContent = teacher.email || '';
        }

        const phoneElement = document.querySelector('#popup-teacher-phone');
        if (phoneElement) {
            phoneElement.textContent = teacher.phone || '';
        }

        const notesElement = document.querySelector('#popup-teacher-notes');
        if (notesElement) {
            notesElement.textContent = teacher.notes || '';
        }

        openPopup('teacher-info-popup');
    }
}

renderTeachers(normalizedTeachers);


// Paginated table of teacher statistics
const itemsPerPage = 10;
let currentPage = 1;

const totalPages = Math.ceil(normalizedTeachers.length / itemsPerPage);

function renderTable(teachers: Teacher[], page: number) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, teachers.length);

    const tableBody = document.getElementById('table-body') as HTMLElement;
    tableBody.innerHTML = '';

    for (let i = startIndex; i < endIndex; i++) {
        const teacher = teachers[i];
        const row = `<tr>
                        <td>${teacher.full_name}</td>
                        <td>${teacher.course}</td>
                        <td>${teacher.age || 'Unknown'}</td>
                        <td>${teacher.gender}</td>
                        <td>${teacher.country}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    }
}

function renderPagination() {
    const paginationPanel = document.getElementById('pagination-panel') as HTMLElement;
    paginationPanel.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationPanel.innerHTML += `<a href="#" class="page-link ${activeClass}" data-page="${i}">${i}</a>`;
    }

    if (currentPage < totalPages) {
        paginationPanel.innerHTML += `<a href="#" class="page-link" data-page="${totalPages}">Last</a>`;
    }

    document.getElementById('pagination-panel')?.addEventListener('click', (e) => {
        e.preventDefault()
        const target = e.target as HTMLElement;
        if (target.classList.contains('page-link')) {
            e.preventDefault();
            const selectedPage = parseInt(target.getAttribute('data-page') as string, 10);
            if (!isNaN(selectedPage)) {
                currentPage = selectedPage;
                renderTable(normalizedTeachers, currentPage);
                renderPagination();
            }
        }
    });
}


renderTable(normalizedTeachers, currentPage);
renderPagination();


// Favorite teachers
function renderFavoriteTeachers(teachers: Teacher[]): void {
    const favoriteTeachers = teachers.filter(teacher => teacher.favorite);
    const favoriteContainer = document.querySelector('.carousel-track');
    if (favoriteContainer) {
        favoriteContainer.innerHTML = favoriteTeachers.map(createTeacherCard).join('');
    }
}

renderFavoriteTeachers(normalizedTeachers);


// Task 2
function populateRegionFilter(teachers: Teacher[]): void {
    const regionFilter = document.querySelector('#region-filter') as HTMLSelectElement;

    const uniqueRegions = Array.from(new Set(teachers.map(teacher => teacher.country)));

    regionFilter.innerHTML = `<option value="0">All</option>`;

    uniqueRegions.forEach((region, index) => {
        if (!region) {
            return;
        }

        const option = document.createElement('option');
        option.value = String(index + 1);
        option.textContent = region;
        regionFilter.appendChild(option);
    });
}

populateRegionFilter(normalizedTeachers);

function applyFilters(teachers: Teacher[]): Teacher[] {
    const ageFilter = (document.querySelector('#age-filter') as HTMLSelectElement).value;
    const regionFilter = (document.querySelector('#region-filter') as HTMLSelectElement).value;
    const genderFilter = (document.querySelector('#gender-filter') as HTMLSelectElement).value;
    const photoFilter = (document.querySelector('#photo-filter') as HTMLInputElement).checked;
    const favoriteFilter = (document.querySelector('#favorite-filter') as HTMLInputElement).checked;

    const filterParams: FilterParams[] = [];

    if (ageFilter !== "0") {
        switch (ageFilter) {
            case "2":
                filterParams.push({field: 'age', condition: 'gte', value: 18});
                filterParams.push({field: 'age', condition: 'lt', value: 31});
                break;
            case "3":
                filterParams.push({field: 'age', condition: 'gte', value: 31});
                filterParams.push({field: 'age', condition: 'lt', value: 40});
                break;
            case "4":
                filterParams.push({field: 'age', condition: 'gte', value: 41});
                filterParams.push({field: 'age', condition: 'lt', value: 50});
                break;
            case "5":
                filterParams.push({field: 'age', condition: 'gte', value: 51});
                break;
        }
    }

    if (regionFilter !== "0") {
        const uniqueRegions = Array.from(new Set(teachers.map(teacher => teacher.country)));
        const selectedRegion = uniqueRegions[+regionFilter - 1];
        filterParams.push({field: 'country', condition: 'eq', value: selectedRegion});
    }

    if (genderFilter !== "0") {
        const genders = ["Male", "Female"];
        filterParams.push({field: 'gender', condition: 'eq', value: genders[+genderFilter - 1]});
    }

    if (photoFilter) {
        filterParams.push({field: 'picture_large', condition: 'ne', value: undefined}, {
            field: 'picture_thumbnail',
            condition: 'ne',
            value: undefined
        });
    }

    if (favoriteFilter) {
        filterParams.push({field: 'favorite', condition: 'eq', value: true});
    }

    return filterTeachers(teachers, ...filterParams);
}

function updateTeacherList() {
    const filteredTeachers = applyFilters(normalizedTeachers);
    renderTeachers(filteredTeachers);
}

function setupFilterListeners() {
    document.querySelectorAll('.form-item, input[type="checkbox"]').forEach((el) => {
        el.addEventListener('change', updateTeacherList);
    });
}

setupFilterListeners();

// Task 3
let currentSortParams: SortParams | undefined;

function handleSortClick(field: 'full_name' | 'course' | 'age' | 'gender'|'country') {
    if (currentSortParams) {
        if (currentSortParams.order === 'desc') {
            currentSortParams = undefined;
            renderTable(normalizedTeachers, currentPage);
            return
        }

        currentSortParams = {field, order: 'desc'};
    } else {
        currentSortParams = {field, order: 'asc'};
    }

    const sortedTeachers = sortTeachers(normalizedTeachers, currentSortParams);
    renderTable(sortedTeachers, currentPage);
}

// Event listener for table headers
document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.statistics-table th');

    headers.forEach(header => {
        const field = header.getAttribute('data-field') as 'full_name' | 'course' | 'age' | 'gender'|'country';

        if (field) {
            header.addEventListener('click', () => handleSortClick(field));
        }
    });

    renderTable(normalizedTeachers, currentPage);
});


// Task 4
function populateCourses() {
    const selectElement = document.getElementById('course') as HTMLSelectElement;

    selectElement.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a course';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    Courses.forEach((course) => {
        const option = document.createElement('option');
        option.value = course;
        option.text = course;
        selectElement.appendChild(option);
    });
}

populateCourses();

function addTeacher() {
    const genderRadios = document.querySelector('input[name="gender"]:checked')
    if (!genderRadios) {
        displayError('gender', 'Gender is required');
    }
    const teacher: Teacher = {
        favorite: false,
        id: `teacher-${normalizedTeachers.length + 1}`,
        title: "",
        full_name: (document.getElementById('full_name') as HTMLInputElement).value,
        course: (document.getElementById('course') as HTMLSelectElement).value,
        age: getAgeFromDate((document.getElementById('b_date') as HTMLInputElement).value),
        email: (document.getElementById('email') as HTMLInputElement).value,
        phone: (document.getElementById('phone') as HTMLInputElement).value,
        country: (document.getElementById('country') as HTMLSelectElement).value,
        city: (document.getElementById('city') as HTMLInputElement).value,
        gender: (genderRadios as HTMLInputElement).value,
        b_date: (document.getElementById('b_date') as HTMLInputElement).value,
        notes: (document.getElementById('notes') as HTMLTextAreaElement).value,
        bg_color: (document.getElementById('bg_color') as HTMLInputElement).value
    };

    clearErrors();
    const validationResult = validateTeacher(teacher);

    if (validationResult.error) {
        displayError(validationResult.field, validationResult.error);
        return;
    }

    normalizedTeachers.push(teacher);

    (document.querySelector('.teacher-form') as HTMLFormElement).reset();
    closePopup();
    renderTeachers(normalizedTeachers);
}

function displayError(field: string, error: string) {
    const errorElement = document.getElementById(`${field}-error`);
    if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(errorElement => {
        errorElement.textContent = '';
        errorElement.setAttribute("style", "display: none");
    });
}

function getAgeFromDate(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

document.querySelector('.teacher-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    addTeacher();
});
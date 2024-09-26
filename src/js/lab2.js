"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FE4U_Lab2_mock_1 = require("./FE4U-Lab2-mock");
const contry_codes_1 = require("./contry_codes");
const Courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"];
// Task 1: Normalize teachers
function normalizeTeachers(...sources) {
    const normalize = (user) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const fullName = user.full_name || `${((_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.first) || ''} ${((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.last) || ''}`;
        const bDate = user.b_day || ((_c = user === null || user === void 0 ? void 0 : user.dob) === null || _c === void 0 ? void 0 : _c.date);
        const age = user.age || (bDate ? new Date().getFullYear() - new Date(bDate).getFullYear() : undefined);
        const id = typeof user.id === 'string'
            ? user.id
            : (((_d = user === null || user === void 0 ? void 0 : user.id) === null || _d === void 0 ? void 0 : _d.value) || ((_e = user === null || user === void 0 ? void 0 : user.login) === null || _e === void 0 ? void 0 : _e.uuid) || '');
        const city = user.city || ((_f = user === null || user === void 0 ? void 0 : user.location) === null || _f === void 0 ? void 0 : _f.city);
        const state = user.state || ((_g = user === null || user === void 0 ? void 0 : user.location) === null || _g === void 0 ? void 0 : _g.state);
        const country = user.country || ((_h = user === null || user === void 0 ? void 0 : user.location) === null || _h === void 0 ? void 0 : _h.country);
        return {
            id: id,
            bg_color: user.bg_color || undefined,
            notes: user.note ? toTitleCase(user.note) : undefined,
            course: randomCourse(),
            favorite: user.favorite || false,
            gender: toTitleCase(user.gender),
            title: user.title || ((_j = user === null || user === void 0 ? void 0 : user.name) === null || _j === void 0 ? void 0 : _j.title) || undefined,
            full_name: fullName.trim(),
            city: city ? toTitleCase(city) : undefined,
            state: state ? toTitleCase(state) : undefined,
            country: country ? toTitleCase(country) : undefined,
            postcode: user.postcode || ((_k = user === null || user === void 0 ? void 0 : user.location) === null || _k === void 0 ? void 0 : _k.postcode) || undefined,
            coordinates: user.coordinates || ((_l = user === null || user === void 0 ? void 0 : user.location) === null || _l === void 0 ? void 0 : _l.coordinates) || undefined,
            timezone: user.timezone || ((_m = user === null || user === void 0 ? void 0 : user.location) === null || _m === void 0 ? void 0 : _m.timezone) || undefined,
            email: user.email || undefined,
            b_date: bDate || undefined,
            age: age,
            phone: user.phone || undefined,
            picture_large: user.picture_large || ((_o = user === null || user === void 0 ? void 0 : user.picture) === null || _o === void 0 ? void 0 : _o.large) || undefined,
            picture_thumbnail: user.picture_thumbnail || ((_p = user === null || user === void 0 ? void 0 : user.picture) === null || _p === void 0 ? void 0 : _p.thumbnail) || undefined
        };
    };
    const seen = new Set();
    return sources
        .reduce((accumulator, value) => accumulator.concat(value), [])
        .map(normalize)
        .filter((teacher) => {
        if ((!teacher.id || seen.has(teacher.id)) || (teacher.email && seen.has(teacher.email)) || (teacher.phone && seen.has(teacher.phone))) {
            return false;
        }
        seen.add(teacher.id);
        if (teacher.email) {
            seen.add(teacher.email);
        }
        if (teacher.phone) {
            seen.add(teacher.phone);
        }
        return true;
    });
}
function randomCourse() {
    return Courses[Math.floor(Math.random() * Courses.length)];
}
function toTitleCase(s) {
    return s.length === 0 ? '' : s[0].toUpperCase() + s.slice(1);
}
console.log("Task 1: Normalize teachers");
let normalizedTeachers = normalizeTeachers(FE4U_Lab2_mock_1.randomUserMock, FE4U_Lab2_mock_1.additionalUsers);
console.log(normalizedTeachers);
// Task 2: Validate teachers
function validateTeacher(teacher) {
    return startWithCapitalLetter(teacher.full_name)
        && startWithCapitalLetter(teacher.gender)
        && startWithCapitalLetter(teacher.notes)
        && startWithCapitalLetter(teacher.state)
        && startWithCapitalLetter(teacher.city)
        && startWithCapitalLetter(teacher.country)
        && teacher.age !== undefined
        && (0, contry_codes_1.validatePhoneByCountry)(teacher.phone, teacher.country)
        && validateEmail(teacher.email);
}
function startWithCapitalLetter(s) {
    return s === undefined || s.length === 0 ? true : s[0] === s[0].toUpperCase();
}
function validateEmail(email) {
    if (!email) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
console.log("\n\nTask 2: Validate teachers");
console.log(normalizedTeachers[0], validateTeacher(normalizedTeachers[0])); // false
console.log(normalizedTeachers[1], validateTeacher(normalizedTeachers[1])); // true
console.log(normalizedTeachers[2], validateTeacher(normalizedTeachers[2])); // true
console.log(normalizedTeachers[3], validateTeacher(normalizedTeachers[3])); // true
function filterTeachers(teachers, ...filterParams) {
    return teachers.filter(teacher => filterParams.every(filterParam => {
        const value = teacher[filterParam.field];
        if (value === undefined || value === null) {
            return false;
        }
        switch (filterParam.condition) {
            case 'eq':
                return value === filterParam.value;
            case 'ne':
                return value !== filterParam.value;
            case 'gt':
                return value > filterParam.value;
            case 'lt':
                return value < filterParam.value;
            case 'gte':
                return value >= filterParam.value;
            case 'lte':
                return value <= filterParam.value;
            default:
                return false;
        }
    }));
}
console.log("\n\nTask 3: Filter teachers");
const teacherOver30 = filterTeachers(normalizedTeachers, { field: 'age', condition: 'gt', value: 30 });
console.log("Teachers with age > 30", teacherOver30.slice(0, 3), teacherOver30.length);
const teacherWithCourseMathematics = filterTeachers(normalizedTeachers, {
    field: 'course',
    condition: 'eq',
    value: 'Mathematics'
});
console.log("Teachers with course Mathematics", teacherWithCourseMathematics.slice(0, 3), teacherWithCourseMathematics.length);
const teacherWithFavorite = filterTeachers(normalizedTeachers, { field: 'favorite', condition: 'eq', value: true });
console.log("Teachers favorite", teacherWithFavorite.slice(0, 3), teacherWithFavorite.length);
function sortTeachers(teachers, ...sortParams) {
    return teachers.sort((a, b) => {
        for (const sortParam of sortParams) {
            const aValue = a[sortParam.field];
            const bValue = b[sortParam.field];
            if (aValue === undefined && bValue !== undefined) {
                return sortParam.order === 'asc' ? 1 : -1;
            }
            if (aValue !== undefined && bValue === undefined) {
                return sortParam.order === 'asc' ? -1 : 1;
            }
            if (aValue !== undefined && bValue !== undefined) {
                if (aValue < bValue) {
                    return sortParam.order === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortParam.order === 'asc' ? 1 : -1;
                }
            }
        }
        return 0;
    });
}
console.log("\n\nTask 4: Sort teachers");
const sortedTeachers = sortTeachers(normalizedTeachers, { field: 'age', order: 'asc' });
console.log("Sorted by age", sortedTeachers.map(t => {
    return { name: t.full_name, age: t.age };
}).slice(0, 10));
const sortedTeachers2 = sortTeachers(normalizedTeachers, { field: 'full_name', order: 'desc' });
console.log("Sorted by name", sortedTeachers2.map(t => {
    return { name: t.full_name, age: t.age };
}).slice(0, 10));
const sortedTeachers3 = sortTeachers(normalizedTeachers, { field: 'b_date', order: 'asc' }, { field: 'age', order: 'asc' });
console.log("Sorted by b_date or age", sortedTeachers3.map(t => {
    return { name: t.full_name, age: t.age, course: t.course };
}).slice(0, 10));
// Task 5: Search teachers
function searchTeachers(teachers, search) {
    return teachers.filter(teacher => {
        var _a;
        if (typeof search === 'string') {
            return teacher.full_name.includes(search)
                || ((_a = teacher.notes) === null || _a === void 0 ? void 0 : _a.includes(search));
        }
        else {
            return teacher.age === search;
        }
    });
}
console.log("\n\nTask 5: Search teachers");
let searchResult = searchTeachers(normalizedTeachers, 'Norbert');
console.log("Search by name", searchResult.map(t => {
    return { name: t.full_name, age: t.age };
}).slice(0, 10));
searchResult = searchTeachers(normalizedTeachers, 30);
console.log("Search by age", searchResult.map(t => {
    return { name: t.full_name, age: t.age };
}).slice(0, 10));
// Task 6: Percentaged filter
function percentageFilter(teachers, ...filterParams) {
    const filtered = filterTeachers(teachers, ...filterParams);
    let percent = filtered.length / teachers.length * 100;
    return { teachers: filtered, percent: Math.round(percent * 100) / 100 };
}
console.log("\n\nTask 6: Percentaged filter");
let { teachers, percent } = percentageFilter(normalizedTeachers, { field: 'favorite', condition: 'eq', value: true });
console.log("Favorite teachers", teachers.map(t => t.full_name).slice(0, 3), percent);
({ teachers, percent } = percentageFilter(normalizedTeachers, { field: 'age', condition: 'gt', value: 30 }));
console.log("Teachers over 30", teachers.map(t => t.full_name).slice(0, 3), percent);
({ teachers, percent } = percentageFilter(normalizedTeachers, { field: 'course', condition: 'eq', value: 'Mathematics' }));

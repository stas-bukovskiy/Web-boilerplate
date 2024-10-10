import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock";
import {validatePhoneByCountry} from "./contry_codes";

type Coordinates = {
    latitude: string
    longitude: string
}

type Timezone = {
    offset: string
    description: string
}

export const Courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"]

export type Teacher = {
    id: string,
    favorite: boolean,
    course: string,
    bg_color?: string,
    notes?: string,
    gender: string
    title: string
    full_name: string
    city?: string
    state?: string
    country?: string
    postcode?: number
    coordinates?: Coordinates
    timezone?: Timezone
    email?: string
    b_date?: string
    age?: number
    phone?: string
    picture_large?: string
    picture_thumbnail?: string
}


// Task 1: Normalize teachers

export function normalizeTeachers(...sources: any[][]): Teacher[] {
    const normalize = (user: any): Teacher => {
        const fullName = user.full_name || `${user?.name?.first || ''} ${user?.name?.last || ''}`;
        const bDate = user.b_day || user?.dob?.date;
        const age = user.age || (bDate ? new Date().getFullYear() - new Date(bDate).getFullYear() : undefined);
        const id = typeof user.id === 'string'
            ? user.id
            : (user?.id?.value || user?.login?.uuid || '');
        const city = user.city || user?.location?.city;
        const state = user.state || user?.location?.state;
        const country = user.country || user?.location?.country;

        return {
            id: id,
            bg_color: user.bg_color || undefined,
            notes: user.note ? toTitleCase(user.note) : undefined,
            course: randomCourse(),
            favorite: user.favorite || false,
            gender: toTitleCase(user.gender),
            title: user.title || user?.name?.title || undefined,
            full_name: fullName.trim(),
            city: city ? toTitleCase(city) : undefined,
            state: state ? toTitleCase(state) : undefined,
            country: country ? toTitleCase(country) : undefined,
            postcode: user.postcode || user?.location?.postcode || undefined,
            coordinates: user.coordinates || user?.location?.coordinates || undefined,
            timezone: user.timezone || user?.location?.timezone || undefined,
            email: user.email || undefined,
            b_date: bDate || undefined,
            age: age,
            phone: user.phone || undefined,
            picture_large: user.picture_large || user?.picture?.large || undefined,
            picture_thumbnail: user.picture_thumbnail || user?.picture?.thumbnail || undefined
        };
    };

    const seen = new Set<string>();
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

function randomCourse(): string {
    return Courses[Math.floor(Math.random() * Courses.length)];
}

function toTitleCase(s: string): string {
    return s.length === 0 ? '' : s[0].toUpperCase() + s.slice(1);
}


// console.log("Task 1: Normalize teachers");
export let normalizedTeachers = normalizeTeachers(randomUserMock, additionalUsers);
// console.log(normalizedTeachers);


// Task 2: Validate teachers

export function validateTeacher(teacher: Teacher): { field: string, error: string } {
    const keysShouldStartWIthCapital: (keyof Teacher)[] = ['full_name', 'gender', 'notes', 'state', 'city', 'country'];
    for (const key of keysShouldStartWIthCapital) {
        const value: any = teacher[key];
        if (typeof value !== 'string' && value !== undefined) {
            throw new Error(`Value of ${key} should be a string`);
        }

        if (!startWithCapitalLetter(value)) {
            const prettyKey = key.split('_').map(toTitleCase).join(' ');
            return {field: key, error: `${prettyKey} should start with a capital letter`};
        }
    }
    if (teacher.age === undefined) {
        return {field: 'age', error: 'Age is required'};
    }
    if (!validatePhoneByCountry(teacher.phone, teacher.country)) {
        return {field: 'phone', error: 'Phone is not valid'};
    }
    if (!validateEmail(teacher.email)) {
        return {field: 'email', error: 'Email is not valid'};
    }

    return {field: '', error: ''};
}

function startWithCapitalLetter(s?: string): boolean {
    return s === undefined || s.length === 0 ? true : s[0] === s[0].toUpperCase();
}

function validateEmail(email?: string): boolean {
    if (!email) {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// console.log("\n\nTask 2: Validate teachers");
// console.log(normalizedTeachers[0], validateTeacher(normalizedTeachers[0])); // false
// console.log(normalizedTeachers[1], validateTeacher(normalizedTeachers[1])); // true
// console.log(normalizedTeachers[2], validateTeacher(normalizedTeachers[2])); // true
// console.log(normalizedTeachers[3], validateTeacher(normalizedTeachers[3])); // true


// Task 3: Filter teachers
export type FilterParams = {
    field: 'course' | 'age' | 'gender' | 'favorite' | 'country' | 'picture_large' | 'picture_thumbnail',
    condition: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte',
    value: string | number | boolean | undefined
}

export function filterTeachers(teachers: Teacher[], ...filterParams: FilterParams[]): Teacher[] {
    return teachers.filter(teacher => filterParams.every(filterParam => {
        const value = teacher[filterParam.field];
        if (value === undefined && filterParam.value === undefined) {
            return filterParam.condition === 'eq';
        }
        if (value === undefined || filterParam.value === undefined) {
            return filterParam.condition === 'ne';
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

// console.log("\n\nTask 3: Filter teachers");
// const teacherOver30 = filterTeachers(normalizedTeachers, {field: 'age', condition: 'gt', value: 30});
// console.log("Teachers with age > 30", teacherOver30.slice(0, 3), teacherOver30.length);
// const teacherWithCourseMathematics = filterTeachers(normalizedTeachers, {
//     field: 'course',
//     condition: 'eq',
//     value: 'Mathematics'
// });
// console.log("Teachers with course Mathematics", teacherWithCourseMathematics.slice(0, 3), teacherWithCourseMathematics.length);
// const teacherWithFavorite = filterTeachers(normalizedTeachers, {field: 'favorite', condition: 'eq', value: true});
// console.log("Teachers favorite", teacherWithFavorite.slice(0, 3), teacherWithFavorite.length);


// Task 4: Sort teachers
export type SortParams = {
    field: 'full_name' | 'course' | 'age' | 'gender'|'country';
    order: 'asc' | 'desc'
}

export function sortTeachers(teachers: Teacher[], ...sortParams: SortParams[]): Teacher[] {
    return teachers.map((x) => x).sort((a, b) => {
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

// console.log("\n\nTask 4: Sort teachers");
// const sortedTeachers = sortTeachers(normalizedTeachers, {field: 'age', order: 'asc'});
// console.log("Sorted by age", sortedTeachers.map(t => {
//     return {name: t.full_name, age: t.age}
// }).slice(0, 10));
// const sortedTeachers2 = sortTeachers(normalizedTeachers, {field: 'full_name', order: 'desc'});
// console.log("Sorted by name", sortedTeachers2.map(t => {
//     return {name: t.full_name, age: t.age}
// }).slice(0, 10));
// const sortedTeachers3 = sortTeachers(normalizedTeachers, {field: 'b_date', order: 'asc'}, {field: 'age', order: 'asc'});
// console.log("Sorted by b_date or age", sortedTeachers3.map(t => {
//     return {name: t.full_name, age: t.age, course: t.course}
// }).slice(0, 10));


// Task 5: Search teachers
function searchTeachers(teachers: Teacher[], search: string | number): Teacher[] {
    return teachers.filter(teacher => {
        if (typeof search === 'string') {
            return teacher.full_name.includes(search)
                || teacher.notes?.includes(search)
        } else {
            return teacher.age === search;
        }
    });
}

// console.log("\n\nTask 5: Search teachers");
// let searchResult = searchTeachers(normalizedTeachers, 'Norbert');
// console.log("Search by name", searchResult.map(t => {
//     return {name: t.full_name, age: t.age}
// }).slice(0, 10));
// searchResult = searchTeachers(normalizedTeachers, 30);
// console.log("Search by age", searchResult.map(t => {
//     return {name: t.full_name, age: t.age}
// }).slice(0, 10));


// Task 6: Percentaged filter
function percentageFilter(teachers: Teacher[], ...filterParams: FilterParams[]): {
    teachers: Teacher[],
    percent: number
} {
    const filtered = filterTeachers(teachers, ...filterParams);
    let percent = filtered.length / teachers.length * 100;
    return {teachers: filtered, percent: Math.round(percent * 100) / 100};
}

// console.log("\n\nTask 6: Percentaged filter");
// let {teachers, percent} = percentageFilter(normalizedTeachers, {field: 'favorite', condition: 'eq', value: true});
// console.log("Favorite teachers", teachers.map(t => t.full_name).slice(0, 3), percent);
// ({teachers, percent} = percentageFilter(normalizedTeachers, {field: 'age', condition: 'gt', value: 30}));
// console.log("Teachers over 30", teachers.map(t => t.full_name).slice(0, 3), percent);
// ({teachers, percent} = percentageFilter(normalizedTeachers, {field: 'course', condition: 'eq', value: 'Mathematics'}));
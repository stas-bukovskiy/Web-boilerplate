import {validatePhoneByCountry} from "./contry_codes";
import _ from "lodash";

export type Coordinates = {
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
        const fullName = user.full_name || `${_.get(user, 'name.first', '')} ${_.get(user, 'name.last', '')}`;
        const bDate = user.b_day || _.get(user, 'dob.date');
        const age = user.age || (bDate ? new Date().getFullYear() - new Date(bDate).getFullYear() : undefined);
        const id = _.isString(user.id)
            ? user.id
            : _.get(user, 'id.value', _.get(user, 'login.uuid', ''));

        return {
            id,
            bg_color: user.bg_color,
            notes: user.note ? toTitleCase(user.note) : undefined,
            course: randomCourse(),
            favorite: !!user.favorite,
            gender: toTitleCase(user.gender),
            title: user.title || _.get(user, 'name.title'),
            full_name: fullName.trim(),
            city: toTitleCase(user.city || _.get(user, 'location.city')),
            state: toTitleCase(user.state || _.get(user, 'location.state')),
            country: toTitleCase(user.country || _.get(user, 'location.country')),
            postcode: user.postcode || _.get(user, 'location.postcode'),
            coordinates: user.coordinates || _.get(user, 'location.coordinates'),
            timezone: user.timezone || _.get(user, 'location.timezone'),
            email: user.email,
            b_date: bDate,
            age,
            phone: user.phone,
            picture_large: user.picture_large || _.get(user, 'picture.large'),
            picture_thumbnail: user.picture_thumbnail || _.get(user, 'picture.thumbnail')
        };
    };

    const seen = new Set<string>();
    return _(sources)
        .flatten()
        .map(normalize)
        .filter((teacher) => {
            const identifiers = [teacher.id, teacher.email, teacher.phone].filter(Boolean);
            if (identifiers.some(id => seen.has(id!))) {
                return false;
            }
            identifiers.forEach(id => seen.add(id!));
            return true;
        })
        .value();
}

function randomCourse(): string {
    return _.sample(Courses) || "Unknown";
}

function toTitleCase(s: string): string {
    return _.startCase(_.toLower(s));
}


// console.log("Task 1: Normalize teachers");
// export let normalizedTeachers = normalizeTeachers(randomUserMock, additionalUsers);
// console.log(normalizedTeachers);


// Task 2: Validate teachers

export function validateTeacher(teacher: Teacher): { field: string, error: string } {
    const keysShouldStartWIthCapital: Array<keyof Teacher> = ['full_name', 'gender', 'notes', 'state', 'city', 'country'];
    for (const key of keysShouldStartWIthCapital) {
        const value = teacher[key];
        if (!_.isString(value) && !_.isUndefined(value)) {
            throw new Error(`Value of ${key} should be a string`);
        }
        if (value && !_.startsWith(value, _.upperFirst(value))) {
            const prettyKey = _.startCase(key);
            return {field: key, error: `${prettyKey} should start with a capital letter`};
        }
    }

    if (!teacher.age) {
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

function validateEmail(email?: string): boolean {
    return _.isString(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    return _.filter(teachers, (teacher) => {
        return _.every(filterParams, (filterParam) => {
            const value = _.get(teacher, filterParam.field);
            if (value === undefined && filterParam.value === undefined) {
                return filterParam.condition === 'eq';
            }
            if (value === undefined || filterParam.value === undefined) {
                return filterParam.condition === 'ne';
            }

            switch (filterParam.condition) {
                case 'eq': return _.isEqual(value, filterParam.value);
                case 'ne': return !_.isEqual(value, filterParam.value);
                case 'gt': return value > filterParam.value;
                case 'lt': return value < filterParam.value;
                case 'gte': return value >= filterParam.value;
                case 'lte': return value <= filterParam.value;
                default: return false;
            }
        });
    });
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
    const fields = _.map(sortParams, 'field');
    const orders = _.map(sortParams, 'order');
    return _.orderBy(teachers, fields, orders);
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
// }).slice(0, 10))

// Task 5: Search teachers

export function searchTeachers(teachers: Teacher[], search: string | number): Teacher[] {
    return _.filter(teachers, (teacher) => {
        if (_.isString(search)) {
            return _.includes(teacher.full_name, search) || _.includes(teacher.notes, search);
        }
        return teacher.age === search;
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

export function percentageFilter(teachers: Teacher[], ...filterParams: FilterParams[]): { teachers: Teacher[], percent: number } {
    const filteredTeachers = filterTeachers(teachers, ...filterParams);
    const percent = _.round((filteredTeachers.length / teachers.length) * 100, 2);
    return {teachers: filteredTeachers, percent};
}

// console.log("\n\nTask 6: Percentaged filter");
// let {teachers, percent} = percentageFilter(normalizedTeachers, {field: 'favorite', condition: 'eq', value: true});
// console.log("Favorite teachers", teachers.map(t => t.full_name).slice(0, 3), percent);
// ({teachers, percent} = percentageFilter(normalizedTeachers, {field: 'age', condition: 'gt', value: 30}));
// console.log("Teachers over 30", teachers.map(t => t.full_name).slice(0, 3), percent);
// ({teachers, percent} = percentageFilter(normalizedTeachers, {field: 'course', condition: 'eq', value: 'Mathematics'}));
import countries from 'flag-icons/country.json';

export enum Environment {
    Development = 'development',
    Production = 'production',
}

export enum LanguageCode {
    Vietnamese = 'vn',
    English = 'gb',
    Japanese = 'jp',
    Korean = 'kr',
    Chinese = 'cn',
    French = 'fr',
    German = 'de',
    Spanish = 'es',
}

export const COUNTRIES = countries;

export const LANGUAGE = countries.map(country => ({
    value: country.code,
    label: country.name
}));

export enum UserStatus {
    Inactive = 0,
    Active = 1,
    Banned = 2,
}

export enum RoleCode {
    Admin = 'ADMIN',
    Manager = 'MANAGER',
    Staff = 'STAFF',
    User = 'USER',
}

export enum NotificationType {
    Info = 'INFO',
    Success = 'SUCCESS',
    Warning = 'WARNING',
    Error = 'ERROR',
}

export enum BorrowStatus {
    Active = 'active',
    Returned = 'returned',
    Overdue = 'overdue'
}

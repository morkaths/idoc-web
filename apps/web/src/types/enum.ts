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

export const LANGUAGE = [
    { value: LanguageCode.Vietnamese, label: 'Vietnamese' },
    { value: LanguageCode.English, label: 'English' },
    { value: LanguageCode.Japanese, label: 'Japanese' },
    { value: LanguageCode.Korean, label: 'Korean' },
    { value: LanguageCode.Chinese, label: 'Chinese' },
    { value: LanguageCode.French, label: 'French' },
    { value: LanguageCode.German, label: 'German' },
    { value: LanguageCode.Spanish, label: 'Spanish' },
];

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

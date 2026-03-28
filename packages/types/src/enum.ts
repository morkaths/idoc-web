export enum Environment {
    Development = 'development',
    Production = 'production',
}

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
    Pending = 'pending',
    Rejected = 'rejected',
    Active = 'active',
    Returned = 'returned',
    Overdue = 'overdue',
}

export enum ReviewStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}


export enum Environment {
  Development = "development",
  Production = "production",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum FilterOperator {
  EQ = "eq",
  NE = "ne",
  GT = "gt",
  LT = "lt",
  LIKE = "like",
  IN = "in",
}

export enum NotificationType {
  Info = "INFO",
  Success = "SUCCESS",
  Warning = "WARNING",
  Error = "ERROR",
}

export enum RoleType {
  ADMIN = "ADMIN",
  USER = "USER",
  STAFF = "STAFF",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  LOCKED = "LOCKED",
}

export enum BorrowStatus {
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
  CANCELED = "CANCELED",
}

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum RecommendationStrategy {
  POPULARITY = "popularity",
  CBF = "cbf",
  UBCF = "ubcf",
  IBCF = "ibcf",
  SVD = "svd",
  HYBRID = "hybrid",
}

export enum TrainingTarget {
  ALL = 'all',
  CBF = 'cbf',
  IBCF = 'ibcf',
}


export type SortDirection = 'asc' | 'desc';
export type LanguageCode = 'AR' | 'EN';
export type SaveResult = {
  success: boolean;
  message: string;
};
export type BrandOrCategoryTranslation = {
  name: string;
  languageCode: LanguageCode;
};

export const RolesConstants = {
  Admin: 'Admin',
  User: 'User',
};

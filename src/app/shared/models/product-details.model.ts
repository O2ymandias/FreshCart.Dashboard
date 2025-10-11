import { LanguageCode } from './shared.model';

export type ProductGalleryResult = {
  pictureUrl: string;
  altText?: string;
};

export type ProductTranslationResult = {
  languageCode: LanguageCode;
  name: string;
  description: string;
};

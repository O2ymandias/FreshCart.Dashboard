import { LanguageCode } from "./shared.model";

export type BrandResult = {
  id: number;
  name: string;
  pictureUrl: string;
};

export type BrandOption = {
  id: number;
  name: string;
};

export type BrandTranslation = {
  name: string;
  languageCode: LanguageCode;
};

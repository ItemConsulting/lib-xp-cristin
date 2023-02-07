import type { Content } from "@enonic-types/core";

export const CRISTIN_LOCALE_NORWEGIAN = "nb";
export const CRISTIN_LOCALE_ENGLISH = "en";

export type CristinLocale = typeof CRISTIN_LOCALE_NORWEGIAN | typeof CRISTIN_LOCALE_ENGLISH | string;
export type LanguageNode = { [k: string]: string };
export type TextAndLanguage = [text: string | undefined, language: CristinLocale];

export function getTranslator(
  content: Content<unknown>,
  cristinContent: { original_language?: string }
): (languageNode?: LanguageNode) => TextAndLanguage {
  return (languageNode: LanguageNode) =>
    getLocalized({
      lang: getCristinLanguage(content.language),
      languageNode,
      originalLanguage: cristinContent.original_language,
    });
}

export function getCristinLanguage(language: string): CristinLocale {
  return language.indexOf("en") !== -1 ? CRISTIN_LOCALE_ENGLISH : CRISTIN_LOCALE_NORWEGIAN;
}

export function getLocalized({ lang, languageNode, originalLanguage }: GetLocalizedParams): TextAndLanguage {
  const langNode = languageNode ?? {};

  if (langNode[lang]) {
    return [langNode[lang], lang];
  } else if (langNode[CRISTIN_LOCALE_ENGLISH]) {
    return [langNode[CRISTIN_LOCALE_ENGLISH], CRISTIN_LOCALE_ENGLISH];
  } else if (langNode[CRISTIN_LOCALE_NORWEGIAN]) {
    return [langNode[CRISTIN_LOCALE_NORWEGIAN], CRISTIN_LOCALE_NORWEGIAN];
  } else if (originalLanguage && langNode[originalLanguage]) {
    return [langNode[originalLanguage], originalLanguage];
  }

  return [undefined, lang];
}

export interface GetLocalizedParams {
  lang: CristinLocale;
  languageNode?: LanguageNode;
  originalLanguage?: string;
}

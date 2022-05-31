import { type GraphQLResolverEnvironment } from "/lib/graphql";
export const CRISTIN_LOCALE_NORWEGIAN = "nb";
export const CRISTIN_LOCALE_ENGLISH = "en";

export function getLocalized(
  env: GraphQLResolverEnvironment,
  langNode?: { [k: string]: string },
  originalLanguage?: string
): string | undefined {
  return (
    langNode?.[env.context.lang] ??
    langNode?.[originalLanguage ?? CRISTIN_LOCALE_ENGLISH] ??
    langNode?.[CRISTIN_LOCALE_NORWEGIAN]
  );
}

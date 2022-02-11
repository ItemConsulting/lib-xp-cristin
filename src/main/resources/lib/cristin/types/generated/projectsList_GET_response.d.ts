/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Response of a GET request. Lists projects matching specified search filters, or all.
 */
export type ListOfProjects = {
  /**
   * Cristin project id.
   */
  cristin_project_id: string;
  /**
   * Project titles indicating their language.
   */
  title: LanguageObject & {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[a-z]{2}$".
     */
    [k: string]: {
      [k: string]: unknown;
    };
  };
  /**
   * Language code for the project's main language.
   */
  main_language: string;
  /**
   * The same start date as in the project plan.
   */
  start_date?: string;
  /**
   * Anticipated end date. The same end date as in the project plan.
   */
  end_date?: string;
  /**
   * URL for extended information about this project.
   */
  url: string;
  [k: string]: unknown;
}[];

export interface LanguageObject {
  /**
   * This interface was referenced by `LanguageObject`'s JSON-Schema definition
   * via the `patternProperty` "^[a-z]{2}$".
   */
  [k: string]: string;
}

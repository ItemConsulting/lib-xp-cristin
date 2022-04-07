import type { PermissionsParams } from "/lib/xp/content";

export const REPO_CRISTIN_INSTITUTIONS = "no.item.cristin.institutions";
export const REPO_CRISTIN_PERSONS = "no.item.cristin.persons";
export const REPO_CRISTIN_PROJECTS = "no.item.cristin.projects";
export const REPO_CRISTIN_RESULTS = "no.item.cristin.results";
export const REPO_CRISTIN_RESULT_CONTRIBUTORS = "no.item.cristin.resultcontributors";
export const REPO_CRISTIN_UNITS = "no.item.cristin.units";
export const BRANCH_MASTER = "master";
export const URL_CRISTIN = "https://api.cristin.no/v2";
export const BINARY_REFERENCE_PICTURE = "picture";
export const LANG_PARAMS_DEFAULT = "en,nb";

export const DEFAULT_PERMISSIONS: Array<PermissionsParams> = [
  {
    principal: "role:system.everyone",
    allow: ["READ"],
    deny: [],
  },
  {
    principal: "role:system.authenticated",
    allow: ["READ", "CREATE", "MODIFY", "DELETE"],
    deny: [],
  },
  {
    principal: "role:system.admin",
    allow: ["READ", "CREATE", "MODIFY", "DELETE", "PUBLISH", "READ_PERMISSIONS", "WRITE_PERMISSIONS"],
    deny: [],
  },
];

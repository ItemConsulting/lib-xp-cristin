import type { AccessControlEntry } from "/lib/xp/content";

export const TYPE_CRISTIN_INSTITUTION = "no.item.cristin:institution";
export const TYPE_CRISTIN_PERSON = "no.item.cristin:person";
export const TYPE_CRISTIN_PROJECT = "no.item.cristin:project";
export const TYPE_CRISTIN_RESULT = "no.item.cristin:result";
export const TYPE_CRISTIN_RESULT_CONTRIBUTOR = "no.item.cristin:resultcontributor";
export const TYPE_CRISTIN_UNIT = "no.item.cristin:unit";
export const TYPE_CRISTIN_FUNDING = "no.item.cristin:funding";

export const REPO_CRISTIN_INSTITUTIONS = "no.item.cristin.institutions";
export const REPO_CRISTIN_PERSONS = "no.item.cristin.persons";
export const REPO_CRISTIN_PROJECTS = "no.item.cristin.projects";
export const REPO_CRISTIN_RESULTS = "no.item.cristin.results";
export const REPO_CRISTIN_RESULT_CONTRIBUTORS = "no.item.cristin.resultcontributors";
export const REPO_CRISTIN_UNITS = "no.item.cristin.units";
export const REPO_CRISTIN_FUNDING = "no.item.cristin.fundings";

export const BRANCH_MASTER = "master";
export const URL_CRISTIN = "https://api.cristin.no/v2";
export const BINARY_REFERENCE_PICTURE = "picture";
export const DEFAULT_PARAMS_LANG = "en,nb";
export const DEFAULT_PARAMS_PER_PAGE = "10000";

export const DEFAULT_PERMISSIONS: Array<AccessControlEntry> = [
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

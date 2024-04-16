import type {
  Person,
  Project,
  Result,
  Institution,
  Unit,
  ListOfResultContributors,
  Funding,
  ListOfResults,
} from "./types/generated";
import {
  TYPE_CRISTIN_INSTITUTION,
  TYPE_CRISTIN_PERSON,
  TYPE_CRISTIN_PROJECT,
  TYPE_CRISTIN_RESULT,
  TYPE_CRISTIN_RESULT_CONTRIBUTOR,
  TYPE_CRISTIN_UNIT,
  TYPE_CRISTIN_FUNDING,
  REPO_CRISTIN_INSTITUTIONS,
  REPO_CRISTIN_PERSONS,
  REPO_CRISTIN_PROJECTS,
  REPO_CRISTIN_RESULT_CONTRIBUTORS,
  REPO_CRISTIN_RESULTS,
  REPO_CRISTIN_UNITS,
  REPO_CRISTIN_FUNDING,
} from "/lib/cristin/constants";
import { getEntriesByName, type CristinNode } from "/lib/cristin/utils/repos";
import { forceArray } from "/lib/cristin/utils";

export function lookupPerson(id: string): Person | undefined;
export function lookupPerson(ids: Array<string>): Array<Person>;
export function lookupPerson(ids: string | Array<string>): Person | Array<Person> | undefined {
  const entries = getEntriesByName<CristinNode<Person, typeof TYPE_CRISTIN_PERSON>>(
    REPO_CRISTIN_PERSONS,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupInstitution(id: string): Institution | undefined;
export function lookupInstitution(ids: Array<string>): Array<Institution>;
export function lookupInstitution(ids: string | Array<string>): Institution | Array<Institution> | undefined {
  const entries = getEntriesByName<CristinNode<Institution, typeof TYPE_CRISTIN_INSTITUTION>>(
    REPO_CRISTIN_INSTITUTIONS,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupProject(id: string): Project | undefined;
export function lookupProject(ids: Array<string>): Array<Project>;
export function lookupProject(ids: string | Array<string>): Project | Array<Project> | undefined {
  const entries = getEntriesByName<CristinNode<Project, typeof TYPE_CRISTIN_PROJECT>>(
    REPO_CRISTIN_PROJECTS,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupUnit(id: string): Unit | undefined;
export function lookupUnit(ids: Array<string>): Array<Unit>;
export function lookupUnit(ids: string | Array<string>): Unit | Array<Unit> | undefined {
  const entries = getEntriesByName<CristinNode<Unit, typeof TYPE_CRISTIN_UNIT>>(
    REPO_CRISTIN_UNITS,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupResult(id: string): Result | undefined;
export function lookupResult(ids: Array<string>): Array<Result>;
export function lookupResult(ids: string | Array<string>): Result | Array<Result> | undefined {
  const entries = getEntriesByName<CristinNode<Result, typeof TYPE_CRISTIN_RESULT>>(
    REPO_CRISTIN_RESULTS,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupResultContributors(id: string): ListOfResultContributors | undefined;
export function lookupResultContributors(ids: Array<string>): Array<ListOfResultContributors>;
export function lookupResultContributors(
  ids: string | Array<string>
): ListOfResultContributors | Array<ListOfResultContributors> | undefined {
  const entries = getEntriesByName<
    CristinNode<ListOfResultContributors | ListOfResults, typeof TYPE_CRISTIN_RESULT_CONTRIBUTOR>
  >(REPO_CRISTIN_RESULT_CONTRIBUTORS, forceArray(ids), [{ exists: { field: "data.cristin_person_id" } }]).map((node) =>
    forceArray(node.data)
  );

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupFunding(id: string): Funding | undefined;
export function lookupFunding(ids: Array<string>): Array<Funding>;
export function lookupFunding(ids: string | Array<string>): Funding | Array<Funding> | undefined {
  const entries = getEntriesByName<CristinNode<Funding, typeof TYPE_CRISTIN_FUNDING>>(
    REPO_CRISTIN_FUNDING,
    forceArray(ids)
  ).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

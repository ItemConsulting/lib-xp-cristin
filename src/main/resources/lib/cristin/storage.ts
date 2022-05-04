import type { Person, Project, Result, Institution, Unit, ListOfResultContributors } from "./types/generated";
import {
  REPO_CRISTIN_INSTITUTIONS,
  REPO_CRISTIN_PERSONS,
  REPO_CRISTIN_PROJECTS,
  REPO_CRISTIN_RESULT_CONTRIBUTORS,
  REPO_CRISTIN_RESULTS,
  REPO_CRISTIN_UNITS,
} from "/lib/cristin/constants";
import { CristinNode, getEntriesByName } from "/lib/cristin/utils/repos";
import { forceArray } from "/lib/cristin/utils";

export function lookupPerson(id: string): Person | undefined;
export function lookupPerson(ids: Array<string>): Array<Person>;
export function lookupPerson(ids: string | Array<string>): Person | Array<Person> | undefined {
  const entries = getEntriesByName<CristinNode<Person>>(REPO_CRISTIN_PERSONS, forceArray(ids)).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupInstitution(id: string): Institution | undefined;
export function lookupInstitution(ids: Array<string>): Array<Institution>;
export function lookupInstitution(ids: string | Array<string>): Institution | Array<Institution> | undefined {
  const entries = getEntriesByName<CristinNode<Institution>>(REPO_CRISTIN_INSTITUTIONS, forceArray(ids)).map(
    (node) => node.data
  );

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupProject(id: string): Project | undefined;
export function lookupProject(ids: Array<string>): Array<Project>;
export function lookupProject(ids: string | Array<string>): Project | Array<Project> | undefined {
  const entries = getEntriesByName<CristinNode<Project>>(REPO_CRISTIN_PROJECTS, forceArray(ids)).map(
    (node) => node.data
  );

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupUnit(id: string): Unit | undefined;
export function lookupUnit(ids: Array<string>): Array<Unit>;
export function lookupUnit(ids: string | Array<string>): Unit | Array<Unit> | undefined {
  const entries = getEntriesByName<CristinNode<Unit>>(REPO_CRISTIN_UNITS, forceArray(ids)).map((node) => node.data);

  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupResult(id: string): Result | undefined;
export function lookupResult(ids: Array<string>): Array<Result>;
export function lookupResult(ids: string | Array<string>): Result | Array<Result> | undefined {
  const entries = getEntriesByName<CristinNode<Result>>(REPO_CRISTIN_RESULTS, forceArray(ids)).map((node) => node.data);
  return Array.isArray(ids) ? entries : entries[0];
}

export function lookupResultContributors(id: string): ListOfResultContributors | undefined;
export function lookupResultContributors(ids: Array<string>): Array<ListOfResultContributors>;
export function lookupResultContributors(
  ids: string | Array<string>
): ListOfResultContributors | Array<ListOfResultContributors> | undefined {
  const entries = getEntriesByName<CristinNode<ListOfResultContributors>>(
    REPO_CRISTIN_RESULT_CONTRIBUTORS,
    forceArray(ids)
  ).map((node) => forceArray(node.data));
  return Array.isArray(ids) ? entries : entries[0];
}

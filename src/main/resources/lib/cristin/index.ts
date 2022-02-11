import { lookupInstitution, lookupPerson, lookupProject, lookupUnit, lookupResult } from "/lib/cristin/storage";
import { getOrCreateRepoConnection, saveToRepo } from "/lib/cristin/utils/repos";
import { fetchInstitution, fetchPerson, fetchProject, fetchResult, fetchUnit } from "/lib/cristin/service";
import {
  REPO_CRISTIN_INSTITUTIONS,
  REPO_CRISTIN_PERSONS,
  REPO_CRISTIN_PROJECTS,
  REPO_CRISTIN_RESULTS,
  REPO_CRISTIN_UNITS,
} from "/lib/cristin/constants";
import { type RepoConnection } from "/lib/xp/node";
import type { Person, Institution, Project, Unit, Result } from "/lib/cristin/types/generated";
import { notNullOrUndefined } from "/lib/cristin/utils";

export function getCristinPersons(ids: Array<string>): Array<Person> {
  return ids
    .map((id) => getCristinPerson(id, getOrCreateRepoConnection(REPO_CRISTIN_PERSONS)))
    .filter(notNullOrUndefined);
}

export function getCristinPerson(id: string, connection?: RepoConnection): Person | void {
  return (
    lookupPerson(id) ??
    saveToRepo({
      id,
      data: fetchPerson({ id }),
      connection: connection ?? getOrCreateRepoConnection(REPO_CRISTIN_PERSONS),
    })
  );
}

export function getCristinInstitutions(ids: Array<string>): Array<Institution> {
  return ids
    .map((id) => getCristinInstitution(id, getOrCreateRepoConnection(REPO_CRISTIN_INSTITUTIONS)))
    .filter(notNullOrUndefined);
}

export function getCristinInstitution(id: string, connection?: RepoConnection): Institution | void {
  return (
    lookupInstitution(id) ??
    saveToRepo({
      id,
      data: fetchInstitution({ id }),
      connection: connection ?? getOrCreateRepoConnection(REPO_CRISTIN_INSTITUTIONS),
    })
  );
}

export function getCristinProjects(ids: Array<string>): Array<Project> {
  return ids
    .map((id) => getCristinProject(id, getOrCreateRepoConnection(REPO_CRISTIN_PROJECTS)))
    .filter(notNullOrUndefined);
}

export function getCristinProject(id: string, connection?: RepoConnection): Project | void {
  return (
    lookupProject(id) ??
    saveToRepo({
      id,
      data: fetchProject({ id }),
      connection: connection ?? getOrCreateRepoConnection(REPO_CRISTIN_PROJECTS),
    })
  );
}

export function getCristinUnits(ids: Array<string>): Array<Unit> {
  return ids.map((id) => getCristinUnit(id, getOrCreateRepoConnection(REPO_CRISTIN_UNITS))).filter(notNullOrUndefined);
}

export function getCristinUnit(id: string, connection?: RepoConnection): Unit | void {
  return (
    lookupUnit(id) ??
    saveToRepo({
      id,
      data: fetchUnit({ id }),
      connection: connection ?? getOrCreateRepoConnection(REPO_CRISTIN_UNITS),
    })
  );
}

export function getCristinResults(ids: Array<string>): Array<Result> {
  return ids
    .map((id) => getCristinResult(id, getOrCreateRepoConnection(REPO_CRISTIN_RESULTS)))
    .filter(notNullOrUndefined);
}

export function getCristinResult(id: string, connection?: RepoConnection): Result | void {
  return (
    lookupResult(id) ??
    saveToRepo({
      id,
      data: fetchResult({ id }),
      connection: connection ?? getOrCreateRepoConnection(REPO_CRISTIN_RESULTS),
    })
  );
}

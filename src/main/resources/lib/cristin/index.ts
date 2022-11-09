import {
  lookupInstitution,
  lookupPerson,
  lookupProject,
  lookupUnit,
  lookupResult,
  lookupResultContributors,
} from "/lib/cristin/storage";
import { saveToRepo } from "/lib/cristin/utils/repos";
import {
  fetchInstitution,
  fetchPerson,
  fetchProject,
  fetchResult,
  fetchResultContributors,
  fetchUnit,
} from "/lib/cristin/service";
import {
  REPO_CRISTIN_INSTITUTIONS,
  REPO_CRISTIN_PERSONS,
  REPO_CRISTIN_PROJECTS,
  REPO_CRISTIN_RESULT_CONTRIBUTORS,
  REPO_CRISTIN_RESULTS,
  REPO_CRISTIN_UNITS,
} from "/lib/cristin/constants";
import type { Person, Institution, Project, Unit, Result, ListOfResultContributors } from "./types/generated";
export type {
  Unarray,
  ListOfPersons,
  Person,
  ListOfProjects,
  Project,
  ListOfResults,
  Result,
  ListOfResultContributors,
  ListOfInstitutions,
  Institution,
  ListOfUnits,
  Unit,
  CristinResultContributor,
  CristinResultContributorAffiliation,
  CristinResultContributorAffiliationsRole,
  CristinPersonAffiliation,
  CristinProjectCoordinatingInstitution,
  CristinProjectParticipant,
  CristinProjectParticipantRole,
  CristinResultCategory,
  CristinResultPublisher,
  CristinResultLink,
  CristinResultSeries,
  CristinResultJournal,
} from "./types/generated";
import { notNullOrUndefined } from "/lib/cristin/utils";

export function getCristinPersons(ids: Array<string>): Array<Person> {
  return ids.map((id) => getCristinPerson(id)).filter(notNullOrUndefined);
}

export function getCristinPerson(id: string): Person | void {
  return (
    lookupPerson(id) ??
    saveToRepo({
      id,
      data: fetchPerson({ id }),
      repoId: REPO_CRISTIN_PERSONS,
    })
  );
}

export function getCristinInstitutions(ids: Array<string>): Array<Institution> {
  return ids.map((id) => getCristinInstitution(id)).filter(notNullOrUndefined);
}

export function getCristinInstitution(id: string): Institution | void {
  return (
    lookupInstitution(id) ??
    saveToRepo({
      id,
      data: fetchInstitution({ id }),
      repoId: REPO_CRISTIN_INSTITUTIONS,
    })
  );
}

export function getCristinProjects(ids: Array<string>): Array<Project> {
  return ids.map((id) => getCristinProject(id)).filter(notNullOrUndefined);
}

export function getCristinProject(id: string): Project | void {
  return (
    lookupProject(id) ??
    saveToRepo({
      id,
      data: fetchProject({ id }),
      repoId: REPO_CRISTIN_PROJECTS,
    })
  );
}

export function getCristinUnits(ids: Array<string>): Array<Unit> {
  return ids.map((id) => getCristinUnit(id)).filter(notNullOrUndefined);
}

export function getCristinUnit(id: string): Unit | void {
  return (
    lookupUnit(id) ??
    saveToRepo({
      id,
      data: fetchUnit({ id }),
      repoId: REPO_CRISTIN_UNITS,
    })
  );
}

export function getCristinResults(ids: Array<string>): Array<Result> {
  return ids.map((id) => getCristinResult(id)).filter(notNullOrUndefined);
}

export function getCristinResult(id: string): Result | void {
  return (
    lookupResult(id) ??
    saveToRepo({
      id,
      data: fetchResult({ id }),
      repoId: REPO_CRISTIN_RESULTS,
    })
  );
}

export function getCristinResultContributors(id: string): ListOfResultContributors | void {
  return (
    lookupResultContributors(id) ??
    saveToRepo({
      id,
      data: fetchResultContributors({ id }),
      repoId: REPO_CRISTIN_RESULT_CONTRIBUTORS,
    })
  );
}

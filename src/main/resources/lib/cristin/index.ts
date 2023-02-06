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
  TYPE_CRISTIN_INSTITUTION,
  TYPE_CRISTIN_PERSON,
  TYPE_CRISTIN_PROJECT,
  TYPE_CRISTIN_RESULT,
  TYPE_CRISTIN_RESULT_CONTRIBUTOR,
  TYPE_CRISTIN_UNIT,
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
      type: TYPE_CRISTIN_PERSON,
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
      type: TYPE_CRISTIN_INSTITUTION,
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
      type: TYPE_CRISTIN_PROJECT,
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
      type: TYPE_CRISTIN_UNIT,
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
      type: TYPE_CRISTIN_RESULT,
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
      type: TYPE_CRISTIN_RESULT_CONTRIBUTOR,
    })
  );
}

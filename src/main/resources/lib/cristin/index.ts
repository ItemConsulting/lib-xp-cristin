import { lookupInstitution, lookupPerson, lookupProject, lookupUnit, lookupResult } from "/lib/cristin/storage";
import { saveToRepo } from "/lib/cristin/utils/repos";
import { fetchInstitution, fetchPerson, fetchProject, fetchResult, fetchUnit } from "/lib/cristin/service";
import {
  BRANCH_MASTER,
  REPO_CRISTIN_INSTITUTIONS,
  REPO_CRISTIN_PERSONS,
  REPO_CRISTIN_PROJECTS,
  REPO_CRISTIN_RESULTS,
  REPO_CRISTIN_UNITS,
} from "/lib/cristin/constants";
import { connect, type RepoConnection } from "/lib/xp/node";
import type { Person, Institution, Project, Unit, Result } from "/lib/cristin/types/generated";
import { notNullOrUndefined } from "/lib/cristin/utils";

export function getCristinPersons(ids: Array<string>): Array<Person> {
  const connection = connect({
    repoId: REPO_CRISTIN_PERSONS,
    branch: BRANCH_MASTER,
  });

  return ids.map((id) => getCristinPerson(id, connection)).filter(notNullOrUndefined);
}

export function getCristinPerson(id: string, repoConnection?: RepoConnection): Person | void {
  const connection =
    repoConnection ??
    connect({
      repoId: REPO_CRISTIN_PERSONS,
      branch: BRANCH_MASTER,
    });

  return (
    lookupPerson(id) ??
    saveToRepo({
      id,
      data: fetchPerson({ id }),
      connection,
    })
  );
}

export function getCristinInstitutions(ids: Array<string>): Array<Institution> {
  const connection = connect({
    repoId: REPO_CRISTIN_INSTITUTIONS,
    branch: BRANCH_MASTER,
  });

  return ids.map((id) => getCristinInstitution(id, connection)).filter(notNullOrUndefined);
}

export function getCristinInstitution(id: string, repoConnection?: RepoConnection): Institution | void {
  const connection =
    repoConnection ??
    connect({
      repoId: REPO_CRISTIN_INSTITUTIONS,
      branch: BRANCH_MASTER,
    });

  return (
    lookupInstitution(id) ??
    saveToRepo({
      id,
      data: fetchInstitution({ id }),
      connection,
    })
  );
}

export function getCristinProjects(ids: Array<string>): Array<Project> {
  const connection = connect({
    repoId: REPO_CRISTIN_PROJECTS,
    branch: BRANCH_MASTER,
  });

  return ids.map((id) => getCristinProject(id, connection)).filter(notNullOrUndefined);
}

export function getCristinProject(id: string, repoConnection?: RepoConnection): Project | void {
  const connection =
    repoConnection ??
    connect({
      repoId: REPO_CRISTIN_PROJECTS,
      branch: BRANCH_MASTER,
    });

  return (
    lookupProject(id) ??
    saveToRepo({
      id,
      data: fetchProject({ id }),
      connection,
    })
  );
}

export function getCristinUnits(ids: Array<string>): Array<Unit> {
  const connection = connect({
    repoId: REPO_CRISTIN_UNITS,
    branch: BRANCH_MASTER,
  });

  return ids.map((id) => getCristinUnit(id, connection)).filter(notNullOrUndefined);
}

export function getCristinUnit(id: string, repoConnection?: RepoConnection): Unit | void {
  const connection =
    repoConnection ??
    connect({
      repoId: REPO_CRISTIN_UNITS,
      branch: BRANCH_MASTER,
    });

  return (
    lookupUnit(id) ??
    saveToRepo({
      id,
      data: fetchUnit({ id }),
      connection,
    })
  );
}

export function getCristinResults(ids: Array<string>): Array<Result> {
  const connection = connect({
    repoId: REPO_CRISTIN_RESULTS,
    branch: BRANCH_MASTER,
  });

  return ids.map((id) => getCristinResult(id, connection)).filter(notNullOrUndefined);
}

export function getCristinResult(id: string, repoConnection?: RepoConnection): Result | void {
  const connection =
    repoConnection ??
    connect({
      repoId: REPO_CRISTIN_RESULTS,
      branch: BRANCH_MASTER,
    });

  return (
    lookupResult(id) ??
    saveToRepo({
      id,
      data: fetchResult({ id }),
      connection,
    })
  );
}

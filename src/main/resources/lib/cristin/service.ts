import { type HttpResponse, request as httpRequest } from "/lib/http-client";
import { binary } from "/lib/xp/value";
import { parseResponse } from "/lib/cristin/utils/http-client";
import { BINARY_REFERENCE_PICTURE, URL_CRISTIN, LANG_PARAMS_DEFAULT } from "/lib/cristin/constants";
import type {
  ListOfPersons,
  Person,
  Project,
  ListOfResults,
  ListOfProjects,
  ListOfInstitutions,
  Institution,
  ListOfUnits,
  Unit,
  Result,
  ListOfResultContributors,
} from "./types/generated";

export interface FetchResponse<Data> {
  count: number;
  total: number;
  data: Data;
}

export function fetchPersons(params: GetPersonsParams): FetchResponse<ListOfPersons> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/persons`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: LANG_PARAMS_DEFAULT,
      ...params,
    },
  });

  const data = parseResponse<ListOfPersons>({
    res,
    errorMessage: `Could not get persons from Cristin`,
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchPerson({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): Person {
  const res = httpRequest({
    url: `${URL_CRISTIN}/persons/${id}`,
    method: "GET",
    params: { lang },
  });

  const person = parseResponse<Person>({
    res,
    errorMessage: `Could not get a person with id=${id} from Cristin`,
  });

  // Download picture
  try {
    if (person.picture_url) {
      const pictureRes = httpRequest({
        url: person.picture_url,
      });

      if (pictureRes.status === 200) {
        person.attachment = binary(BINARY_REFERENCE_PICTURE, pictureRes.bodyStream);
      }
    }
  } catch (e) {
    log.error(String(e));
  }

  return person;
}

export function fetchProjects(params: GetProjectsParams): FetchResponse<ListOfProjects> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/projects`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: LANG_PARAMS_DEFAULT,
      ...params,
    },
  });

  const data = parseResponse<ListOfProjects>({
    res,
    errorMessage: "Could not get projects from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchProject({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): Project {
  const res = httpRequest({
    url: `${URL_CRISTIN}/projects/${id}`,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Project>({
    res,
    errorMessage: "Could not get project from Cristin",
  });
}

export function fetchResults(params: GetResultsParams): FetchResponse<ListOfResults> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/results`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: LANG_PARAMS_DEFAULT,
      ...params,
    },
  });

  const data = parseResponse<ListOfResults>({
    res,
    errorMessage: "Could not get results from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchResult({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): Result {
  const res = httpRequest({
    url: `${URL_CRISTIN}/results/${id}`,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Result>({
    res,
    errorMessage: "Could not get result from Cristin",
  });
}

export function fetchResultContributors({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): ListOfResultContributors {
  const res = httpRequest({
    url: `${URL_CRISTIN}/results/${id}/contributors`,
    method: "GET",
    params: { lang },
  });

  return parseResponse<ListOfResultContributors>({
    res,
    errorMessage: "Could not get result contributors from Cristin",
  });
}

export function fetchInstitutions(params: GetInstitutionsParams): FetchResponse<ListOfInstitutions> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/institutions`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: LANG_PARAMS_DEFAULT,
      ...params,
    },
  });

  const data = parseResponse<ListOfInstitutions>({
    res,
    errorMessage: "Could not get institutions from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchInstitution({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): Institution {
  const res = httpRequest({
    url: `${URL_CRISTIN}/institutions/${id}`,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Institution>({
    res,
    errorMessage: "Could not get project from Cristin",
  });
}

export function fetchResultCategories(params?: { lang?: string }): FetchResponse<Array<Result["category"]>> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/results/categories`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: params?.lang ?? LANG_PARAMS_DEFAULT,
    },
  });

  const data = parseResponse<Array<Result["category"]>>({
    res,
    errorMessage: "Could not get units from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchUnits(params: GetUnitsParams): FetchResponse<ListOfUnits> {
  const res = httpRequest({
    url: `${URL_CRISTIN}/units`,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: LANG_PARAMS_DEFAULT,
      ...params,
    },
  });

  const data = parseResponse<ListOfUnits>({
    res,
    errorMessage: "Could not get units from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchUnit({ id, lang = LANG_PARAMS_DEFAULT }: GetSingleParams): Unit {
  const res = httpRequest({
    url: `${URL_CRISTIN}/units/${id}`,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Unit>({
    res,
    errorMessage: "Could not get unit from Cristin",
  });
}

function getTotalCountHeader(res: HttpResponse): number {
  return parseInt(res.headers["x-total-count"] ?? "");
}

export interface GetSingleParams {
  id: string | number;
  lang?: string;
}

export interface GetPersonsParams {
  id?: string;
  national_id?: string;
  name?: string;
  institution?: string;
  parent_unit_id?: string;
  levels?: string;
  user?: string;
  page?: string;
  per_page?: string;
}

export interface GetProjectsParams {
  id?: string;
  title?: string;
  institution?: string;
  user?: string;
  biobank?: string;
  project_manager?: string;
  participant?: string;
  approval_reference_id?: string;
  approved_by?: string;
  modified_since?: string;
  keyword?: string;
  unit?: string;
  parent_unit_id?: string;
  levels?: string;
  status?: string;
  project_code?: string;
  funding_source?: string;
  funding?: string;
  lang?: string;
  page?: string;
  per_page?: string;
  sort?: string;
}

export interface GetResultsParams {
  id?: string;
  doi?: string;
  title?: string;
  contributor?: string;
  issn?: string;
  unit?: string;
  institution?: string;
  user?: string;
  category?: string;
  published_since?: string;
  published_before?: string;
  created_since?: string;
  created_before?: string;
  modified_since?: string;
  modified_before?: string;
  year_reported?: string;
  project_code?: string;
  funding_source?: string;
  funding?: string;
  lang?: string;
  page?: string;
  per_page?: string;
  sort?: string;
  fields?: "all";
}

export interface GetInstitutionsParams {
  id?: string;
  name?: string;
  country?: string;
  cristin_institution?: "true" | "false";
  lang?: string;
  page?: string;
  per_page?: string;
}

export interface GetUnitsParams {
  id?: string;
  name?: string;
  institution?: string;
  parent_unit_id?: string;
  levels?: string;
  lang?: string;
  page?: string;
  per_page?: string;
}

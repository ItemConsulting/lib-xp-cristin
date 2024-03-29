import { type HttpResponse, request as httpRequest } from "/lib/http-client";
import { binary } from "/lib/xp/value";
import { parseResponse } from "/lib/cristin/utils/http-client";
import {
  BINARY_REFERENCE_PICTURE,
  URL_CRISTIN,
  DEFAULT_PARAMS_LANG,
  DEFAULT_PARAMS_PER_PAGE,
} from "/lib/cristin/constants";
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
  Funding,
} from "./types/generated";
import { ByteSource } from "@enonic-types/core";
import { ListOfFundings } from "./types/generated";

export interface FetchResponse<Data> {
  count: number;
  total: number;
  data: Data;
}

export function fetchPersons(params: GetPersonsParams): FetchResponse<ListOfPersons> {
  const url = `${URL_CRISTIN}/persons`;

  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfPersons>({
    res,
    url,
    errorMessage: `Could not get persons from Cristin`,
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchPerson({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Person {
  const url = `${URL_CRISTIN}/persons/${id}`;

  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  const person = parseResponse<Person>({
    res,
    url,
    errorMessage: `Could not get a person with id=${id} from Cristin`,
  });

  // Download picture
  try {
    if (person.picture_url) {
      const pictureRes = httpRequest({
        url: person.picture_url,
      });

      if (pictureRes.status === 200) {
        person.attachment = binary(BINARY_REFERENCE_PICTURE, pictureRes.bodyStream as unknown as ByteSource);
      }
    }
  } catch (e) {
    log.error(String(e));
  }

  return person;
}

export function fetchProjects(params: GetProjectsParams): FetchResponse<ListOfProjects> {
  const url = `${URL_CRISTIN}/projects`;

  const res = httpRequest({
    url: url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfProjects>({
    res,
    url,
    errorMessage: "Could not get projects from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchProject({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Project {
  const url = `${URL_CRISTIN}/projects/${id}`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Project>({
    res,
    url,
    errorMessage: "Could not get project from Cristin",
  });
}

export function fetchResults(params: GetResultsParams): FetchResponse<ListOfResults> {
  const url = `${URL_CRISTIN}/results`;
  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfResults>({
    res,
    url,
    errorMessage: "Could not get results from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) ?? data.length,
    data,
  };
}

export function fetchResult({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Result {
  const url = `${URL_CRISTIN}/results/${id}`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Result>({
    res,
    url,
    errorMessage: "Could not get result from Cristin",
  });
}

export function fetchPersonResults({ id, ...params }: GetPersonResultsParams): FetchResponse<ListOfResults> {
  const url = `https://api.cristin.no/v2/persons/${id}/results`;
  const res = httpRequest({
    url,
    method: "GET",
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfResults>({
    res,
    url,
    errorMessage: `Could not get list of results for person ${id} from Cristin`,
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchResultContributors({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): ListOfResultContributors {
  const url = `${URL_CRISTIN}/results/${id}/contributors`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<ListOfResultContributors>({
    res,
    url,
    errorMessage: "Could not get result contributors from Cristin",
  });
}

export function fetchInstitutions(params: GetInstitutionsParams): FetchResponse<ListOfInstitutions> {
  const url = `${URL_CRISTIN}/institutions`;
  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfInstitutions>({
    res,
    url,
    errorMessage: "Could not get institutions from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchInstitution({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Institution {
  const url = `${URL_CRISTIN}/institutions/${id}`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Institution>({
    res,
    url,
    errorMessage: "Could not get project from Cristin",
  });
}

export function fetchResultCategories(params?: { lang?: string }): FetchResponse<Array<Result["category"]>> {
  const url = `${URL_CRISTIN}/results/categories`;
  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: params?.lang ?? DEFAULT_PARAMS_LANG,
    },
  });

  const data = parseResponse<Array<Result["category"]>>({
    res,
    url,
    errorMessage: "Could not get units from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchUnits(params: GetUnitsParams): FetchResponse<ListOfUnits> {
  const url = `${URL_CRISTIN}/units`;
  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfUnits>({
    res,
    url,
    errorMessage: "Could not get units from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchUnit({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Unit {
  const url = `${URL_CRISTIN}/units/${id}`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Unit>({
    res,
    url,
    errorMessage: "Could not get unit from Cristin",
  });
}

export function fetchFundings(params: GetFundingsParams): FetchResponse<ListOfFundings> {
  const url = `${URL_CRISTIN}/fundings`;
  const res = httpRequest({
    url,
    method: "GET",
    connectionTimeout: 30000,
    readTimeout: 30000,
    params: {
      lang: DEFAULT_PARAMS_LANG,
      per_page: DEFAULT_PARAMS_PER_PAGE,
      ...params,
    },
  });

  const data = parseResponse<ListOfFundings>({
    res,
    url,
    errorMessage: "Could not get fundings from Cristin",
  });

  return {
    count: data.length,
    total: getTotalCountHeader(res) || data.length,
    data,
  };
}

export function fetchFunding({ id, lang = DEFAULT_PARAMS_LANG }: GetSingleParams): Funding {
  const url = `${URL_CRISTIN}/fundings/${id}`;
  const res = httpRequest({
    url,
    method: "GET",
    params: { lang },
  });

  return parseResponse<Funding>({
    res,
    url,
    errorMessage: "Could not get funding from Cristin",
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

export interface GetPersonResultsParams {
  id?: string;
  lang?: string;
  page?: string;
  per_page?: string;
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

export interface GetFundingsParams {
  id?: string;
  funding_source_name?: string;
  funding_source?: string;
  project_code?: string;
  funding?: string;
  lang?: string;
  page?: string;
  per_page?: string;
  fields?: string;
}

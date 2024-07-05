import {Extensions, GraphQL} from "@enonic-types/guillotine";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION,
  GRAPHQL_OBJECT_NAME_CRISTIN_PERSON,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_COORDINATING_INSTITUTION,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_FUNDING_SOURCE,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT_ROLE,
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_STATUS,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT,
  GRAPHQL_OBJECT_NAME_CRISTIN_UNIT,
} from "/lib/cristin/graphql/constants";

import {
  getCristinInstitution, getCristinPerson, getCristinResult,
  getCristinUnit
} from "/lib/cristin";
import {forceArray, getLastSubstringAfter, notNullOrUndefined} from "/lib/cristin/utils";
import {getLocalized} from "/lib/cristin/utils/locale";

export function extensions(graphQL: GraphQL): Extensions {
  return {
    enums: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_STATUS]: {
         description: "Status values for projects",
           values: {
            notStarted: "NOTSTARTED",
            active: "ACTIVE",
            concluded: "CONCLUDED"
           }
      }
    },
    types: {
       [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_COORDINATING_INSTITUTION]: {
         description: "A coordinating institution for a cristin project",
         fields: {
           institution: {
             type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION)
           },
           unit: {
             type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_UNIT)
           },
         }
       },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT_ROLE]: {
         description: "The role of a participant of a cristin project",
        fields: {
          roleCode: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          institution: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION)
          },
          unit: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_UNIT)
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT]: {
        description: "A participant of a cristin project",
        fields: {
          personId: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          person: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PERSON)
          },
          firstName: {
            type: graphQL.GraphQLString
          },
          surname: {
            type: graphQL.GraphQLString
          },
          url: {
            type: graphQL.GraphQLString
          },
          roles: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT_ROLE)),
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_FUNDING_SOURCE]: {
        description: "The source of funding for a project",
        fields: {
          code: {
            type: graphQL.GraphQLString,
          },
          name: {
            type: graphQL.GraphQLString,
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT]: {
        description: "A project from Cristin",
        fields: {
          id: {
            type: graphQL.GraphQLID
          },
          title: {
            type: graphQL.GraphQLString
          },

          startDate: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },

          endDate: {
            type: graphQL.GraphQLString
          },

          status: {
            type: graphQL.nonNull(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_STATUS))
          },

          coordinatingInstitution: {
            type: graphQL.nonNull(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_COORDINATING_INSTITUTION))
          },

          institutionsResponsibleForResearch: {
            type: graphQL.nonNull(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_COORDINATING_INSTITUTION))
          },

          participants: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT))
          },

          academicSummary: {
            type: graphQL.GraphQLString
          },

          academicSummaryLang: {
            type: graphQL.GraphQLString
          },

          method: {
            type: graphQL.GraphQLString
          },

          methodLang: {
            type: graphQL.GraphQLString
          },

          results: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT))
          },

          fundingSources: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_FUNDING_SOURCE))
          },

          dataAsJson: {
            type: graphQL.Json,
          },
        }
      }
    },
    creationCallbacks: {},
    resolvers: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_COORDINATING_INSTITUTION]: {
        institution: (env) => {
          return env.source.institution?.cristin_institution_id
              ? getCristinInstitution(env.source.institution.cristin_institution_id)
              : undefined
        },
        unit: (env) => {
          return env.source.unit.cristin_unit_id ? getCristinUnit(env.source.unit.cristin_unit_id) : undefined
        }
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT_ROLE]: {
        roleCode: (env) => {
          return env.source.role_code;
        },
        institution: (env) => {
          return getCristinInstitution(env.source.institution.cristin_institution_id)
        },
        unit: (env) => {
          return env.source.unit
        }
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT_PARTICIPANT]: {
        personId: (env) =>   env.source.cristin_person_id,
        person: (env) =>  {
          return env.source.cristin_person_id ?
            getCristinPerson(env.source.cristin_person_id) :
            undefined
        },
        firstName: (env) => env.source.first_name,
        surname: (env) =>  env.source.surname,
        url: (env) =>  env.source.url,
        roles: (env) =>  forceArray(env.source.roles)
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT]: {
        id: (env) => env.source.cristin_project_id,
        title: (env) => {
          return getLocalized({
              lang: env.localContext.lang, //TODO FIX
              languageNode: env.source.title,
            })[0]
        },

        startDate: (env) =>  env.source.start_date,
        endDate: (env) => env.source.end_date,
        status: (env) => env.source.status,
        coordinatingInstitution: (env) => env.source.coordinating_institution,
        institutionsResponsibleForResearch: (env) => env.source.institutions_responsible_for_research,
        participants: (env) => env.source.participants,
        academicSummary: (env) => {
          return getLocalized({
              lang: env.localContext.lang, // TODO FIX
              languageNode: env.source.academic_summary,
            })[0]
        },

        academicSummaryLang: (env) => {
          return getLocalized({
              lang: env.localContext.lang, // TODO FIX
              languageNode: env.source.academic_summary,
            })[1]
        },

        method: (env) => {
          return getLocalized({
              lang: env.localContext.lang, // TODO FIX
              languageNode: env.source.method,
            })[0]
        },

        methodLang: (env) => {
          return getLocalized({
              lang: env.localContext.lang, // TODO FIX
              languageNode: env.source.method,
            })[1]
        },

        results: (env) => {
          return forceArray(env.source.results)
              .map((url) => getLastSubstringAfter(url, "/"))
              .filter(notNullOrUndefined)
              .map((id) => getCristinResult(id))
        },

        fundingSources: (env) => {
          return forceArray(env.source.project_funding_sources).map((fundingSource) => ({
              code: fundingSource.funding_source_code,
              name: getLocalized({
                lang: env.localContext.lang, // TODO FIX
                languageNode: fundingSource.funding_source_name,
              })[0],
            }))
        },

        dataAsJson: (env) =>  env.source,
      }
    }
  }
}

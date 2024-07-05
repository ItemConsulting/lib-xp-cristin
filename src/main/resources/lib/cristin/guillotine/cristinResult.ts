import {Extensions, GraphQL} from "@enonic-types/guillotine";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CATEGORY,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION_ROLE,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_JOURNAL,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_LINK,
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_PUBLISHER, GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_SERIES,
  GRAPHQL_OBJECT_NAME_CRISTIN_UNIT,
} from "/lib/cristin/graphql/constants";
import {getLocalized} from "/lib/cristin/utils/locale";
import {
  type CristinResultContributorAffiliation,
  CristinResultContributorAffiliationsRole,
  getCristinInstitution, getCristinResultContributors,
  getCristinUnit, type ListOfResultContributors, type Result
} from "/lib/cristin";
import {Institution,Unit} from "/lib/cristin/types/generated";
import {forceArray} from "/lib/cristin/utils";

export function extensions(graphQL: GraphQL): Extensions {
  return {
    types: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CATEGORY]: {
        description: "A result from Cristin",
        fields: {
          code: {
            type: graphQL.GraphQLString,
          },
          category: {
            type: graphQL.GraphQLString,
          }
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_JOURNAL]: {
        description: "A result from Cristin",
        fields: {
          journalId: {
            type: graphQL.GraphQLID,
          },
          name: {
            type: graphQL.GraphQLString,
          },
          nviLevel: {
            type: graphQL.GraphQLString,
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION_ROLE]: {
        description: "A role of a contributor to a Cristin Result",
        fields: {
          code: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          name: {
            type: graphQL.GraphQLString
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION]: {
        description: "A Cristin Result contributors affiliations",
        fields: {
          role: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION_ROLE)
          },
          institution: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION)
          },
          unit: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_UNIT)
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS]: {
        description: "A contributor to a Cristin Result",
        fields: {
          id: {
            type: graphQL.GraphQLID,
          },
          firstName: {
            type: graphQL.GraphQLString
          },
          surname: {
            type: graphQL.GraphQLString, // TODO we need resolver?
          },
          order: {
            type: graphQL.GraphQLInt,
          },
          affiliations: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION))
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_LINK]: {
        description: "An external url and type",
        fields: {
          urlType: {
            type: graphQL.nonNull(graphQL.GraphQLString),
          },
          url: {
            type: graphQL.nonNull(graphQL.GraphQLString),
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_PUBLISHER]: {
        description: "A publisher",
        fields: {
          cristinPublisherId: {
            type: graphQL.GraphQLID,
          },
          name: {
            type: graphQL.GraphQLString,
          },
          place: {
            type: graphQL.GraphQLString,
          },
          url: {
            type: graphQL.GraphQLString,
          },
          nviLevel: {
            type: graphQL.GraphQLString,
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_SERIES]: {
        description: "A series",
        fields: {
          cristinJournalId: {
            type: graphQL.GraphQLString
          },
          name: {
            type: graphQL.GraphQLString,
          },
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT]: {
        description: "A result from Cristin",
        fields: {
          id: {
            type: graphQL.nonNull(graphQL.GraphQLID)
          },
          category: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CATEGORY)
          },
          journal: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_JOURNAL)
          },
          links: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_LINK))
          },
          title: {
            type: graphQL.GraphQLString
          },
          titleLang: {
            type: graphQL.GraphQLString
          },
          summary: {
            type: graphQL.GraphQLString
          },
          summaryLang: {
            type: graphQL.GraphQLString
          },
          yearPublished: {
            type: graphQL.GraphQLString
          },
          contributors: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS))
          },
          created: {
            type: graphQL.GraphQLString
          },
          lastModified: {
            type: graphQL.GraphQLString
          },
          volume: {
            type: graphQL.GraphQLString
          },
          issue: {
            type: graphQL.GraphQLString
          },
          numberOfPages: {
            type: graphQL.GraphQLString
          },
          publisher: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_PUBLISHER)
          },
          series: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_SERIES)
          },
          dataAsJson: {
            type: graphQL.Json
          }
        },
      }
    },

    creationCallbacks: {},

    resolvers: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CATEGORY]: {
        code: (env) => env.source.code,
        category: (env) =>  {
          return getLocalized({
                lang: env.localContext.lang, // TODO FIX
                languageNode: env.source.name,
              })[0]
        }
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_JOURNAL]: {
        journalId: (env) => env.source.cristin_journal_id,
        name: (env) => env.source.name,
        nviLevel: (env) => env.source.nvi_level
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION_ROLE]: {
        code: (env): string => env.source.code,
        name: (env): string | undefined  => {
            return getLocalized({
              lang: env.localContext.lang, // TODO: FIX
              languageNode: env.source.name,
            })[0]
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS_AFFILIATION]: {
        role: (env): CristinResultContributorAffiliationsRole | undefined  =>  {
          return env.source.role
        },
        institution: (env): Institution | void => {
            return env.source.institution?.cristin_institution_id
              ? getCristinInstitution(env.source.institution?.cristin_institution_id)
              : undefined
        },
        unit: (env): Unit | void =>  {
            return env.source.unit?.cristin_unit_id ? getCristinUnit(env.source.unit?.cristin_unit_id) : undefined;
        },
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_CONTRIBUTORS]: {
        id: (env): string | undefined  => env.source.cristin_person_id,
        firstName: (env): string | undefined => env.source.first_name,
        affiliations: (env): Array<CristinResultContributorAffiliation> => {
          return forceArray(env.source.affiliations)
        }
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_LINK]: {
        urlType: (env) => env.source.url_type,
        url: (env) => env.source.url,
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_PUBLISHER]: {
        cristinPublisherId: (env) =>   env.source.cristin_publisher_id,
        nviLevel: (env) =>  env.source.nvi_level
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT_SERIES]: {
        cristinJournalId: (env) => env.source.cristin_journal_id
      },

      [GRAPHQL_OBJECT_NAME_CRISTIN_RESULT]: {
        id: (env): string | undefined => env.source.cristin_result_id,
        category: (env): Result["category"] => env.source.category,
        journal: (env) => env.source.journal,
        links: (env): NonNullable<Result["links"]> => forceArray(env.source.links),
        title: (env): string | undefined  => {
            return getLocalized({
              lang: env.localContext.lang, //TODO: FIX
              languageNode: env.source.title,
              originalLanguage: env.source.original_language,
            })[0]
        },
        titleLang: (env): string => {
          return getLocalized({
              lang: env.localContext.lang, //TODO: FIX
              languageNode: env.source.title,
              originalLanguage: env.source.original_language,
            })[1]
        },
        summary: (env) => {
          return getLocalized({
              lang: env.localContext.lang, //TODO: FIX
              languageNode: env.source.summary,
              originalLanguage: env.source.original_language,
            })[0]
        },
        summaryLang: (env) => {
          return getLocalized({
              lang: env.localContext.lang, //TODO: FIX
              languageNode: env.source.summary,
              originalLanguage: env.source.original_language,
            })[1]
        },
        yearPublished: (env) => env.source.year_published,
        contributors: (env): ListOfResultContributors | void  => {
            return env.source.cristin_result_id ? getCristinResultContributors(env.source.cristin_result_id) : [];
        },
        created: (env) => env.source.created?.date,
        lastModified: (env) => env.source.last_modified?.date,
        volume: (env) => env.source.volume,
        issue: (env) => env.source.issue,
        numberOfPages: (env) => env.source.number_of_pages,
        publisher: (env) => env.source.publisher,
        series: (env) => env.source.series,
        dataAsJson: (env) => env.source,
      }
    }
  }
}

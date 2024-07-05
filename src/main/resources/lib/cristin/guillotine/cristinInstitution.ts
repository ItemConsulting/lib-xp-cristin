import { GraphQL, Extensions } from "@enonic-types/guillotine";
import {GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION} from "/lib/cristin/graphql";
import {getLocalized} from "/lib/cristin/utils/locale";
import {getCristinUnit} from "/lib/cristin";


export function extensions(graphQL: GraphQL): Extensions {
  return {
    types: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION]: {
        description: "An institution from Cristin",
        fields: {
          id: {
            type: graphQL.GraphQLID
          },
          institutionName: {
            type: graphQL.GraphQLString
          },
          institutionNameLang: {
            type: graphQL.GraphQLString
          },
          acronym: {
            type: graphQL.GraphQLString
          },
          country: {
            type: graphQL.GraphQLString
          },
          cristinUserInstitution: {
            type: graphQL.GraphQLString
          },
          correspondingUnit: {
            type: graphQL.GraphQLString
          },
          dataAsJson: {
            type: graphQL.Json
          }
        }
      }
    },
    creationCallbacks: {},
    resolvers: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION]: {
        id: (env) => {
          return env.source.cristin_institution_id;
        },
        institutionName: (env) => {
          return getLocalized({
            lang: env.localContext.lang, // TODO: find correct lang field. By SiteConfig?
            languageNode: env.source.institution_name
          })[0]
        },
        institutionNameLang: (env) => {
          return getLocalized({
            lang: env.localContext.lang, //TODO: FIX
            languageNode: env.source.institution_name
          })
        },
        acronym: (env) => {
          return env.source.acronym
        },
        country: (env) => {
          return env.source.country
        },
        cristinUserInstitution: (env) => {
          return env.source.cristin_user_institution
        },
        correspondingUnit: (env) => {
          return env.source.corresponding_unit?.cristin_unit_id
            ? getCristinUnit(env.source.corresponding_unit?.cristin_unit_id)
            : undefined
        },
        dataAsJson: (env) => {
          env.source
        }
      }
    }
  }
}

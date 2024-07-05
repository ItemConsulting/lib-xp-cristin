import { GraphQL, Extensions } from "@enonic-types/guillotine";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION,
  GRAPHQL_OBJECT_NAME_CRISTIN_PERSON,
} from "/lib/cristin/graphql";
import {getCristinInstitution, } from "/lib/cristin";
import {getLocalized} from "/lib/cristin/utils/locale";
import {GRAPHQL_OBJECT_NAME_CRISTIN_PERSON_AFFILIATION} from "/lib/cristin/graphql/constants";
import {forceArray} from "/lib/cristin/utils";
import {serviceUrl} from "/lib/xp/portal";


export function extensions(graphQL: GraphQL): Extensions {
  return {
    types: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_PERSON_AFFILIATION]: {
        description: "A persons affiliation from Cristin",
        fields: {
          institution: {
            type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION)
          },
          position: {
            type: graphQL.GraphQLString
          },
          positionLang: {
            type: graphQL.GraphQLString
          },
          active: {
            type: graphQL.GraphQLBoolean
          }
        }
      },
      [GRAPHQL_OBJECT_NAME_CRISTIN_PERSON]: {
        description: "A person from Cristin",
        fields: {
          id: {
            type: graphQL.nonNull(graphQL.GraphQLID)
          },
          url: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          firstName: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          surname: {
            type: graphQL.nonNull(graphQL.GraphQLString)
          },
          tel: {
            type: graphQL.GraphQLString,
          },
          firstNamePreferred: {
            type: graphQL.GraphQLString
          },
          surnamePreferred: {
            type: graphQL.GraphQLString
          },
          affiliations: {
            type: graphQL.list(graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_PERSON_AFFILIATION)),
          },
          pictureUrl: {
            type: graphQL.GraphQLString,
          },
          dataAsJson: {
            type: graphQL.Json,
            // resolve: (env: GraphQLResolverEnvironment<Person>) => env.source,
          },
        }
      }
    },
    creationCallbacks: {},
    resolvers: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_PERSON_AFFILIATION]: {
        institution: (env) => {
          return env.source.institution?.cristin_institution_id
            ? getCristinInstitution(env.source.institution.cristin_institution_id)
            : undefined
        },
        position: (env): string | undefined => {
          return getLocalized({
            lang: env.localContext.lang, //TODO: FIX
            languageNode: env.source.position,
          })[0]
        },
        positionLang: (env) => {
          return getLocalized({
            lang: env.localContext.lang, //TODO: FIX
            languageNode: env.source.position,
          })[1]
        },
        active: (env) => {
          return env.source.active
        }
      },
      [GRAPHQL_OBJECT_NAME_CRISTIN_PERSON]: {
        id: (env) => env.source.cristin_person_id,
        url: (env) => env.source.cristin_profile_url,
        firstName: (env) => env.source.first_name,
        surname: (env) => env.source.surname,
        tel: (env) => env.source.tel,
        firstNamePreferred: (env) =>  env.source.first_name_preferred,
        surnamePreferred: (env) => env.source.surname_preferred,
        affiliation: (env) => forceArray(env.source.affiliations),
        pictureUrl: (env) => {
          return env.source.picture_url
            ? serviceUrl({
              application: "no.item.cristin",
              service: "person-image",
              type: "absolute",
              params: {
                personId: env.source.cristin_person_id,
              },
            })
            : undefined;
        },
        dataAsJson: (env) => env.source
      }
    }
  }

}

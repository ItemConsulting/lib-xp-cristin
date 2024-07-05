import {Extensions, GraphQL} from "@enonic-types/guillotine";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION,
  GRAPHQL_OBJECT_NAME_CRISTIN_UNIT,
} from "/lib/cristin/graphql";
import {getCristinInstitution} from "/lib/cristin";
import {getLocalized} from "/lib/cristin/utils/locale";
import {getCristinInstitutionIdByUnitId} from "/lib/cristin/utils";

export function extensions(graphQL: GraphQL): Extensions {
  return {
    types: {
       [GRAPHQL_OBJECT_NAME_CRISTIN_UNIT]: {
         description: "A unit from Cristin",
         fields: {
           id: {
             type: graphQL.GraphQLID,
           },

           unitName: {
             type: graphQL.GraphQLString,
           },

           institution: {
             type: graphQL.reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION),
           },

           dataAsJson: {
             type: graphQL.Json,
             // resolve: (env: GraphQLResolverEnvironment<Unit>) => env.source,
           },
         },
       }
    },
    creationCallbacks: {},
    resolvers: {
      [GRAPHQL_OBJECT_NAME_CRISTIN_UNIT]:{
        id: (env) => env.source.cristin_unit_id,
        unitName: (env): string | undefined =>  {
          return getLocalized({
              lang: env.localContext.lang, // TODO FIX
              languageNode: env.source.unit_name,
            })[0]
        },

        institution: (env) => {
            const institutionId =
              env.source.institution?.cristin_institution_id ??
              getCristinInstitutionIdByUnitId(env.source.cristin_unit_id);
            return institutionId ? getCristinInstitution(institutionId) : undefined;
        },
        dataAsJson: (env) => env.source
      }
    }
  }
}

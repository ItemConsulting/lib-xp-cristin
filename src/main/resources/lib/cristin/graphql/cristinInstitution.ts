import { GraphQLBoolean, type GraphQLResolverEnvironment, type GraphQLObjectType, GraphQLString } from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import { getCristinUnit } from "../index";
import { getLocalized } from "/lib/cristin/utils/locale";
import { type Institution } from "/lib/cristin/types/generated";
import { GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION, GraphQLCristinUnit } from "/lib/cristin/graphql/constants";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";

export function createObjectTypeCristinInstitution(context: Context, options?: ContextOptions): GraphQLObjectType {
  return createObjectType(context, options, {
    name: context.uniqueName(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION),
    description: "An institution from Cristin",
    fields: {
      id: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Institution>) => {
          return env.source.cristin_institution_id;
        },
      },

      institutionName: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Institution>) => getLocalized(env, env.source.institution_name),
      },

      acronym: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Institution>) => env.source.acronym,
      },

      country: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Institution>) => env.source.country,
      },

      cristinUserInstitution: {
        type: GraphQLBoolean,
        resolve: (env: GraphQLResolverEnvironment<Institution>) => env.source.cristin_user_institution,
      },

      correspondingUnit: {
        type: GraphQLCristinUnit,
        resolve: (env: GraphQLResolverEnvironment<Institution>) =>
          env.source.corresponding_unit?.cristin_unit_id
            ? getCristinUnit(env.source.corresponding_unit?.cristin_unit_id)
            : undefined,
      },
    },
  });
}

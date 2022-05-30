import { type GraphQLResolverEnvironment, type GraphQLObjectType, GraphQLString, GraphQLID, Json } from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import { getCristinInstitution } from "/lib/cristin";
import { type Unit } from "/lib/cristin/types/generated";
import { getLocalized } from "/lib/cristin/utils/locale";
import { GRAPHQL_OBJECT_NAME_CRISTIN_UNIT, GraphQLCristinInstitution } from "/lib/cristin/graphql/constants";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";
import { getCristinInstitutionIdByUnitId } from "/lib/cristin/utils";

export function createObjectTypeCristinUnit(context: Context, options?: ContextOptions): GraphQLObjectType {
  return createObjectType(context, options, {
    name: context.uniqueName(GRAPHQL_OBJECT_NAME_CRISTIN_UNIT),
    description: "A unit from Cristin",
    fields: {
      id: {
        type: GraphQLID,
        resolve: (env: GraphQLResolverEnvironment<Unit>) => {
          return env.source.cristin_unit_id;
        },
      },

      unitName: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Unit>) => getLocalized(env, env.source.unit_name),
      },

      institution: {
        type: GraphQLCristinInstitution,
        resolve: (env: GraphQLResolverEnvironment<Unit>) => {
          const institutionId =
            env.source.institution?.cristin_institution_id ??
            getCristinInstitutionIdByUnitId(env.source.cristin_unit_id);

          return institutionId ? getCristinInstitution(institutionId) : undefined;
        },
      },

      dataAsJson: {
        type: Json,
        resolve: (env: GraphQLResolverEnvironment<Unit>) => env.source,
      },
    },
  });
}

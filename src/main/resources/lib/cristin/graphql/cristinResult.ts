import {
  GraphQLString,
  GraphQLInt,
  Json,
  nonNull,
  list,
  type GraphQLResolverEnvironment,
  type GraphQLObjectType,
} from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import {
  type CristinResultCategory,
  CristinResultContributor,
  CristinResultContributorAffiliation,
  CristinResultContributorAffiliationsRole,
  type CristinResultJournal,
  Institution,
  ListOfResultContributors,
  type Result,
} from "/lib/cristin/types/generated";
import { getLocalized } from "/lib/cristin/utils/locale";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_RESULT,
  GraphQLCristinInstitution,
  GraphQLCristinUnit,
} from "/lib/cristin/graphql/constants";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";
import { getCristinInstitution, getCristinResultContributors, getCristinUnit } from "/lib/cristin";
import { Unit } from "*/lib/cristin";
import { forceArray } from "/lib/cristin/utils";

export function createObjectTypeCristinResult(context: Context, options?: ContextOptions): GraphQLObjectType {
  const category = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Category`),
    description: "A result from Cristin",
    fields: {
      code: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultCategory>) => env.source.code,
      },
      category: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultCategory>) => getLocalized(env, env.source.name),
      },
    },
  });

  const journal = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Journal`),
    description: "A result from Cristin",
    fields: {
      journalId: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultJournal>) => env.source.cristin_journal_id,
      },
      name: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultJournal>) => env.source.name,
      },
      nviLevel: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultJournal>) => env.source.nvi_level,
      },
    },
  });

  const affiliationRole = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Contributors_Affiliation_Role`),
    description: "A role of a contributor to a Cristin Result",
    fields: {
      code: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributorAffiliationsRole>): string => env.source.code,
      },
      name: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributorAffiliationsRole>): string | undefined =>
          getLocalized(env, env.source.name),
      },
    },
  });

  const affiliation = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Contributors_Affiliation`),
    description: "A Cristin Result contributors affiliations",
    fields: {
      role: {
        type: affiliationRole,
        resolve: (
          env: GraphQLResolverEnvironment<CristinResultContributorAffiliation>
        ): CristinResultContributorAffiliationsRole | undefined => env.source.role,
      },
      institution: {
        type: GraphQLCristinInstitution,
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributorAffiliation>): Institution | void => {
          return env.source.institution?.cristin_institution_id
            ? getCristinInstitution(env.source.institution?.cristin_institution_id)
            : undefined;
        },
      },
      unit: {
        type: GraphQLCristinUnit,
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributorAffiliation>): Unit | void => {
          return env.source.unit?.cristin_unit_id ? getCristinUnit(env.source.unit?.cristin_unit_id) : undefined;
        },
      },
    },
  });

  const contributors = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Contributors`),
    description: "A contributor to a Cristin Result",
    fields: {
      id: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributor>): string | undefined =>
          env.source.cristin_person_id,
      },
      firstName: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinResultContributor>): string | undefined =>
          env.source.first_name,
      },
      surname: {
        type: GraphQLString,
      },
      order: {
        type: GraphQLInt,
      },
      affiliations: {
        type: list(affiliation),
        resolve: (
          env: GraphQLResolverEnvironment<CristinResultContributor>
        ): Array<CristinResultContributorAffiliation> => forceArray(env.source.affiliations),
      },
    },
  });

  return createObjectType(context, options, {
    name: context.uniqueName(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT),
    description: "A result from Cristin",
    fields: {
      id: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.cristin_result_id,
      },
      category: {
        type: category,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.category,
      },
      journal: {
        type: journal,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.journal,
      },
      title: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Result>) => getLocalized(env, env.source.title),
      },
      summary: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Result>) => getLocalized(env, env.source.summary),
      },
      yearPublished: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.year_published,
      },
      contributors: {
        type: list(contributors),
        resolve: (env: GraphQLResolverEnvironment<Result>): ListOfResultContributors | void => {
          return env.source.cristin_result_id ? getCristinResultContributors(env.source.cristin_result_id) : [];
        },
      },
      created: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.created?.date,
      },
      lastModified: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source.last_modified?.date,
      },
      dataAsJson: {
        type: Json,
        resolve: (env: GraphQLResolverEnvironment<Result>) => env.source,
      },
    },
  });
}

export function createObjectTypeCristinResultCategory(context: Context, options?: ContextOptions): GraphQLObjectType {
  return createObjectType(context, options, {
    name: `${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Categories`,
    fields: {
      code: {
        type: nonNull(GraphQLString),
      },
      name: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<CristinResultCategory>) => getLocalized(env, env.source.name),
      },
    },
  });
}

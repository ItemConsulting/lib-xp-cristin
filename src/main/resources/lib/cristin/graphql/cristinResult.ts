import { type GraphQLResolverEnvironment, type GraphQLObjectType, GraphQLString, nonNull } from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import { type CristinResultCategory, type CristinResultJournal, type Result } from "/lib/cristin/types/generated";
import { getLocalized } from "/lib/cristin/utils/locale";
import { GRAPHQL_OBJECT_NAME_CRISTIN_RESULT } from "/lib/cristin/graphql/constants";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";

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
    },
  });
}

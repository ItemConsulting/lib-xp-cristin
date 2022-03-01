import {
  GraphQLString,
  Json,
  nonNull,
  list,
  type GraphQLResolverEnvironment,
  type GraphQLObjectType,
} from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import { type CristinResultCategory, type CristinResultJournal, type Result } from "/lib/cristin/types/generated";
import { getLocalized } from "/lib/cristin/utils/locale";
import { GRAPHQL_OBJECT_NAME_CRISTIN_RESULT } from "/lib/cristin/graphql/constants";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";
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

  const contributors = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_RESULT}_Contributors`),
    description: "A contributor to a Cristin Result",
    fields: {
      firstName: {
        type: nonNull(GraphQLString),
      },
      surname: {
        type: nonNull(GraphQLString),
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
        resolve: (env: GraphQLResolverEnvironment<Result>) =>
          forceArray(env.source.contributors?.preview).map((person) => {
            return {
              firstName: person.first_name,
              surname: person.surname,
            };
          }),
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

import { getCristinInstitution } from "/lib/cristin";
import { GRAPHQL_OBJECT_NAME_CRISTIN_PERSON, GraphQLCristinInstitution } from "/lib/cristin/graphql/constants";
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLString,
  Json,
  list,
  nonNull,
  type GraphQLResolverEnvironment,
  type GraphQLObjectType,
} from "/lib/graphql";
import { getLocalized } from "/lib/cristin/utils/locale";
import { forceArray } from "/lib/cristin/utils";
import { createObjectType, type ContextOptions } from "/lib/cristin/graphql/graphql-utils";
import { serviceUrl } from "/lib/xp/portal";
import type { Context } from "/lib/guillotine";
import type { CristinPersonAffiliation, Person } from "/lib/cristin/types/generated";

export function createObjectTypeCristinPerson(context: Context, options?: ContextOptions): GraphQLObjectType {
  const cristinPersonAffiliationObjectType = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_PERSON}_Affiliation`),
    description: "A persons affiliation from Cristin",
    fields: {
      institution: {
        type: GraphQLCristinInstitution,
        resolve: (env: GraphQLResolverEnvironment<CristinPersonAffiliation>) =>
          env.source.institution?.cristin_institution_id
            ? getCristinInstitution(env.source.institution.cristin_institution_id)
            : undefined,
      },

      position: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinPersonAffiliation>): string | undefined =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.position,
          })[0],
      },

      positionLang: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinPersonAffiliation>): string =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.position,
          })[1],
      },

      active: {
        type: GraphQLBoolean,
        resolve: (env: GraphQLResolverEnvironment<CristinPersonAffiliation>) => env.source.active,
      },
    },
  });

  return createObjectType(context, options, {
    name: context.uniqueName(GRAPHQL_OBJECT_NAME_CRISTIN_PERSON),
    description: "A person from Cristin",
    fields: {
      id: {
        type: nonNull(GraphQLID),
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.cristin_person_id,
      },
      url: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.cristin_profile_url,
      },
      firstName: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.first_name,
      },
      surname: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.surname,
      },
      tel: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.tel,
      },
      firstNamePreferred: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.first_name_preferred,
      },
      surnamePreferred: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source.surname_preferred,
      },
      affiliations: {
        type: list(cristinPersonAffiliationObjectType),
        resolve: (env: GraphQLResolverEnvironment<Person>) => {
          return forceArray(env.source.affiliations);
        },
      },
      pictureUrl: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Person>) => {
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
      },
      dataAsJson: {
        type: Json,
        resolve: (env: GraphQLResolverEnvironment<Person>) => env.source,
      },
    },
  });
}

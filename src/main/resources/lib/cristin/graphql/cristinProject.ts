import {
  GraphQLID,
  GraphQLString,
  Json,
  nonNull,
  list,
  type GraphQLResolverEnvironment,
  type GraphQLObjectType,
} from "/lib/graphql";
import { type Context } from "/lib/guillotine";
import {
  GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT,
  GraphQLCristinInstitution,
  GraphQLCristinUnit,
  GraphQLCristinPerson,
  GraphQLCristinResult,
} from "/lib/cristin/graphql/constants";
import { getCristinUnit, getCristinPerson, getCristinInstitution, getCristinResult } from "/lib/cristin";
import {
  CristinProjectCoordinatingInstitution,
  CristinProjectParticipant,
  CristinProjectParticipantRole,
  Project,
} from "/lib/cristin/types/generated";
import { forceArray, getLastSubstringAfter, notNullOrUndefined } from "/lib/cristin/utils";
import { getLocalized } from "/lib/cristin/utils/locale";
import { ContextOptions, createObjectType } from "/lib/cristin/graphql/graphql-utils";

export function createObjectTypeCristinProject(context: Context, options?: ContextOptions): GraphQLObjectType {
  const coordinatingInstitution = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT}_Coordinating_institution`),
    description: "A coordinating institution for a cristin project",
    fields: {
      institution: {
        type: GraphQLCristinInstitution,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectCoordinatingInstitution>) =>
          env.source.institution?.cristin_institution_id
            ? getCristinInstitution(env.source.institution.cristin_institution_id)
            : undefined,
      },
      unit: {
        type: GraphQLCristinUnit,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectCoordinatingInstitution>) =>
          env.source.unit.cristin_unit_id ? getCristinUnit(env.source.unit.cristin_unit_id) : undefined,
      },
    },
  });

  const participantRole = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT}_Participant_Role`),
    description: "The role of a participant of a cristin project",
    fields: {
      roleCode: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipantRole>) => {
          return env.source.role_code;
        },
      },
      institution: {
        type: GraphQLCristinInstitution,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipantRole>) =>
          getCristinInstitution(env.source.institution.cristin_institution_id),
      },
      unit: {
        type: GraphQLCristinUnit,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipantRole>) => env.source.unit,
      },
    },
  });

  const participant = createObjectType(context, options, {
    name: context.uniqueName(`${GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT}_Participant`),
    description: "A participant of a cristin project",
    fields: {
      personId: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) => env.source.cristin_person_id,
      },
      person: {
        type: GraphQLCristinPerson,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) =>
          env.source.cristin_person_id ? getCristinPerson(env.source.cristin_person_id) : undefined,
      },
      firstName: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) => env.source.first_name,
      },
      surname: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) => env.source.surname,
      },
      url: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) => env.source.url,
      },
      roles: {
        type: list(participantRole),
        resolve: (env: GraphQLResolverEnvironment<CristinProjectParticipant>) => forceArray(env.source.roles),
      },
    },
  });

  return createObjectType(context, options, {
    name: context.uniqueName(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT),
    description: "A project from Cristin",
    fields: {
      id: {
        type: GraphQLID,
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.cristin_project_id,
      },
      title: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>) =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.title,
          })[0],
      },

      startDate: {
        type: nonNull(GraphQLString),
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.start_date,
      },

      endDate: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.end_date,
      },

      status: {
        type: nonNull(
          context.schemaGenerator.createEnumType({
            name: `${GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT}_Status`,
            description: "Status values for projects",
            values: ["NOTSTARTED", "ACTIVE", "CONCLUDED"],
          })
        ),
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.status,
      },

      coordinatingInstitution: {
        type: nonNull(coordinatingInstitution),
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.coordinating_institution,
      },

      institutionsResponsibleForResearch: {
        type: nonNull(coordinatingInstitution),
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.institutions_responsible_for_research,
      },

      participants: {
        type: list(participant),
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source.participants,
      },

      academicSummary: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>): string | undefined =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.academic_summary,
          })[0],
      },

      academicSummaryLang: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>): string =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.academic_summary,
          })[1],
      },

      method: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>): string | undefined =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.method,
          })[0],
      },

      methodLang: {
        type: GraphQLString,
        resolve: (env: GraphQLResolverEnvironment<Project>): string | undefined =>
          getLocalized({
            lang: env.context.lang,
            languageNode: env.source.method,
          })[1],
      },

      results: {
        type: list(GraphQLCristinResult),
        resolve: (env: GraphQLResolverEnvironment<Project>) =>
          forceArray(env.source.results)
            .map((url) => getLastSubstringAfter(url, "/"))
            .filter(notNullOrUndefined)
            .map((id) => getCristinResult(id)),
      },

      fundingSources: {
        type: list(
          createObjectType(context, options, {
            name: `${GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT}_Funding_source`,
            description: "The source of funding for a project",
            fields: {
              code: {
                type: GraphQLString,
              },
              name: {
                type: GraphQLString,
              },
            },
          })
        ),
        resolve: (env: GraphQLResolverEnvironment<Project>) =>
          forceArray(env.source.project_funding_sources).map((fundingSource) => ({
            code: fundingSource.funding_source_code,
            name: getLocalized({
              lang: env.context.lang,
              languageNode: fundingSource.funding_source_name,
            })[0],
          })),
      },

      dataAsJson: {
        type: Json,
        resolve: (env: GraphQLResolverEnvironment<Project>) => env.source,
      },
    },
  });
}

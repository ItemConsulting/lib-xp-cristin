import { type CreateObjectTypeParams, type GraphQLObjectType } from "/lib/graphql";
import { type Context } from "/lib/guillotine";

export function createObjectType(
  context: Context,
  options: ContextOptions | undefined,
  createParams: CreateObjectTypeParams
): GraphQLObjectType {
  if (options?.creationCallbacks[createParams.name]) {
    options.creationCallbacks[createParams.name](context, createParams);
  }

  return context.schemaGenerator.createObjectType(createParams);
}

export interface ContextOptions {
  creationCallbacks: Record<string, (context: Context, params: CreateObjectTypeParams) => void>;
}

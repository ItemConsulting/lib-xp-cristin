import { type CreateObjectTypeParams, type GraphQLObjectType } from "/lib/graphql";
import { type Context, type EmptyObject } from "/lib/guillotine";

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

export interface ContextOptions<ExecuteContext = EmptyObject> {
  creationCallbacks: Record<
    string,
    (context: Context<ExecuteContext>, params: import("/lib/graphql").CreateObjectTypeParams<ExecuteContext>) => void
  >;
}

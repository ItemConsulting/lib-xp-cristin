import { reference } from "/lib/graphql";

export const GRAPHQL_OBJECT_NAME_CRISTIN_UNIT = "no_item_cristin_Unit";
export const GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION = "no_item_cristin_Institution";
export const GRAPHQL_OBJECT_NAME_CRISTIN_PERSON = "no_item_cristin_Person";
export const GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT = "no_item_cristin_Project";
export const GRAPHQL_OBJECT_NAME_CRISTIN_RESULT = "no_item_cristin_Result";

export const GraphQLCristinPerson = reference(GRAPHQL_OBJECT_NAME_CRISTIN_PERSON);
export const GraphQLCristinInstitution = reference(GRAPHQL_OBJECT_NAME_CRISTIN_INSTITUTION);
export const GraphQLCristinProject = reference(GRAPHQL_OBJECT_NAME_CRISTIN_PROJECT);
export const GraphQLCristinResult = reference(GRAPHQL_OBJECT_NAME_CRISTIN_RESULT);
export const GraphQLCristinUnit = reference(GRAPHQL_OBJECT_NAME_CRISTIN_UNIT);

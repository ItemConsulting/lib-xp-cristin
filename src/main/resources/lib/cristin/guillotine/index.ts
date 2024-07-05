import {extensions as cristinInstitutionExtensions} from "./cristinInstitution";
import {extensions as cristinPersonExtensions} from "./cristinPerson";
import {extensions as cristinProjectExtensions} from "./cristinProject";
import {extensions as cristinResultExtensions} from "./cristinResult";
import {extensions as cristinUnitExtensions} from "./cristinUnit";
import {Extensions, GraphQL} from "@enonic-types/guillotine";

export function extensions(graphQL: GraphQL): Extensions {
  const extensionFuncs: ((graphQL: GraphQL) => Extensions)[] = [
    cristinInstitutionExtensions,
    cristinPersonExtensions,
    cristinProjectExtensions,
    cristinResultExtensions,
    cristinUnitExtensions,
  ];
  return extensionFuncs.map(f => f(graphQL)).reduce((a, b) => {
    return {
      enums: {...(a.enums ?? {}), ...(b.enums ?? {})},
      types: {...(a.types ?? {}), ...(b.types ?? {})},
      creationCallbacks: {...(a.creationCallbacks ?? {}), ...(b.creationCallbacks ?? {})},
      resolvers: {...(a.resolvers ?? {}), ...(b.resolvers ?? {})},
    }
  }, {});
}

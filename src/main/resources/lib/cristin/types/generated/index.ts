import { type Unarray } from "enonic-types/types";

export type ListOfPersons = import("./personsList_GET_response").ListOfPersons;
export type Person = import("./persons_GET_POST_response").Person;
export type ListOfProjects = import("./projectsList_GET_response").ListOfProjects;
export type Project = import("./projects_GET_POST_response").Project;
export type ListOfResults = import("./resultsList_GET_response").ListOfResults;
export type Result = import("./results_GET_response").Results_GETResponse;
export type ListOfInstitutions = import("./institutionsList_GET_response").ListOfInstitutions;
export type Institution = import("./institutions_GET_response").Institution;
export type ListOfUnits = import("./unitsList_GET_response").ListOfUnits;
export type Unit = import("./units_GET_response").Unit;

export type CristinPersonAffiliation = NonNullable<Unarray<Person["affiliations"]>>;
export type CristinProjectCoordinatingInstitution = Project["coordinating_institution"];
export type CristinProjectParticipant = Unarray<NonNullable<Project["participants"]>>;
export type CristinProjectParticipantRole = Unarray<CristinProjectParticipant["roles"]>;
export type CristinResultCategory = NonNullable<Result["category"]>;
export interface CristinResultJournal {
  cristin_journal_id: string;
  name: string;
  international_standard_numbers: Array<{
    type: string;
    value: string;
  }>;
  nvi_level: string;
}

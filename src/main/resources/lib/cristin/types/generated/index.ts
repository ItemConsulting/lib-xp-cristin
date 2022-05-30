import { type Unarray } from "enonic-types/types";

export type ListOfPersons = import("./personsList_GET_response").ListOfPersons;
export type Person = import("./persons_GET_POST_response").Person;
export type ListOfProjects = import("./projectsList_GET_response").ListOfProjects;
export type Project = import("./projects_GET_POST_response").Project;
export type ListOfResults = import("./resultsList_GET_response").ListOfResults;
export type Result = import("./results_GET_response").Results_GETResponse;
export type ListOfResultContributors = import("./contributorsRefList_GET_response").ListOfContributorReferences;
export type ListOfInstitutions = import("./institutionsList_GET_response").ListOfInstitutions;
export type Institution = import("./institutions_GET_response").Institution;
export type ListOfUnits = import("./unitsList_GET_response").ListOfUnits;
export type Unit = import("./units_GET_response").Unit;

export type CristinResultContributor = Unarray<ListOfResultContributors>;
export type CristinResultContributorAffiliation = NonNullable<Unarray<CristinResultContributor["affiliations"]>> & {
  institution?: {
    cristin_institution_id: string;
    url: string;
  };
  unit?: {
    cristin_unit_id: string;
    unit_name: {
      en: string;
    };
    url: string;
  };
};

export type CristinResultContributorAffiliationsRole = NonNullable<CristinResultContributorAffiliation["role"]>;
export type CristinPersonAffiliation = NonNullable<Unarray<Person["affiliations"]>>;
export type CristinProjectCoordinatingInstitution = Project["coordinating_institution"];
export type CristinProjectParticipant = Unarray<NonNullable<Project["participants"]>>;
export type CristinProjectParticipantRole = Unarray<CristinProjectParticipant["roles"]>;
export type CristinResultCategory = NonNullable<Result["category"]>;
export type CristinResultPublisher = import("./results_GET_response").Publisher;
export type CristinResultLink = Unarray<NonNullable<Result["links"]>>;
export interface CristinResultJournal {
  cristin_journal_id: string;
  name: string;
  international_standard_numbers: Array<{
    type: string;
    value: string;
  }>;
  nvi_level: string;
}

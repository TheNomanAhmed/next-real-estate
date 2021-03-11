/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditHouseQuery
// ====================================================

export interface EditHouseQuery_house {
  __typename: "House";
  id: string;
  userId: string;
  address: string;
  description: string;
  image: string;
  publicId: string;
  bedrooms: number;
  price: number;
  space: number;
  build: number;
  maintainance: number;
  latitude: number;
  longitude: number;
}

export interface EditHouseQuery {
  house: EditHouseQuery_house | null;
}

export interface EditHouseQueryVariables {
  id: string;
}

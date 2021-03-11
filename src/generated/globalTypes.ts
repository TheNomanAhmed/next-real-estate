/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface BoundsInput {
  ne: CoordinatesInput;
  sw: CoordinatesInput;
}

export interface CoordinatesInput {
  latitude: number;
  longitude: number;
}

export interface HouseInput {
  address: string;
  bedrooms: number;
  build: number;
  coordinates: CoordinatesInput;
  description: string;
  image: string;
  maintainance: number;
  price: number;
  space: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

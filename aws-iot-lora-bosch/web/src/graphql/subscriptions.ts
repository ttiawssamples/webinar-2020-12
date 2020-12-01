/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSensorValue = /* GraphQL */ `
  subscription OnCreateSensorValue($sensorId: String!) {
    onCreateSensorValue(sensorId: $sensorId) {
      id
      sensorId
      humidity
      temperature
      pressure
      luminosity
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSensorValues = /* GraphQL */ `
  subscription OnCreateSensorValues {
    onCreateSensorValues {
      id
      sensorId
      humidity
      temperature
      pressure
      luminosity
      status
      timestamp
      createdAt
      updatedAt
    }
  }
`;

/* Amplify Params - DO NOT EDIT
  API_IOTDASHBOARD_GRAPHQLAPIENDPOINTOUTPUT
  API_IOTDASHBOARD_GRAPHQLAPIIDOUTPUT
  ENV
  REGION
Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require("url").URL;

//environment variables
const region = process.env.REGION
const appsyncUrl = process.env.API_IOTDASHBOARD_GRAPHQLAPIENDPOINTOUTPUT
const endpoint = new urlParse(appsyncUrl).hostname.toString();

exports.handler = async (event) => {

  console.log('event received:' + JSON.stringify(event));

  const req = new AWS.HttpRequest(appsyncUrl, region);

  //define the graphql mutation to create the sensor values 
  const mutationName = 'CreateSensorValue';
  const mutation = require('./mutations').createSensorValue;

  //set sensor status to 1
  let status = 1;

  // Extract telemetry from event messages
  var temperature = event.uplink_message.decoded_payload.temperature_1;
  var humidity = event.uplink_message.decoded_payload.relative_humidity_2;
  var pressure = event.uplink_message.decoded_payload.barometric_pressure_3;
  var luminosity = event.uplink_message.decoded_payload.luminosity_4;

  //create the mutuation input from the sensor event data, trimming decimal places 
  const item = {
    input: {
      sensorId: event.end_device_ids.device_id,
      temperature: temperature.toFixed(1),
      humidity: humidity.toFixed(0),
      pressure: pressure.toFixed(1),
      luminosity: luminosity.toFixed(0),
      status: status,
      timestamp: event.uplink_message.rx_metadata[0].timestamp
    }
  };

  //execute the mutation
  try {

    req.method = "POST";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
      query: mutation,
      operationName: mutationName,
      variables: item
    });

    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    const data = await new Promise((resolve, reject) => {
      const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
        result.on('data', (data) => {
          resolve(JSON.parse(data.toString()));
        });
      });

      httpRequest.write(req.body);
      httpRequest.end();

    });

    console.log("Successful mutation");

    return {
      statusCode: 200,
      body: data
    };

  }
  catch (err) {
    console.log("error: " + err);
    throw new Error("Error creating sensor value for sensor: " + event.end_device_ids.device_id);
  }
}

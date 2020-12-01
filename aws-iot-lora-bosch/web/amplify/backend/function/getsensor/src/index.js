const AWS = require('aws-sdk');
const iotClient = new AWS.Iot();
const geo = {
    "latitude": 56.0660,
    "longitude": -3.2204
};

var region = process.env.REGION;

AWS.config.update({
    region: region
});

exports.handler = async (event) => {

    //query for the sensor confirming it has a reported shadow
    //you must have fleet indexing enabled in IoT Core with REGISTRY_AND_SHADOW indexed

    const sensorId = event.arguments.sensorId || "";

    try {

        var params = {
            // queryString: 'shadow.reported.name:* AND thingName:' + sensorId
            //            queryString: 'thingName:' + sensorId
            queryString: 'attributes.deviceID:' + sensorId
        };
        console.log("query: " + JSON.stringify(params));

        var result = await iotClient.searchIndex(params).promise();

        if (result.things.length > 0) {
            var element = result.things[0];
            element.sensorId = element.attributes.deviceID;
            element.name = element.attributes.deviceID;
            element.enabled = true;
            // hardcoded pending gps integration
            element.geo = geo;
            console.log("thing details queried: " + JSON.stringify(element));

            return element;

        } else {

            throw new Error("Sensor not found:" + sensorId);
        }
    }
    catch (err) {

        console.log("error: " + err);
        throw new Error("Error retrieving sensor: " + sensorId);
    }
};

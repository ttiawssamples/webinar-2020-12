const AWS = require('aws-sdk');
const iotClient = new AWS.Iot();

var region = process.env.REGION;

AWS.config.update({
    region: region
});

exports.handler = async (event) => {

    // Default lat / long for non geo-aware devices
    var geo = {
        "latitude": 56.0660,
        "longitude": -3.2205
    };

    var resultArray = [];

    //query all sensors that have reported a shadow and of type water quality sensor
    //you must have fleet indexing enabled in IoT Core with REGISTRY_AND_SHADOW indexed

    var params = {
        queryString: 'thingTypeName:lorawan-tti-v3 AND attributes.deviceID:bosch-xdk-*'
    };

    try {

        var result = await iotClient.searchIndex(params).promise();

        //build an array of the thing shadow values and return array
        result.things.forEach(element => {

            var shadow = { "reported": {} };

            // shadow.reported.sensorEUI = element.thingName;
            var sensorId = element.attributes.deviceID;
            shadow.reported.sensorId = sensorId;
            shadow.reported.name = sensorId;
            shadow.reported.enabled = true;
            shadow.reported.geo = geo;

            resultArray.push(shadow.reported);
        });

        return resultArray;
    }
    catch (err) {

        console.log("error: " + err);

        throw err;
    }
};

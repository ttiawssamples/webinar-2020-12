import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { onCreateSensorValue } from "../../graphql/subscriptions";
import { GetSensor } from "../../api/Sensors";
import NumericWidget, {
  WIDGET_MODE,
} from "../../components/NumericWidget/NumericWidget";
import LineChartWidget from "../../components/LineChartWidget/LineChartWidget";

const useStyles = makeStyles(() => ({
  dashboardContainer: {
    marginTop: 100,
  },
  title: {
    marginBottom: 20,
    minHeight: 30,
  },
}));

interface ISensorSubscriptionResponse {
  value: {
    data: {
      onCreateSensorValue: {
        name: string;
        humidity: number;
        temperature: number;
        pressure: number;
        luminosity: number;
      };
    };
  };
}

const SensorPage: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [name, setName] = useState("Fetching sensor data...");
  const [humidity, setHumidity] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);
  const [luminosity, setLuminosity] = useState<number | null>(null);
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);

  //fetch sensor to get name
  useEffect(() => {
    setReadyToSubscribe(false);

    const initSensor = async () => {
      console.log("fetching sensor");

      try {
        const response = await GetSensor(id || "");

        if (response) {
          setName(response.name);
          console.log("sensor retrived");
          setReadyToSubscribe(true);
        }
      } catch (error) {
        console.log("error fetching sensor", error);
      }
    };

    initSensor();
  }, [id]);

  //subscribe to changes to the sensor's value
  useEffect(() => {
    if (readyToSubscribe) {
      console.log("start subscription to sensor");

      const subscriber = API.graphql(
        graphqlOperation(onCreateSensorValue, { sensorId: id })
      ).subscribe({
        next: (response: ISensorSubscriptionResponse) => {
          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setHumidity(response.value.data.onCreateSensorValue.humidity);
            setTemperature(response.value.data.onCreateSensorValue.temperature);
            setPressure(response.value.data.onCreateSensorValue.pressure);
            setLuminosity(response.value.data.onCreateSensorValue.luminosity);

            console.log("sensor value received");
          }
        },
        error: (error: any) => {
          console.log("error on sensor subscription", error);
        },
      });

      return () => {
        console.log("terminating subscription to sensor");
        subscriber.unsubscribe();
      };
    }
  }, [id, readyToSubscribe]);

  return (
    <Container className={classes.dashboardContainer} maxWidth="lg">
      <div className={classes.title}>
        <Typography variant="h5" align="left">
          {name}
        </Typography>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
        <NumericWidget
          mode={WIDGET_MODE.CURRENT}
          title="Temperature"
          value={temperature}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="Humidity"
            value={humidity}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="Barometric Pressure"
            value={pressure}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <NumericWidget
            mode={WIDGET_MODE.CURRENT}
            title="Luminosity"
            value={luminosity}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <LineChartWidget title="Temperature" value={temperature} />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          <NumericWidget
            mode={WIDGET_MODE.MAX}
            title="Max Temp"
            value={temperature}
          />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
          <NumericWidget
            mode={WIDGET_MODE.MIN}
            title="Min Temp"
            value={temperature}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <LineChartWidget title="Humidity" value={humidity} />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MAX}
              title="Max Humidity"
              value={humidity}
            />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MIN}
              title="Min Humidity"
              value={humidity}
            />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <LineChartWidget title="Barometric Pressure" value={pressure} />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MAX}
              title="Max Pressure"
              value={pressure}
            />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MIN}
              title="Min Pressure"
              value={pressure}
            />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
          <LineChartWidget title="Luminosity" value={luminosity} />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MAX}
              title="Max Luminosity"
              value={luminosity}
            />
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <NumericWidget
              mode={WIDGET_MODE.MIN}
              title="Min Luminosity"
              value={luminosity}
            />
        </Grid>
      </Grid>

    </Container>
  );
};

export default SensorPage;

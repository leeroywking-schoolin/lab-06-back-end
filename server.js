'use strict'

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT;

app.get('/testing', (request, response) => {
    console.log('found the testing route')
    response.send('<h1>HELLO WORLD...</h1>')
  });

app.get('/location', (request, response) => {
    try {
        const locationData = searchToLatLong(request.query.data);
        response.send(locationData);
    }
    catch (error) {
        console.error(error);
        response.status(500).send('Status: 500. So sorry, something went wrong.');
    }
});

app.get('/weather', (request, response) => {
    try {
        let weatherData = searchWeatherData(request.query.data);
        // console.log(searchWeatherData(request.query.data.time));
        // console.log(weatherData);
        response.send(weatherData);
    }
    catch (error) {
        console.log(error);
        response.status(500).send('Status: 500. So sorry, something went wrong.');
    }
})



app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


const searchToLatLong = (query) => {
    const geoData = require('./data/geo.json');
    const location = new Location(geoData);
    // console.log(location);
    return location;
}

function Location(data){
    this.formatted_query = data.results[0].formatted_address;
    this.latitude = data.results[0].geometry.location.lat;
    this.longitude = data.results[0].geometry.location.lng;
}

const searchWeatherData = (query) => {
    const weatherData = require('./data/darksky.json');
    let weatherArray = weatherData.daily.data;
    let resultArray = [];
    weatherArray.forEach(element => resultArray.push(new Weather(element)));

    // const weather = new Weather(weatherData);
    // console.log(weather);

    return resultArray;
}

function Weather(data){
    this.forecast = data.summary;
    this.time = new Date(data.time * 1000);
}
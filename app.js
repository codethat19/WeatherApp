//jshint esversion: 6
require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser  = require('body-parser');
const ejs = require("ejs");
const _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {city: "", description: "", imgURL: "", temper1: "", humid: "", press: ""});
});

app.post ("/", (req, res) => {

  const query=req.body.cityName;
  // const apiKey = "022fc7cb9f5532df178609c3308f8f96";
  const unit= "metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + process.env.APIKEY;
  const capitalCity = _.startCase(query);

  https.get(url, (response) => {
    //console.log(response.statusCode);
      if (response.statusCode >= 200 && response.statusCode < 300) {

        response.on("data", (data) => {

          const weatherData = JSON.parse(data);
          var temp=weatherData.main.temp;
          var weatherDescription = weatherData.weather[0].description;
          const iconURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
          const humidity = weatherData.main.humidity;
          const pressure = weatherData.main.pressure;

          res.render("home", {city: capitalCity, description: weatherDescription, imgURL: iconURL, temper1: temp, humid: humidity, press: pressure});
        });
      } else {
        res.render("home", {city: "Incorrect City", description: "", imgURL: "", temper1: "", humid: "", press: ""});
      }

  });
});

app.listen(process.env.PORT || port, () => {
  console.log("Server is running on port: " + port);
});

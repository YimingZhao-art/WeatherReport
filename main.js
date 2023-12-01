let hko_current_weather_report_api =
  // "data/weather.Oct7.json";
  "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
let nineday_forecast_api =
  "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en";
let weather_station_api =
  "https://ogciopsi.blob.core.windows.net/dataset/weather-station/weather-station-info.json";
let aqhi_api = "https://dashboard.data.gov.hk/api/aqhi-individual?format=json"; //aqhi, station
let aqhi_station_info_api = "data/aqhi-station-info.json"; //station and its lat and long
let eg_reverse_geocoding_api =
  "https://nominatim.openstreetmap.org/reverse?format=json&lat=22.28408&lon=114.13790&zoom=18&addressdetails=1";

let psrhigh_url = "https://www.hko.gov.hk/common/images/PSRHigh_50_light.png";
let psrmed_high_url =
  "https://www.hko.gov.hk/common/images/PSRMediumHigh_50_light.png";
let psrmed_url = "https://www.hko.gov.hk/common/images/PSRMedium_50_light.png";
let psrmed_low_url =
  "https://www.hko.gov.hk/common/images/PSRMediumLow_50_light.png";
let psrlow_url = "https://www.hko.gov.hk/common/images/PSRLow_50_light.png";

/*
Current weather icon  WR.icon[0] //show the first one
Current temperature  WR.temperature.data[1].value //Hong Kong Observatory
Current humidity WR.humidity.data[0].value //show the first one
Current rainfall  WR.rainfall.data[13].max //Yau Tsim Mong
Current UV index  WR.uvindex.data[0].value //could be missing //show the first one
Current warning WR.warningMessage[ ] //could be missing //show all warning messages
Last update WR.updateTime 
District Temperatures WR.temperature.data[0..N] //N could be changing from time to time
Temp. of each district WR.temperature.data[i].place, WR.temperature.data[i].value
*/

/**
9-Day Forecast WF.weatherForecast[0..8]
Forecast icon WF.weatherForecast[i].ForecastIcon
Forecast date WF.weatherForecast[i].forecastDate
Forecast week  WF.weatherForecast[i].week
Forecast temperatures WF.weatherForecast[i].forecastMintemp, WF.weatherForecast[i].forecastMaxtemp
Forecast humidity WF.weatherForecast[i].forecastminrh, WF.weatherForecast[i].forecastmaxrh
PSR (Probability of Significant Rain)  WF.weatherForecast[i].PSR
*/

var f0 = function () {
  document.body.innerHTML = `<h1>My Weather Portal</h1>
  <div id="current-info-container">
    <div id="header-block" class="block">
      <h2>Hong Kong</h2>
      <div id="current-weather">
        <div class="weather-detail">
          <div id="weather-icon">
            <img src="./images/pic62.png" alt="Weather Icon" id="weather-img"/>
          </div>
          <div id="temperature" class="number-info">
            <div class="info-value">28</div>
            <sup><a style="font-size: 0.25em">°C</a></sup>
          </div>
          <div id="humidity" class="number-info">
            <div class="info-value">72</div>
            <div class="info-unit">
              <img
                id="humidity-icon"
                src="./images/drop-64.png"
                alt="Humidity Icon"
              />
              %
            </div>
          </div>
          <div id="rainfall" class="number-info">
            <div class="info-value">0</div>
            <div class="info-unit">
              <img
                id="rainfall-icon"
                src="./images/rain-48.png"
                alt="Rainfall Icon"
              />
              mm
            </div>
          </div>
        </div>
        <div class="weather-detail">
          <div id="uv-level" class="number-info">
            <div class="info-value" id="uv-level-value">0.6</div>
            <div class="info-unit">
              <img
                id="uv-icon"
                src="./images/UVindex-48.png"
                alt="UV Index Icon"
              />
              <br />
            </div>
          </div>
        </div>
      </div>

      <!--  a hidden to store the warning message -->
      <div id="warning-container">
        <button id="toggle-warning">Warnings</button>
        <a id="warning-message" hidden>No warnings </a>
      </div>
      <div id="last-update">Last update: 09:02</div>
    </div>

    <div id="my-data-block" class="block">
      <h2>My Location</h2>
      <div id="current-location">
        <div id="suburb" style="margin-right: 5px">Loading...</div>
        <div id="district"></div>
      </div>

      <div id="my-weather">
        <div class="weather-detail">
          <div id="my-temperature" class="number-info">
            <div class="info-value"></div>
            <sup><a style="font-size: 0.25em">°C</a></sup>
          </div>
          <div id="my-rainfall" class="number-info">
            <div class="info-value"></div>
            <div class="info-unit">
              <img
                id="my-rainfall-icon"
                src="./images/rain-48.png"
                alt="Rainfall Icon"
              />
              mm
            </div>
          </div>
          <div id="my-aqhi" class="number-info">
            <img
              id="my-aqhi-icon"
              src="./images/aqhi-low.png"
              alt="Air Quality Icon"
            />
            <div class="info-unit">
              <a id="aqhi-number"></a>

              <a id="aqhi-quality"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="location-container">
    <div id="target-location-block-1" class="block-target-location-block">
      <h2>Temperatures</h2>
      <a class="block2-a">Select the location</a>
      <br />
      <div class="location-content">
        <div class="select-container">
          <select id="location-select-1" class="location-select">
            <!-- Location options here -->
          </select>
        </div>
        <div id="target-weather-1" class="target-weather">
          <!-- Target location's weather details here -->
        </div>
      </div>
    </div>

    <div id="target-location-block-2" class="block-target-location-block">
      <h2>Rainfall</h2>
      <a class="block2-a">Select the district</a>
      <br />
      <div class="location-content">
        <div class="select-container">
          <select id="location-select-2" class="location-select">
            <!-- Location options here -->
          </select>
        </div>
        <div id="target-weather-2" class="target-weather">
          <!-- Target location's weather details here -->
        </div>
      </div>
    </div>

    <div id="target-location-block-3" class="block-target-location-block">
      <h2>Air Quality</h2>
      <a class="block2-a">Select the AQ station</a>
      <br />
      <div class="location-content">
        <div class="select-container">
          <select id="location-select-3" class="location-select">
            <!-- Location options here -->
          </select>
        </div>
        <div id="target-weather-3" class="target-weather">
          <!-- Target location's weather details here -->
          <div id="selected-location-ahqi"></div>
          <div id="selected-location-ahqi-level"></div>
        </div>
      </div>
    </div>
  </div>

  <div id="forecast-block" class="block">
    <h2>9-Day Forecast</h2>

    <div id="forecast-day">
      <div class="day-data-container">
        <div class="day-date" id="day-date-1">Fri 1/9</div>
        <div class="day-weather-icon" id="day-weather-icon-1">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-1">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-1">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-1">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-2">Sat 1/10</div>
        <div class="day-weather-icon" id="day-weather-icon-2">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-2">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-2">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-2">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-3">Sun 1/11</div>
        <div class="day-weather-icon" id="day-weather-icon-3">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-3">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-3">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-3">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-4">Mon 1/12</div>
        <div class="day-weather-icon" id="day-weather-icon-4">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-4">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-4">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-4">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-5">Tue 1/13</div>
        <div class="day-weather-icon" id="day-weather-icon-5">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-5">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-5">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-5">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-6">Wed 1/14</div>
        <div class="day-weather-icon" id="day-weather-icon-6">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-6">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-6">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-6">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-7">Thu 1/15</div>
        <div class="day-weather-icon" id="day-weather-icon-7">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-7">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-7">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-7">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-8">Fri 1/16</div>
        <div class="day-weather-icon" id="day-weather-icon-8">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-8">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-8">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-8">
          70-95 %
        </div>
      </div>

      <div class="day-data-container">
        <div class="day-date" id="day-date-9">Sat 1/17</div>
        <div class="day-weather-icon" id="day-weather-icon-9">
          <img
            src="./images/pic62.png"
            alt="Weather Icon"
            class="nineday-weather-icon"
          />
        </div>
        <div class="day-weather-psr-icon" id="day-weather-psr-icon-9">
          <img
            src="./images/PSRLow_50_light.png"
            alt="PSR Icon"
            class="nineday-weather-psr-icon"
          />
        </div>
        <div class="day-temperature-range" id="day-temperature-range-9">
          26-30 °C
        </div>
        <div class="day-humidity-range" id="day-humidity-range-9">
          70-95 %
        </div>
      </div>
    </div>
  </div>
`;
};

var f1 = function () {
  fetch(hko_current_weather_report_api)
    .then(function (response) {
      WR = response.json();
      return WR;
    })
    .then(function (WR) {
      current_weather_icon = WR.icon[0];
      // console.log(current_weather_icon);
      current_temperature = WR.temperature.data[1].value;
      current_humidity = WR.humidity.data[0].value;
      current_rainfall = WR.rainfall.data[13].max;
      try {
        current_uvindex = WR.uvindex.data[0].value;
        
      } catch (error) {
        current_uvindex = "0";
        
      }
      try {
        current_warning = WR.warningMessage || "No warning";
      } catch (error) {
        current_warning = "No warning";
      }
      if (current_warning == "No warning") {
        document.getElementById("toggle-warning").hidden = true;
      }
      else {
        document.getElementById("toggle-warning").hidden = false;
      }

      current_updateTime = WR.updateTime;
      district_temperatures = WR.temperature.data;
      rainfall = WR.rainfall.data;

      /* --- set image --- */
      document.getElementById("weather-img").src =
        "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" +
        current_weather_icon +
        ".png";

      /* --- set text --- */
      /**
     * <div id="temperature" class="number-info">
              <div class="info-value">28</div>
              <a style="font-size: 0.25em">°C</a><br />
            </div>
     */
      document.getElementById("temperature").innerHTML =
        '<div class="info-value">' +
        current_temperature +
        '</div><div class="info-unit"><sup><a>°C</a></sup></div>';

      document.getElementById("humidity").innerHTML =
        '<div class="info-value">' +
        current_humidity +
        '</div><div class="info-unit"><img id="humidity-icon" src="./images/drop-64.png" alt="Humidity Icon"/>%</div>';
      document.getElementById("rainfall").innerHTML =
        '<div class="info-value">' +
        current_rainfall +
        '</div><div class="info-unit"><img id="rainfall-icon" src="./images/rain-48.png" alt="Rainfall Icon"/>mm</div>';
      document.getElementById("uv-level").innerHTML =
        '<div class="info-value" id="uv-level-value">' +
        current_uvindex +
        '</div><div class="info-unit"><img id="uv-icon" src="./images/UVindex-48.png" alt="UV Index Icon"/><br /></div>';
      document.getElementById("warning-message").innerHTML = current_warning;
      //2023-10-11T15:02:00+08:00, only need hh:mm
      document.getElementById("last-update").innerHTML =
        "Last update: " + current_updateTime.slice(11, 16);

      /* --- set background image --- */
      // change the background image of  <div id="header-block" class="block"> according to the current weather and day/night
      var d = new Date(current_updateTime);
      var n = d.getHours();
      var background_image;
      if (n >= 6 && n <= 18) {
        //set uv-icon and uv-level to visible
        document.getElementById("uv-level").style.display = "flex";
        // document.getElementById("uv-level-value").style.display = "block";
        // console.log("uv-icon visibility: " + document.getElementById("uv-icon").visibility);
        if (current_weather_icon >= 62 && current_weather_icon <= 65) {
          //day rain
          //images/water-drops-glass-day.jpg
          background_image = "url('./images/water-drops-glass-day.jpg')";
        } else {
          //images/blue-sky.jpg
          background_image = "url('./images/blue-sky.jpg')";
        }
      } else {
        //set uv-icon and uv-level to not visible
        // document.getElementById("uv-icon").style.display = "none";
        document.getElementById("uv-level").style.display = "none";
        // console.log("uv-icon visibility: " + document.getElementById("uv-icon").visibility);
        if (current_weather_icon >= 62 && current_weather_icon <= 65) {
          //night rain
          //images/water-drops-glass-night.jpg
          background_image = "url('./images/water-drops-glass-night.jpg')";
        } else {
          //images/night-sky.jpg
          background_image = "url('./images/night-sky.jpg')";
        }
        //   set font in header-block and its children to white
        document.getElementById("header-block").style.color = "white";
      }

      document.getElementById("header-block").style.backgroundImage =
        background_image;

      /* --- set current location --- */
      // get current location by HTML5 Geolocation API
      var lat, long;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          // console.log(lat, long);
          fetch(
            "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
              lat +
              "&lon=" +
              long +
              "&zoom=18&addressdetails=1&accept-language=en"
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              // console.log(data);
              var suburb_name, district_name;
              if (data.address.suburb) {
                suburb_name = data.address.suburb;
              } else if (data.address.borough) {
                suburb_name = data.address.borough;
              } else if (data.address.town) {
                suburb_name = data.address.town;
              } else {
                suburb_name = "Unknown";
              }
              if (data.address.city_district) {
                district_name = data.address.city_district;
              } else {
                var i;
                for (i = 0; i < Object.keys(data.address).length; i++) {
                  if (Object.values(data.address)[i].includes("District")) {
                    district_name = Object.values(data.address)[i];
                    break;
                  }
                }
                if (i == Object.keys(data.address).length) {
                  district_name = "Unknown";
                }
              }
              document.getElementById("suburb").innerHTML =
                suburb_name + ", <br />";
              document.getElementById("district").innerHTML = district_name;

              //Use the returned district information, we retrieve the rainfall data of your district from the HKO Current Weather report.
              var i;
              /* the response json is like  {"unit":"mm","place":"Eastern District","max":0,"main":"FALSE"}
            it is in WR.rainfall.data[i]
            find current district in WR.rainfall.data[i].place noticed and is & in the json
            */
              for (i = 0; i < WR.rainfall.data.length; i++) {
                var str1 = WR.rainfall.data[i].place.toLowerCase();
                var str2 = district_name.toLowerCase();
                // delete "and" or "&" in the string
                str1 = str1.replace("and", "").replace("&", "");
                str2 = str2.replace("and", "").replace("&", "");
                if (str1.includes(str2)) {
                  break;
                }
              }
              document.getElementById("my-rainfall").innerHTML =
                '<div class="info-value">' +
                WR.rainfall.data[i].max +
                '</div><div class="info-unit"><img id="my-rainfall-icon" src="./images/rain-48.png" alt="Rainfall Icon"/>mm</div>';

              /**
             * To get the temperature data and AQHI data of your location, we make use of your current position data to find the nearby weather station and air quality monitoring station. We can base on the ‘Equirectangular approximation’ formula to calculate the approximate distance between your current position with a weather/air quality station. You can find more information at https://www.movable- type.co.uk/scripts/latlong.html#equirectangular. And here is the JavaScript excerpted from this Website:
             *
             * Based on the list of places in the temperature dataset, we look up their latitude_longitude coordinates via the OGCIO Weather Station Information API. Use the above Equirectangular approximation formula, we find out which place in the temperature dataset is near to your current location and we set this as the temperature of your current location. We use the same mechanism to locate a nearby air quality monitoring station and use this station location to retrieve the AQHI and Health Risk level from the OGCIO Air Quality Health Index API.
                For example, we set the device location to Heng On Estate, Ma On Shan (Latitude: 22.4176519698°, Longitude: 114.2279348°). Using the Nominatim search engine for OpenStreetMap, it identifies the location as
             */
              fetch(weather_station_api)
                .then(function (response) {
                  return response.json();
                })
                .then(function (data) {
                  const R = 6371e3; // metres
                  var min_distance = Infinity;
                  var nearest_weather_station = "";
                  for (i = 0; i < data.length; i++) {
                    var φ1 = (lat * Math.PI) / 180; // φ, λ in radians
                    var φ2 = (data[i].latitude * Math.PI) / 180;
                    var Δφ = ((data[i].latitude - lat) * Math.PI) / 180;
                    var Δλ = ((data[i].longitude - long) * Math.PI) / 180;

                    var a =
                      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                      Math.cos(φ1) *
                        Math.cos(φ2) *
                        Math.sin(Δλ / 2) *
                        Math.sin(Δλ / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                    var d = R * c; // in metres
                    if (d < min_distance) {
                      min_distance = d;
                      var nearest_weather_station = data[i].station_name_en;
                    }
                  }
                  // console.log("Result: " + nearest_weather_station);
                  // find the nearest_weather_station in WR.temperature.data[i].place
                  for (i = 0; i < WR.temperature.data.length; i++) {
                    if (
                      WR.temperature.data[i].place.includes(
                        nearest_weather_station
                      )
                    ) {
                      document.getElementById("my-temperature").innerHTML =
                        '<div class="info-value">' +
                        WR.temperature.data[i].value +
                        "</div><sup><a>°C</a></sup></div>";

                      // console.log(WR.temperature.data[i].value);
                      break;
                    }
                  }
                });

              fetch(aqhi_station_info_api)
                .then(function (response) {
                  return response.json();
                })
                .then(function (data) {
                  // console.log(data);

                  const R = 6371e3; // metres
                  var min_distance = Infinity;
                  var nearest_aqhi_station = "";
                  for (i = 0; i < data.length; i++) {
                    var φ1 = (lat * Math.PI) / 180; // φ, λ in radians
                    var φ2 = (data[i].lat * Math.PI) / 180;
                    var Δφ = ((data[i].lat - lat) * Math.PI) / 180;
                    var Δλ = ((data[i].lng - long) * Math.PI) / 180;

                    var a =
                      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                      Math.cos(φ1) *
                        Math.cos(φ2) *
                        Math.sin(Δλ / 2) *
                        Math.sin(Δλ / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                    var d = R * c; // in metres
                    if (d < min_distance) {
                      min_distance = d;
                      var nearest_aqhi_station = data[i].station;
                    }
                  }
                  // console.log("Result2: " + nearest_aqhi_station);
                  // find the nearest_aqhi_station in aqhi_api
                  fetch(aqhi_api)
                    .then(function (response) {
                      return response.json();
                    })
                    .then(function (data) {
                      // console.log(data);
                      //find the respective station
                      var i;
                      for (i = 0; i < data.length; i++) {
                        if (data[i].station == nearest_aqhi_station) {
                          document.getElementById("aqhi-number").innerHTML =
                            data[i].aqhi;
                          document.getElementById("aqhi-quality").innerHTML =
                            data[i].health_risk;
                          document.getElementById("my-aqhi-icon").src =
                            "./images/aqhi-" +
                            data[i].health_risk.toLowerCase() +
                            ".png";
                          // console.log(data[i].aqhi);
                          break;
                        }
                      }

                      var i;
                      aqhi_station_list = [];
                      for (i = 0; i < data.length; i++) {
                        aqhi_station_list.push(data[i].station);
                      }
                      // sort the place_list
                      aqhi_station_list.sort();
                      for (i = 0; i < data.length; i++) {
                        var option = document.createElement("option");
                        option.text = aqhi_station_list[i];
                        document
                          .getElementById("location-select-3")
                          .add(option);
                      }
                      //set no one selected
                      document.getElementById(
                        "location-select-3"
                      ).selectedIndex = -1;
                      // add event listener to <select> element
                      document
                        .getElementById("location-select-3")
                        .addEventListener("change", () => {
                          station =
                            document.getElementById("location-select-3").value;

                          var i;
                          for (i = 0; i < data.length; i++) {
                            if (data[i].station == station) {
                              var ahqi_text = data[i].aqhi;
                              var health_risk_text = data[i].health_risk;

                              document.getElementById(
                                "selected-location-ahqi"
                              ).innerHTML = "Level: " + ahqi_text;
                              document.getElementById(
                                "selected-location-ahqi"
                              ).style.color = "black";

                              document.getElementById(
                                "selected-location-ahqi-level"
                              ).innerHTML = "Risk: " + health_risk_text;
                              document.getElementById(
                                "selected-location-ahqi-level"
                              ).style.color = "black";

                              break;
                            }
                          }
                        });
                    });
                });
            });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      /* --- set 3 blocks --- */
      // get the list of places in the temperature dataset and populate the <select> element
      var i;
      place_list = [];
      for (i = 0; i < district_temperatures.length; i++) {
        place_list.push(district_temperatures[i].place);
      }
      // sort the place_list
      place_list.sort();
      for (i = 0; i < district_temperatures.length; i++) {
        var option = document.createElement("option");
        option.text = place_list[i];
        document.getElementById("location-select-1").add(option);
      }
      //set no one selected
      document.getElementById("location-select-1").selectedIndex = -1;
      // add event listener to <select> element
      document
        .getElementById("location-select-1")
        .addEventListener("change", () => {
          var place = document.getElementById("location-select-1").value;
          /**
         * <div id="selected-location-temp" class="select-num-info">
            28<sup><a style="font-size: 0.25em">°C</a></sup>
          </div>
         */
          document.getElementById("target-weather-1").innerHTML =
            '<div id="selected-location-temp" class="select-num-info">' +
            district_temperatures.find((x) => x.place === place).value +
            '<sup><a style="font-size: 0.5em">°C</a></sup></div>';
          document.getElementById("target-weather-1").style.color = "black";
        });

      //get the district list and rainfall data, then populate the <select> element
      var district_list = [];
      for (i = 0; i < rainfall.length; i++) {
        district_list.push(rainfall[i].place);
      }
      district_list.sort();
      for (i = 0; i < rainfall.length; i++) {
        var option = document.createElement("option");
        option.text = district_list[i];
        document.getElementById("location-select-2").add(option);
      }
      //set no one selected
      document.getElementById("location-select-2").selectedIndex = -1;
      // add event listener to <select> element
      document
        .getElementById("location-select-2")
        .addEventListener("change", () => {
          var district = document.getElementById("location-select-2").value;
          document.getElementById("target-weather-2").innerHTML =
            '<div id="selected-location-rainfall" class="select-num-info">' +
            rainfall.find((x) => x.place === district).max +
            '<sub><a style="font-size: 0.25em">mm</a></sub></div>';
          document.getElementById("target-weather-2").style.color = "black";
        });
    });
};

var f2 = function () {
  fetch(nineday_forecast_api)
    .then(function (response) {
      WF = response.json();
      return WF;
    })
    .then(function (WF) {
      forecast = WF.weatherForecast;
    })
    .then(function () {
      var i;
      var nineday_weather_icons = document.getElementsByClassName(
        "nineday-weather-icon"
      );
      var nineday_weather_psr_icons = document.getElementsByClassName(
        "nineday-weather-psr-icon"
      );
      for (i = 0; i < forecast.length; i++) {
        var day_date =
          forecast[i].week.slice(0, 3) +
          " " +
          forecast[i].forecastDate.slice(4, 6) +
          "/" +
          forecast[i].forecastDate.slice(6, 8);
        document.getElementById("day-date-" + (i + 1)).innerHTML = day_date;

        //set weather icon
        nineday_weather_icons[i].src =
          "https://www.hko.gov.hk/images/HKOWxIconOutline/pic" +
          forecast[i].ForecastIcon +
          ".png";

        document.getElementById("day-temperature-range-" + (i + 1)).innerHTML =
          forecast[i].forecastMintemp["value"] +
          "-" +
          forecast[i].forecastMaxtemp["value"] +
          " °C";
        document.getElementById("day-humidity-range-" + (i + 1)).innerHTML =
          forecast[i].forecastMinrh["value"] +
          "-" +
          forecast[i].forecastMaxrh["value"] +
          " %";
        var used_psr_url;
        switch (forecast[i].PSR.toLowerCase()) {
          case "low":
            used_psr_url = psrlow_url;
            break;
          case "medium low":
            used_psr_url = psrmed_low_url;
            break;
          case "medium":
            used_psr_url = psrmed_url;
            break;
          case "medium high":
            used_psr_url = psrmed_high_url;
            break;
          case "high":
            used_psr_url = psrhigh_url;
            break;
        }

        nineday_weather_psr_icons[i].src = used_psr_url;
      }
    });
};

var f3 = function () {
  var btn = document.getElementById("toggle-warning");
  var click_status = 0;
  btn.addEventListener("click", function () {
    let text = document.getElementById("warning-message");
    if (click_status == 0) {
      text.style.fontSize = "10px";
      text.hidden = false;
      text.style.flex = 1; //occupy one
      btn.style.flexGrow = "0"; //make the button not grow
      btn.style.flex = 1; //occupy one
      click_status = 1;
    } else {
      btn.innerHTML = "Warnings";
      btn.style.fontSize = "1em";
      text.hidden = true;
      text.style.flex = 0; //occupy zero
      btn.style.flexGrow = "1"; //make the button grow

      click_status = 0;
    }
  });
};

var f4 = function () {
  clickHandler = function () {
    // 如果当前元素是展开的，就将它收起来
    // console.log("run clickHandler");
    if (this.dataset.expanded === "true") {
      let aTags = this.getElementsByTagName("a");
      for (let j = 0; j < aTags.length; j++) {
        aTags[j].style.visibility = "hidden";
      }

      let target = this.getElementsByClassName("target-weather");
      for (let j = 0; j < target.length; j++) {
        target[j].style.visibility = "hidden";
      }

      select = this.getElementsByClassName("location-select");
      for (i = 0; i < select.length; i++) {
        select[i].style.visibility = "hidden";
      }

      let location_container = this.getElementsByClassName("location-content");
      location_container[0].style.display = "none";

      this.dataset.expanded = "false";
    } else {
      // 首先将所有元素收起来
      for (let j = 0; j < elements.length; j++) {
        let aTags = elements[j].getElementsByTagName("a");
        for (let k = 0; k < aTags.length; k++) {
          aTags[k].style.visibility = "hidden";
        }

        let target = elements[j].getElementsByClassName("target-weather");
        for (let k = 0; k < target.length; k++) {
          target[k].style.visibility = "hidden";
        }
        select = elements[j].getElementsByClassName("location-select");
        target = elements[j].getElementsByClassName("target-weather");
        for (i = 0; i < select.length; i++) {
          select[i].style.visibility = "hidden";
        }
        for (i = 0; i < target.length; i++) {
          target[i].style.visibility = "hidden";
        }
        let location_container =
          elements[j].getElementsByClassName("location-content");
        location_container[0].style.display = "none";
        elements[j].dataset.expanded = "false";
      }

      // 然后将当前元素展开
      let aTags = this.getElementsByTagName("a");
      for (let j = 0; j < aTags.length; j++) {
        aTags[j].style.visibility = "visible";
      }

      let target = this.getElementsByClassName("target-weather");
      for (let j = 0; j < target.length; j++) {
        target[j].style.visibility = "visible";

        // if it is the first block, set the target-weather-1 to be the same as the selected location
        switch (target[j].id) {
          case "target-weather-1":
            if (
              document.getElementById("location-select-1").selectedIndex != -1
            ) {
              target[j].style.color = "black";
              break;
            }
            //if no one is selected, set the first one to be the same as the current location to occupy the space
            target[j].innerHTML =
              '<div id="selected-location-temp" class="select-num-info">' +
              district_temperatures[0].value +
              '<sup><a style="font-size: 0.5em">°C</a></sup></div>';
            //set color of this selected-location-temp to be same as background color of this block (this help we occupy the space without showing the text)
            target[j].style.color = "#f3ffff";
            console.log(target[j].style.color);
            break;
          case "target-weather-2":
            if (
              document.getElementById("location-select-2").selectedIndex != -1
            ) {
              target[j].style.color = "black";
              break;
            }
            target[j].innerHTML =
              '<div id="selected-location-rainfall" class="select-num-info">' +
              rainfall[0].max +
              '<sub><a style="font-size: 0.25em">mm</a></sub></div>';
            target[j].style.color = "#fdf8e8";
            break;
          case "target-weather-3":
            if (
              document.getElementById("location-select-3").selectedIndex != -1
            ) {
              target[j].style.color = "black";
              break;
            }
            document.getElementById("selected-location-ahqi").innerHTML =
              "Level: ";
            document.getElementById("selected-location-ahqi-level").innerHTML =
              "Risk: ";
            target[j].style.color = "#dfdfe1";
            break;
        }
      }

      select = this.getElementsByClassName("location-select");
      for (i = 0; i < select.length; i++) {
        select[i].style.visibility = "visible";
      }

      let location_container = this.getElementsByClassName("location-content");
      location_container[0].style.display = "block";
      this.dataset.expanded = "true";
    }
  };

  function debounce(func, wait) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  function addHandlers(elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].dataset.expanded = "false";
      elements[i].addEventListener("click", clickHandler);
    }
  }

  function removeHandlers(elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].dataset.expanded = "false";
      elements[i].removeEventListener("click", clickHandler);
    }
  }

  var clickSelectHandler = function (event) {
    event.stopPropagation();
  };

  window.addEventListener(
    "resize",
    debounce(function () {
      var width = window.innerWidth;
      var rainfall = document.getElementById("rainfall");
      var uvLevel = document.getElementById("uv-level");
      var firstDetailContainer =
        document.getElementsByClassName("weather-detail")[0];
      var secondDetailContainer =
        document.getElementsByClassName("weather-detail")[1];
      elements = Array.from(
        document.getElementsByClassName("block-target-location-block")
      );
      var select = document.getElementsByClassName("location-select");
      var target = document.getElementsByClassName("target-weather");
      var selects = document.getElementsByTagName("select");
      if (width < 600) {
        // console.log("width < 600");
        // 如果窗口宽度小于500px，将rainfall移动到uv-level前面
        if (!secondDetailContainer.contains(rainfall)) {
          secondDetailContainer.insertBefore(rainfall, uvLevel);
        }

        // set elements in the 3 blocks to be hidden except the h2 element
        // set select element to be invisible

        for (i = 0; i < select.length; i++) {
          select[i].style.visibility = "hidden";
          //set font of dropdown list to be larger
          select[i].style.fontSize = "4em";
        }

        for (i = 0; i < target.length; i++) {
          target[i].style.visibility = "hidden";
        }

        for (let i = 0; i < elements.length; i++) {
          let aTags = elements[i].getElementsByTagName("a");
          for (let j = 0; j < aTags.length; j++) {
            aTags[j].style.visibility = "hidden"; // 设置a标签为不可见
          }

          let h2Tags = elements[i].getElementsByTagName("h2");
          for (let j = 0; j < h2Tags.length; j++) {
            h2Tags[j].style.fontSize = "3em"; // 设置h2标签的字体大小为2em
          }
        }

        for (let i = 0; i < selects.length; i++) {
          selects[i].addEventListener("click", clickSelectHandler);
        }

        for (let i = 0; i < elements.length; i++) {
          let location_container =
            elements[i].getElementsByClassName("location-content");
          location_container[0].style.display = "none";
        }

        addHandlers(elements);
      } else {
        // console.log("width >= 600");
        // 如果窗口宽度大于或等于500px，将rainfall移回第一个weather-detail容器中
        if (!firstDetailContainer.contains(rainfall)) {
          firstDetailContainer.appendChild(rainfall);
        }

        // set all elements to be visible again

        for (i = 0; i < select.length; i++) {
          select[i].style.visibility = "visible";
          // reset font size of dropdown list
          select[i].style.fontSize = "1em";
          select[i].removeEventListener("click", clickSelectHandler);
        }

        for (i = 0; i < target.length; i++) {
          target[i].style.visibility = "visible";
        }

        for (let i = 0; i < elements.length; i++) {
          let aTags = elements[i].getElementsByTagName("a");
          for (let j = 0; j < aTags.length; j++) {
            aTags[j].style.visibility = "visible"; // set a tag to be visible
          }

          let h2Tags = elements[i].getElementsByTagName("h2");
          for (let j = 0; j < h2Tags.length; j++) {
            h2Tags[j].style.fontSize = "2em"; // reset h2 tag font size
          }

          let location_container =
            elements[i].getElementsByClassName("location-content");
          location_container[0].style.display = "block";
        }

        removeHandlers(elements);
      }
    }, 250)
  );

  window.addEventListener("load", function () {
    // 触发一次resize事件，以便在页面加载时设置正确的元素位置
    window.dispatchEvent(new Event("resize"));
  });
};

document.addEventListener("DOMContentLoaded", (event) => {
  f0();
  f1();
  f2();
  f3();
  f4();
});

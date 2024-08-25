import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

function Weather() {
  const [weather, setWeather] = useState({});
  const [weatherForecastData, setWeatherForecastData] = useState({});
  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/realtime?location=Panchpatmali&apikey=${process.env.REACT_APP_WEATHER_API_KEY_2}`
        );
        setWeather(response.data);
        // console.log("aS");
      } catch (e) {
        // console.log(e);
      }
    };
    getWeather();
  }, []);
  useEffect(() => {
    const getWeatherForecast = async () => {
      try {
        const response = await axios.get(
          `https://api.tomorrow.io/v4/timelines?location=Panchpatmali&fields=temperature&timesteps=1h&units=metric&apikey=${process.env.REACT_APP_WEATHER_API_KEY_2}`
        );
        setWeatherForecastData(response.data);
      } catch (e) {
        // console.log(e);
      }
    };
    getWeatherForecast();
  }, []);
  const getTime = useCallback((timestamp) => {
    const dateObject = new Date(timestamp);

    // Get the hours, minutes, and seconds
    const hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();

    return `${hours}:${minutes}`;
  }, []);

  const getDate = useCallback((timestamp) => {
    const dateObject = new Date(timestamp);

    const date = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth();

    return `${date}/${month}`;
  }, []);

  // console.log(weatherForecastData);
  return (
    <div className="min-w-[20rem] max-w-[20rem] h-[24vh] overflow-y-scroll p-3 bg-slate-300 ">
      <div className=" bg-white overflow-x-hidden h-full overflow-y-scroll shadow-md rounded-lg">
        <div className="flex p-3 ">
          <div className="">
            <h4 className=" font-semibold text-4xl  w-full">
              {" "}
              {weather.data && weather.data.values.temperature}&deg; C
            </h4>
            <p className="text-sm mb-1 truncate w-[14rem]">
              {weather.location && weather.location.name}
            </p>
          </div>

          <div className="">
            {weather.current && (
              <div className="flex  justify-center items-center">
                <img
                  className="h-20 w-20 "
                  src={"http:" + weather.current.condition.icon}
                  alt=""
                />
                <span className="-ml-4 pr-4">Clear</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex px-3 mb-2 gap-2 overflow-x-scroll">
          {weatherForecastData.data &&
            weatherForecastData.data.timelines[0].intervals.map(
              (pinweather) => {
                return (
                  <div className="w-max  text-center bg-slate-400 p-2 rounded-xl">
                    <h3 className="font-bold ">
                      {pinweather.values.temperature}&deg;C
                    </h3>
                    <h6 className="text-sm  text-center text-slate-700 font-bold">
                      {getTime(pinweather.startTime)}
                    </h6>
                    <h6 className="text-sm  text-center text-slate-700 font-bold">
                      {getDate(pinweather.startTime)}
                    </h6>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
}

export default Weather;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsMoisture } from "react-icons/bs";
import { MdDewPoint } from "react-icons/md";
import { FaWind } from "react-icons/fa";
import { MdOutlineVisibility } from "react-icons/md";
import { WiNightAltRainWind } from "react-icons/wi";
import { WiDayWindy } from "react-icons/wi";
import { WiSnowWind } from "react-icons/wi";
import { CiSun } from "react-icons/ci";

function WeatherData() {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/realtime?location=Panchpatmali&apikey=${process.env.REACT_APP_WEATHER_API_KEY_2}`
        );
        setWeather(response.data);
      } catch (e) {
        // console.log(e);
      }
    };
    getWeather();
  }, []);

  // console.log(weather);
  return (
    <div className="min-w-[20rem] max-w-[20rem] h-[24vh] overflow-y-scroll p-3 bg-slate-300 ">
      <div className=" bg-white overflow-x-hidden h-full overflow-y-scroll shadow-md rounded-lg">
        <div className=" grid grid-cols-3 grid-rows-3">
          <div className="bg-slate-100 flex flex-col justify-center items-center">
            <h1>Humidity</h1>
            <WiSnowWind />
            <h4>{weather.data && weather.data.values.humidity}</h4>
          </div>
          <div className="bg-slate-200 flex flex-col justify-center items-center">
            <h1>DewPoint</h1>
            <MdDewPoint />
            <h4>{weather.data && weather.data.values.dewPoint}</h4>
          </div>
          <div className="bg-slate-100 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>Pressure Surface Level</h1>
            <h4>{weather.data && weather.data.values.pressureSurfaceLevel}</h4>
          </div>
          <div className="bg-slate-200 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>Rain Intensity</h1>
            <BsMoisture />
            <h4>{weather.data && weather.data.values.rainIntensity}</h4>
          </div>
          <div className="bg-slate-100 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>Visibility</h1>
            <MdOutlineVisibility />
            <h4>{weather.data && weather.data.values.visibility}</h4>
          </div>
          <div className="bg-slate-200 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>Wind Direction</h1>
            <FaWind />
            <h4>{weather.data && weather.data.values.windDirection}</h4>
          </div>
          <div className="bg-slate-100 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>wind Speed</h1>
            <WiDayWindy />
            <h4>{weather.data && weather.data.values.windSpeed}</h4>
          </div>
          <div className="bg-slate-200 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>Precipitation Probability</h1>
            <WiNightAltRainWind />
            <h4>
              {weather.data && weather.data.values.precipitationProbability}
            </h4>
          </div>
          <div className="bg-slate-100 flex flex-col text-center justify-center border-2 boeder-white h-full items-center  shadow-md ">
            <h1>UV Index</h1>
            <CiSun />
            <h4>{weather.data && weather.data.values.uvIndex}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherData;

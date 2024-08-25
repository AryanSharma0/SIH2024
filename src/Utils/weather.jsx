import axios from "axios";

export const wetherData = async (apiKey) => {
  console.log(apiKey);
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${
        process.env.REACT_APP_WEATHER_API_KEY || apiKey
      }&q=koraput&aqi=yes`
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const BASE =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
const API_KEY = "R3WWPPE8J2R8LQFWF2DZ922PJ"; // optional: paste your Visual Crossing key here if required

// Fetch raw weather data (metric units) for a location.
export async function fetchWeather(location) {
  const url =
    `${BASE}/${encodeURIComponent(location)}` +
    `?unitGroup=metric&contentType=json&include=days,current` +
    (API_KEY ? `&key=${API_KEY}` : "");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 400
        ? `Couldn't find "${location}". Try another search.`
        : `Weather service error (${response.status}).`
    );
  }
  return response.json();
}

// Reduce the API response to only what the app needs.
export function processWeather(data) {
  const c = data.currentConditions;
  return {
    place: data.resolvedAddress,
    description: data.description,
    current: {
      temp: c.temp,
      feelsLike: c.feelslike,
      humidity: c.humidity,
      wind: c.windspeed,
      conditions: c.conditions,
      icon: c.icon,
    },
    forecast: data.days.slice(1, 8).map((d) => ({
      date: d.datetime,
      high: d.tempmax,
      low: d.tempmin,
      icon: d.icon,
      conditions: d.conditions,
    })),
  };
}

export async function getWeather(location) {
  const data = await fetchWeather(location);
  const weather = processWeather(data);
  console.log(weather);
  return weather;
}

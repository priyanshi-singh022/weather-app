let unit = "C";
let lastWeather = null;

const $ = (id) => document.getElementById(id);

const ICONS = {
  "clear-day": "☀️", "clear-night": "🌙", "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "☁️", cloudy: "☁️", rain: "🌧️", showers: "🌦️",
  snow: "❄️", "snow-showers": "🌨️", fog: "🌫️", wind: "💨",
  thunder: "⛈️", "thunder-rain": "⛈️", hail: "🌨️",
};
const icon = (name) => {
  const key = Object.keys(ICONS).find((k) => name.startsWith(k));
  return ICONS[name] ?? (key ? ICONS[key] : "🌡️");
};

const convert = (c) => Math.round(unit === "C" ? c : (c * 9) / 5 + 32);
const temp = (c) => `${convert(c)}°${unit}`;
const speed = (kph) =>
  unit === "C" ? `${Math.round(kph)} km/h` : `${Math.round(kph * 0.621371)} mph`;

function themeFor(name) {
  if (name.includes("night")) return "night";
  if (/thunder/.test(name)) return "storm";
  if (/rain|showers/.test(name)) return "rain";
  if (/snow|hail/.test(name)) return "snow";
  if (/cloud|fog|wind/.test(name)) return "cloudy";
  if (/clear|day/.test(name)) return "sunny";
  return "default";
}

export function render(weather = lastWeather) {
  if (!weather) return;
  lastWeather = weather;
  const { current: c } = weather;
  document.body.dataset.theme = themeFor(c.icon);
  $("place").textContent = weather.place;
  $("icon").textContent = icon(c.icon);
  $("temp").textContent = temp(c.temp);
  $("conditions").textContent = c.conditions;
  $("description").textContent = weather.description ?? "";
  $("feels").textContent = temp(c.feelsLike);
  $("humidity").textContent = `${Math.round(c.humidity)}%`;
  $("wind").textContent = speed(c.wind);
  $("forecast").innerHTML = weather.forecast
    .map((d) => {
      const day = new Date(d.date + "T12:00:00").toLocaleDateString(undefined, { weekday: "short" });
      return `<div class="day" title="${d.conditions}">
        <span>${day}</span><span class="di">${icon(d.icon)}</span>
        <span>${temp(d.high)}</span><span class="muted">${temp(d.low)}</span></div>`;
    })
    .join("");
  $("weather").hidden = false;
}

export function toggleUnit() {
  unit = unit === "C" ? "F" : "C";
  $("unit-toggle").textContent = `°${unit}`;
  render();
}

export function setLoading(on) {
  $("loading").hidden = !on;
  if (on) {
    $("weather").hidden = true;
    showError("");
  }
}

export function showError(msg) {
  $("error").textContent = msg;
  $("error").hidden = !msg;
}

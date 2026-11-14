import "./style.css";
import { getWeather } from "./api.js";
import { render, toggleUnit, setLoading, showError } from "./ui.js";

const form = document.getElementById("search-form");
const input = document.getElementById("location");

async function search(location) {
  setLoading(true);
  try {
    render(await getWeather(location));
  } catch (err) {
    showError(
      err.name === "TypeError"
        ? "Network error. Check your connection and try again."
        : err.message || "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (value) search(value);
});
document.getElementById("unit-toggle").addEventListener("click", toggleUnit);

search("London");

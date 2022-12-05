const inputField = document.querySelector("input");
const searchButton = document.querySelector(".search-btn");
const dateField = document.querySelector(".date");
const city = document.querySelector(".city");
const errorMessage = document.querySelector(".error-message");
///
const currentTemp = document.querySelector(".current-temp");
const icon1 = document.querySelector(".icon1");
const high = document.querySelector(".high");
const low = document.querySelector(".low");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const description = document.querySelector(".description");

//// Forcast
const bottomLevel = document.getElementById("bottom-level");
const forcastTime = document.querySelector(".forcast-time");
const forcatsIcon = document.querySelector(".forcast-icon");
const forcatsTemp = document.querySelector(".forcast-temp");

// Background
const body = document.querySelector("body");

let todayData = {};

let dataHourly = {};
let cityName = "";

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = inputField.value;

  fetchData(cityName);
  inputField.value = "";
});

// assing date to fields
let date = new Date().toDateString();
dateField.innerHTML = date;

let unitMetric = "metric";
let unitF = "imperial";

function fetchData(name) {
  const urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=${unitMetric}&appid=5c7161a032288d2161fda449ec9b5c07`;
  const urlHourlyForcast = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=${unitMetric}&appid=5c7161a032288d2161fda449ec9b5c07`;
  Promise.all([
    fetch(urlCurrentWeather)
      .then((response) => response.json())
      .then((res) => ((todayData = res), displayCurrentDayWeather(todayData)))
      .catch((err) => console.log(err)),
    fetch(urlHourlyForcast)
      .then((response) => response.json())
      .then((res) => ((dataHourly = res), display24HForcast(dataHourly))),
  ]);
}

function displayCurrentDayWeather(data) {
  if (data.message === "city not found")
    return (errorMessage.innerHTML = `${cityName} not found !`);

  // to update city name on the page
  errorMessage.innerHTML = "";
  city.innerHTML = cityName;
  currentTemp.innerHTML = Math.floor(data.main.temp) + " ℃";
  description.innerHTML = data.weather[0].description;

  icon1.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  high.innerHTML = Math.floor(data.main.temp_max) + " ℃";
  low.innerHTML = Math.floor(data.main.temp_min) + " ℃";
  wind.innerHTML = data.wind.speed;
  humidity.innerHTML = data.main.humidity;
  sunrise.innerHTML = new Date(data.sys.sunrise * 1000).toLocaleString(
    "en-CA",
    {
      timeZone: "Canada/Mountain",
      timeStyle: "short",
    }
  );
  sunset.innerHTML = new Date(data.sys.sunset * 1000).toLocaleString("en-CA", {
    timeZone: "Canada/Mountain",
    timeStyle: "short",
  });
  changeBg();
}

function display24HForcast(data) {
  let next24HoursForcast = data.list.slice(1, 8);
  clearElement(bottomLevel);
  next24HoursForcast.forEach((element) => {
    let div = document.createElement("div");
    div.classList.add("forcast");
    div.innerHTML = `

      <p class="forcast-time">${formatAMPM(new Date(element.dt_txt))}</p>
      <img
        class="forcast-icon"
        src="http://openweathermap.org/img/w/${element.weather[0].icon}.png"
        alt=""
      />
      <div class="forcast-temp">${element.main.temp} ℃</div>
    `;

    bottomLevel.appendChild(div);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function changeBg() {
  let weatherDesciption = todayData.weather[0].description;
  let removeSpace = weatherDesciption.replace(" ", "");

  return (body.style.backgroundImage = `url(./assets/bg/${removeSpace}.jpg)`);
}

// to search on page load
cityName = inputField.value === "" ? "calgary" : inputField.value;
fetchData(cityName);

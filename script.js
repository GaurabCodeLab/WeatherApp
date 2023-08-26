const input = document.querySelector(".main-input");
const mainSection = document.querySelector(".main-section");
const weatherPart = document.querySelector(".weather-part");
const backBtn = document.querySelector(".backBtn");
const tempDetails = document.querySelector(".temp span");
const feelLikeDetails = document.querySelector(".feel-like span");
const humidityDetails = document.querySelector(".humidity span");
const city = document.querySelector(".city");
const weatherType = document.querySelector(".weather-type");
const weatherImage = document.querySelector(".weather-image");
let id = 0;
const details = document.querySelector(".details");
const btn = document.querySelector(".btn");

function callApi() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=d98080c14f8a986d111cef799fa1f2c7`)
    .then((response) => response.json())
    .then((data) => {
      details.classList.remove("valid");
      details.classList.remove("invalid");
      details.children[0].textContent = "";
      id = data.cod;
      if (data.cod != "404") {
        mainSection.style.display = "none";
        weatherPart.style.display = "block";
        input.value = "";
        tempDetails.textContent = Math.floor(data.main.temp - 273);
        feelLikeDetails.textContent = Math.floor(data.main.feels_like - 273);
        humidityDetails.textContent = data.main.humidity;
        city.textContent = `${data.name}, ${data.sys.country}`;
        weatherType.textContent = data.weather[0].description;
        weatherImageSelector(data.weather[0].id);
      }
      if (data.cod == 404) {
        console.log(details.children[0])
        details.children[0].textContent = `${input.value} isn't a valid city name`;
        details.classList.add("invalid");
      }

    })
    .catch(() => {
      details.classList.remove("valid");
      details.classList.add("invalid");
      details.children[0].textContent = "Something went wrong";
    })
}

input.addEventListener("keyup", (event) => {
  if (event.key == "Enter" && input.value != "") {
    details.classList.add("valid");
    details.children[0].textContent = "Getting Weather Details...";
    callApi();
  }
})

backBtn.addEventListener("click", () => {
  weatherPart.style.display = "none";
  mainSection.style.display = "block";
})

function weatherImageSelector(id) {
  if (id > 800) {
    weatherImage.src = "icons/cloud.svg";;
  } else if (id == 800) {
    weatherImage.src = "icons/clear.svg";
  } else if (id > 700) {
    weatherImage.src = "icons/haze.svg";
  } else if (id >= 600) {
    weatherImage.src = "icons/snow.svg";
  } else if (id >= 300 && id < 600) {
    weatherImage.src = "icons/rain.svg";
  } else {
    weatherImage.src = "icons/strom.svg";
  }
}


btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      details.classList.add("valid");
      details.children[0].textContent = "Getting Weather Details...";
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=d98080c14f8a986d111cef799fa1f2c7`)
        .then((response) => response.json())
        .then((data) => {
          details.classList.remove("valid");
          details.classList.remove("invalid");
          details.children[0].textContent = "";
          id = data.cod;
          if (data.cod != "404") {
            mainSection.style.display = "none";
            weatherPart.style.display = "block";
            input.value = "";
            tempDetails.textContent = Math.floor(data.main.temp - 273);
            feelLikeDetails.textContent = Math.floor(data.main.feels_like - 273);
            humidityDetails.textContent = data.main.humidity;
            city.textContent = `${data.name}, ${data.sys.country}`;
            weatherType.textContent = data.weather[0].description;
            weatherImageSelector(data.weather[0].id);
          }
          if (data.cod == 404) {
            details.classList.add("invalid");
            details.children[0].textContent = `${input.value} isn't a valid city name`;
          }

        })
        .catch(() => {
          details.classList.remove("valid");
          details.classList.add("invalid");
          details.children[0].textContent = "Something went wrong";
        })
    }, (error) => {
      details.classList.add("invalid");
      details.children[0].textContent = error.message;

    })
  } else {
    console.log("geolocation is not present");
  }
})


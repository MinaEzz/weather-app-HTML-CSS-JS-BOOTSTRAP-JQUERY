const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = document.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector(".location-btn");
const wIcon = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");
let api;

$(document).ready(function () {
  //FUNCTION ONE:
  $(inputField).keyup(function (e) {
    if (e.key == "Enter" && inputField.value != "") {
      //   console.log(inputField.value);
      requestApi(inputField.value);
    }
  });

  // REQUEST API FUNCTION:
  function requestApi(city) {
    const apiKey = "&appid=677ce07ab39d19109ff8e41beee14797&units=metric";
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}${apiKey}`;
    fetchData();
  }

  // FETCHING DATA FUNCTION:
  function fetchData() {
    $(infoTxt).text("getting weather details...");
    $(infoTxt).addClass("pending");
    fetch(api)
      .then((Response) => Response.json())
      .then((result) => weatherDetails(result));
  }

  // WEATHER DETAILS FUNCTION:
  function weatherDetails(info) {
    if (info.cod == "404") {
      $(infoTxt).text(`${inputField.value} isn't a valid city name`);
      $(infoTxt).removeClass("pending");
      $(infoTxt).addClass("error");
    } else {
      const city = info.name;
      const country = info.sys.country;
      const feelsLike = info.main.feels_like;
      const humidity = info.main.humidity;
      const temp = info.main.temp;
      const description = info.weather[0].description;
      const id = info.weather[0].id;

      if (id == 800) {
        $(wIcon).attr("src", "../Weather Icons/clear.svg");
      } else if (id >= 200 && id <= 232) {
        $(wIcon).attr("src", "../Weather Icons/storm.svg");
      } else if (id >= 600 && id <= 622) {
        $(wIcon).attr("src", "../Weather Icons/snow.svg");
      } else if (id >= 701 && id <= 781) {
        $(wIcon).attr("src", "../Weather Icons/haze.svg");
      } else if (id >= 801 && id <= 804) {
        $(wIcon).attr("src", "../Weather Icons/cloud.svg");
      } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        $(wIcon).attr("src", "../Weather Icons/rain.svg");
      }

      // lets present these values:
      $(infoTxt).removeClass("pending", "error");
      $(wrapper).addClass("active");
      wrapper.querySelector(".temp .numb").innerHTML = `${Math.floor(temp)}°C`;
      wrapper.querySelector(".weather span").innerHTML = description;
      wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
      wrapper.querySelector(
        ".bottom-part .feels span"
      ).innerHTML = `${Math.floor(feelsLike)}°C`;
      wrapper.querySelector(
        ".bottom-part .humidity span"
      ).innerHTML = `${humidity}%`;
    }
    // console.log(info);
  }

  // GET LOCATION FUNCTION:
  $(locationBtn).click(() => {
    if (navigator.geolocation) {
      //if browser support geolocation api
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser not support geolocation api");
    }
  });

  //ON SUCCESS FUNCTION:
  function onSuccess(position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // console.log(longitude, latitude);
    const apiKey = "&appid=677ce07ab39d19109ff8e41beee14797&units=metric";
    api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}${apiKey}`;
    fetchData();
  }

  //ON ERROR FUNCTION:
  function onError(error) {
    console.log(error);
    $(infoTxt).text(error.message);
    $(infoTxt).addClass("error");
  }

  //ARROW BACK FUNCTION:
  $(arrowBack).click(() => {
    $(wrapper).removeClass("active");
    inputField.value = "";
  });
});

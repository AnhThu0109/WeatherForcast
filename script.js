let mainPart = document.getElementById("main");
let errMess = document.getElementById("errMess");
let submitBtn = document.getElementById("submitBtn");
let showIcon = document.getElementsByClassName("iconWeather");
let displayDays = document.getElementsByClassName("showDays");
let displayWeekDay = document.getElementById("showWeekDay");
let activeDay = document.getElementsByClassName("active");
let showHourInfo = document.getElementById("showInfo");
let showHourRange = document.getElementById("showHourRange");
let changeTempBtn = document.getElementsByClassName("changeTemp");

//Search weather according to location
function searchLocationWeather() {
  let keyword = document.getElementById("location").value;
  try {
    if (keyword) {
      keyword = keyword.trim();
      if (keyword != "") {
        fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=3f66991e4c8c4f16b9731107230802&q=${keyword}&days=6&aqi=yes&alerts=no`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            //reset height of main tag
            mainPart.style.height = "";

            showDay(data);//Show weekdays briefly
            showHrsRange();//Show hour range
            
            //Take local time of searching location and show in info + hrsrange
            let date = new Date(data.location.localtime);
            let hour = Math.round(date.getHours() * 100/24);
            document.getElementById("hour").value = hour;

            showInfo(data, 0, date.getHours());//Show info of day 1
            document.getElementById("realTime").innerHTML = `${changeFormatDate3(date) + ', ' + date.getHours() + ':' + date.getMinutes()}`;
            showWeatherIcon(data.forecast.forecastday);//Show weather icon for weekdays

            
            showHrsWeatherIcon(data, 0);//Show weather icon in info part of day 1
            
            //Add event change for hour range          
            let inputRange = document.getElementById("hour");
            let h = Math.round(Number(document.getElementById("hour").value) * 0.24);
              if (h == 24) {
                h = 0;
              }
            inputRange.addEventListener("change", () => {
              h = Math.round(Number(document.getElementById("hour").value) * 0.24);
              if (h == 24) {
                h = 0;
              }
              showInfo(data, 0, h);
              showHrsWeatherIcon(data, 0);
            });

            //Click day for detail
            for (let i = 0; i < displayDays.length; i++) {             
              displayDays[i].addEventListener("click", () => {
                addremoveActiveClass(data, i);
                showDetail(data, i);
                showInfo(data, i, h);
                showWeatherIcon(data.forecast.forecastday);
                showHrsWeatherIcon(data, i);
                //On change input range
                inputRange.addEventListener("change", () => {
                  showInfo(data, i, h);
                  showHrsWeatherIcon(data, i);
                });
              });
            }
          })
          .catch((err) => {
            console.log(err);
            mainPart.style.height = "1000px";
            errMess.innerText =
              "No matching location found. Please type your location again!";
          });
      }
    } else {
      mainPart.style.height = "1000px";
      errMess.innerText = "Please enter your location first!";
    }
  } catch (error) {
    console.log(error);
  }
}

//Clear error message and table
const clearContent = () => {
  errMess.innerText = "";
  displayWeekDay.innerHTML = "";
  showHourInfo.innerHTML = "";
  showHourRange.innerHTML = "";
};

//Change date format
const changeFormatDate = (date) => {
  let newDate = new Date(date);
  let options = {
    month: "short",
    day: "numeric",
  };
  return newDate.toLocaleDateString("en-us", options);
};

//Show weekdays briefly
const showDay = (data) => {
  for (let i = 0; i < data.forecast.forecastday.length; i++) {
    if (i == 0) {
      displayWeekDay.innerHTML = `
                <div class="col-lg col-md-5 col-sm-8 rounded-5 p-3 mx-4 my-5 my-lg-4 d-flex flex-column align-items-center showDays active">
                    <h4 class="text-white">Today &nbsp;&nbsp;&nbsp; ${changeFormatDate(
                      data.forecast.forecastday[0].date
                    )}</h4>
                    <p class="iconWeather mt-auto mx-auto"></p>
                    <h1 class="fw-bolder temp mt-auto mx-auto">${
                      data.forecast.forecastday[0].day.maxtemp_c
                    }<sup>o</sup>C</h1>
                </div>
            `;
    } else {
      let displayData = `
                <div class="col-lg col-md-5 col-sm-8 rounded-5 p-3 mx-4 my-5 my-lg-4 d-flex align-items-center flex-column showDays">
                    <h4 class="text-white">${changeFormatDate(
                      data.forecast.forecastday[i].date
                    )}</h4>
                    <p class="iconWeather mt-auto"></p>
                    <h1 class="fw-bolder temp mt-auto">${
                      data.forecast.forecastday[i].day.maxtemp_c
                    }<sup>o</sup>C</h1>
                </div>      
                `;
      displayWeekDay.innerHTML += displayData;
    }
  }
};

//Add active class to chosen day
const addremoveActiveClass = (data, currentIndex) => {
  for (let i = 0; i < displayDays.length; i++) {
    if (i != currentIndex) {
      displayDays[i].classList.remove("active");
      displayDays[i].classList.add(
        "align-items-center",
        "flex-column",
        "d-flex"
      );
      if (i == 0) {
        displayDays[0].innerHTML = `
                <h4 class="text-white">Today &nbsp;&nbsp;&nbsp; ${changeFormatDate(
                  data.forecast.forecastday[0].date
                )}</h4>
                    <p class="iconWeather mt-auto mx-auto"></p>
                    <h1 class="fw-bolder temp mt-auto mx-auto">${
                      data.forecast.forecastday[0].day.maxtemp_c
                    }<sup>o</sup>C</h1>
                `;
      } else {
        displayDays[i].innerHTML = `
            <h4 class="text-white">${changeFormatDate(
              data.forecast.forecastday[i].date
            )}</h4>
            <p class="iconWeather mt-auto"></p>
            <h1 class="fw-bolder temp mt-auto">${
              data.forecast.forecastday[i].day.maxtemp_c
            }<sup>o</sup>C</h1>
            `;
      }
    } else {
      displayDays[i].classList.add("active");
      displayDays[i].classList.remove(
        "flex-column",
        "d-flex",
        "align-items-center"
      );
    }
  }
};

//Show detail of chosen day
const showDetail = (data, currentIndex) => {
  activeDay[0].innerHTML = `
    <h4 class="text-white">${changeFormatDate(
      data.forecast.forecastday[currentIndex].date
    )}</h4>
    <p class="location">${data.location.name} - ${data.location.country}</p>
    <h1><span class="fw-bolder temp">${
      data.forecast.forecastday[currentIndex].day.maxtemp_c
    }<sup>o</sup>C </span>&nbsp;&nbsp;<span class="iconWeather"></span></h1>
    <i class="fa-solid fa-umbrella"></i>&nbsp;${
      data.forecast.forecastday[currentIndex].day.daily_chance_of_rain
    } %&nbsp;
    <i class="fa-solid fa-droplet"></i>&nbsp;${
      data.forecast.forecastday[currentIndex].day.avghumidity
    } %&nbsp;
    <i class="fa-solid fa-wind"></i>&nbsp;${
      data.forecast.forecastday[currentIndex].day.maxwind_kph
    } km/h<br>
    <i class="fa-solid fa-mountain-sun"></i>&nbsp;${
      data.forecast.forecastday[currentIndex].astro.sunrise
    }&nbsp;&nbsp;
    <i class="fa-solid fa-cloud-moon"></i>&nbsp;${
      data.forecast.forecastday[currentIndex].astro.moonset
    }
    <p><i class="fa-solid fa-clock"></i>&nbspTime updated: ${
      data.current.last_updated
    }</p>
    `;
};

//Display weather icon according to weather text
const displayIcon = (text, display) => {
  if (text.includes("sunny") || text == "Sunny") {
    display = `<i class="fa-solid fa-sun sunnyColor"></i>`;
  } else if (text.includes("rain")) {
    display = `<i class="fa-solid fa-cloud-showers-heavy rainnyColor"></i>`;
  } else if (text.includes("snow")) {
    display = `<i class="fa-solid fa-snowflake cloudyColor"></i>`;
  } else if (text.includes("drizzle")) {
    display = `<i class="fa-solid fa-cloud-rain rainnyColor"></i>`;
  } else if (text.includes("overcast") || text == "Overcast") {
    display = `<i class="fa-solid fa-cloud text-secondary"></i>`;
  } else {
    display = `<i class="fa-solid fa-cloud cloudyColor"></i>`;
  }
  return display;
};

//Show weather icon for weekdays
const showWeatherIcon = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    showIcon[i].innerHTML = displayIcon(
      arr[i].day.condition.text,
      showIcon[i].innerHTML
    );
  }
};

//Show weather icon of chosen day according to hour
const showHrsWeatherIcon = (data, day) => {
  let h = Math.round(Number(document.getElementById("hour").value) * 0.24);
  if (h == 24) {
    h = 0;
  }
  let hourData = data.forecast.forecastday[day].hour[h];
  let hrsWeather = document.getElementById("hrsWeather");
  hrsWeather.innerHTML = displayIcon(
    hourData.condition.text,
    hrsWeather.innerHTML
  );
};

//Change date format for info of chosen day
const changeFormatDate2 = (date) => {
  let newDate = new Date(date);
  let options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour12 : false,
    hour:  "2-digit",
    minute:  "2-digit",
  };
  return newDate.toLocaleDateString("en-us", options);
};

const changeFormatDate3 = (date) => {
  let newDate = new Date(date);
  let options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return newDate.toLocaleDateString("en-us", options);
};


const showInfo = (data, day, h) => {
  let hourData = data.forecast.forecastday[day].hour[h];
  showHourInfo.innerHTML = `
        <h4>${data.location.name} - ${data.location.country}</h4>
        <div class="row">
            <div class="col-lg-3 col-md-5 col-sm-12">
            <h1>
                <span id="hrsWeather"></span>
                <span id="hrsTemp">${hourData.temp_c}</span><sup>o</sup>&nbsp;<button class="border-0 rounded-3 bg-white-30 changeTemp bg-warning" onclick="changeTemptoC(${hourData.temp_c}), changeBgTempBtn(0)">C</button> | <button class="border-0 rounded-3 bg-white-30 changeTemp" onclick="changeTemptoF(${hourData.temp_f}), changeBgTempBtn(1)">F</button>
            </h1>
            </div>
            <div class="col">
            <h6>Humidity: ${hourData.humidity}%<br>
                UV: ${hourData.uv}<br>
                Chance of rain: ${hourData.chance_of_rain}%
            </h6>
            </div>
        </div>
        <h4>${hourData.condition.text} . <span id="realTime">${changeFormatDate2(hourData.time)}</span></h4>
    `;
};

//Show input range of hour
const showHrsRange = () => {
  showHourRange.innerHTML = `
        <input type="range" name="hour" id="hour" list="values" value="">
        <datalist id="values">
            <option value="0" label="00:00"></option>
            <option value="25" label="06:00"></option>
            <option value="50" label="12:00"></option>
            <option value="75" label="18:00"></option>
            <option value="100" label="24:00"></option>
        </datalist>
    `;
};

//Add background color for selected temp btn
const changeBgTempBtn = (index) => {
  for (let i = 0; i < changeTempBtn.length; i++) {
    if (i == index) {
      changeTempBtn[i].classList.add("bg-warning");
    } else changeTempBtn[i].classList.remove("bg-warning");
  }
};
//Change temp (C <=> F)
const changeTemptoF = (a) => {
  let temp = document.getElementById("hrsTemp");
  temp.innerHTML = `${a}`;
};
const changeTemptoC = (b) => {
  let temp = document.getElementById("hrsTemp");
  temp.innerHTML = `${b}`;
};

//Find button
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearContent();
  searchLocationWeather();
});

window.onload = () => {
  mainPart.style.height = "1000px";
  document.getElementById("location").value = "Ho Chi Minh";
  searchLocationWeather();
};

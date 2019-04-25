window.onload = () => {
    let cityName = document.getElementById('city-name');
    let cityNameSender = document.getElementById('city-name-sender');
    let cityNameValue;
    let weatherData = {};
    let topContainer = document.getElementById('top-container');
    let bottomContainer = document.getElementById('bottom-container');
    let getLocationBtn = document.getElementById('loc');

    let createNodeElement = (tagName, ...classNames) => {
        let newTag = document.createElement(tagName);
        if (classNames[0]) {
            [...classNames].forEach(className => {
                newTag.classList.add(className);
            });
        }
        return newTag;
    };

    let getAjaxJson = (ajaxUrl) => {
        let request = new XMLHttpRequest();
        request.onload = () => {
            console.log(request.response);
            if (request.response.cod === '200') {
                weatherData = request.response;
                console.clear();
                console.log(weatherData);
                cityName.value = cityNameValue = weatherData.city.name;
                showAllInfo();
            } else {
                cityName.value = '';
                bottomContainer.innerHTML = topContainer.innerHTML = '';
                alert(`ERROR! ${(request.response.message).toUpperCase()}!`);
            }
        };
        request.open('GET', ajaxUrl);
        request.responseType = 'json';
        request.send();
    };

    let createNextDayInfo = (obj) => {
        let dayInfoContainer = createNodeElement('div', 'day-info');

        dayInfoContainer.innerHTML = `<span>${obj.dt_txt}</span><img src="./img/icons/${obj.weather[0].icon}.png"><span>${obj.main.temp}&#8451;</span>`;
        bottomContainer.appendChild(dayInfoContainer);
    };

    let createTodayInfo = (obj) => {
        let windDirectCalc = (deg) => {
            if ((deg > 0 && deg <= 22.5) || (deg > 337.5 && deg < 360)) {
                return 'North';
            } else if (deg > 22.5 && deg <= 67.5) {
                return 'North-East';
            } else if (deg > 67.5 && deg <= 112.5) {
                return 'East';
            } else if (deg > 112.5 && deg <= 157.5) {
                return 'South-East';
            } else if (deg > 157.5 && deg <= 202.5) {
                return 'South';
            } else if (deg > 202.5 && deg <= 247.5) {
                return 'South-West';
            } else if (deg > 247.5 && deg <= 292.5) {
                return 'West';
            } else if (deg > 292.5 && deg <= 337.5) {
                return 'North-West';
            }
        };
        let todayInfoContainer = createNodeElement('div', 'today-info');

        topContainer.innerHTML = `<p>${weatherData.city.name}</p> 
                                  <p>${obj.dt_txt.slice(11, -3)}</p> 
                                  <img src="./img/icons/${obj.weather[0].icon}.png">
                                  <p>${obj.weather[0].description}</p> 
                                  <p>Wind direction: ${windDirectCalc(obj.wind.deg)}, speed: ${obj.wind.speed}</p>`;
        bottomContainer.appendChild(todayInfoContainer);
    };

    let showAllInfo = () => {
        let filteredWeatherData = weatherData.list.filter((hourInfo) => {
            return hourInfo.dt_txt.includes('12:00');
        });
        bottomContainer.innerHTML = '';
        createTodayInfo(weatherData.list[0]);
        filteredWeatherData.forEach(dayInfo => {
            createNextDayInfo(dayInfo);
        });
    };

    let cityNameChanger = (e) => {
        if (!isNaN(e.target.value)) {
            e.target.value = '';
        } else cityNameValue = e.target.value;
    };

    let ajaxRequestSwitcher = (lat = null, long = null) => {
        const API_KEY = 'ce13b2f76b8938d756804cf8bb577772';
        if (!isNaN(lat) && lat !== null) {
            getAjaxJson(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&APPID=${API_KEY}`);
        } else if (cityNameValue !== null && cityNameValue !== undefined) {
            getAjaxJson(`http://api.openweathermap.org/data/2.5/forecast?q=${cityNameValue}&units=metric&APPID=${API_KEY}`);
        } else {
            alert("Enter the name of the city!");
        }
    };

    let getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                ajaxRequestSwitcher(pos.coords.latitude, pos.coords.longitude);
            });
        }
    };

    cityName.addEventListener('input', cityNameChanger);
    getLocationBtn.addEventListener('click', getCurrentLocation);
    cityNameSender.addEventListener('click', ajaxRequestSwitcher);
    cityName.addEventListener('keydown', (e) => {
        if (e.keyCode == '13') {
            ajaxRequestSwitcher();
        }
    });
};
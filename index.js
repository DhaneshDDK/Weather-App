const API_KEY = "3d218ab0b43f3a77de13bce62c74af2a";

const temperature = document.querySelector('.temperature');
const cityName = document.querySelector('.city');
const cityImage = document.querySelector('.cityImg');
const cloudImg = document.querySelector('.clouds');
const windSpeed = document.querySelector('.windSpeed');
const humidityValue = document.querySelector('.humidity');
const cloudsValue = document.querySelector('.cloudsValue');
const searchBar = document.querySelector('.searchBar');
const grandAccessButton = document.querySelector('.btn');


//tabs
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchWeather = document.querySelector('.search');
const yourWeather = document.querySelector('.yourWeather');
const cityInput = document.querySelector('.cityInput')
const showData = document.querySelector('.data');
const find = document.querySelector('.find');
const errorTab = document.querySelector('.error');
const loader = document.querySelector('.Loading');

//which tab should be displayed first if location access is there data tab else grandAccess tab

getFromSessionStorage();


function getFromSessionStorage(){
    const userCoordinates = sessionStorage.getItem("user-coordinates");
    if(userCoordinates){
       const coordinates = JSON.parse(userCoordinates);
       yourWeather.classList.add('tabsBg')
       fetchUserDetails(coordinates);
    }else{
       //show error and go to grand access page
       grantAccessContainer.classList.remove('disable');
    }
}

function setData(result){
    const content = result.name.toLowerCase();
    cityName.innerHTML = result.name;
    temperature.innerHTML = result.main.temp + " °C";
    cityImage.innerHTML = result.sys.country;
    windSpeed.innerHTML = result.wind.speed + " m/s"; 
    humidityValue.innerHTML  = result.main.humidity + "%";
    cloudsValue.innerHTML = result.clouds.all + "%";


     //fetch values from weatherINfo object and put it UI elements
     cityImage.src = `https://flagcdn.com/144x108/${result?.sys?.country.toLowerCase()}.png`;
     let desc = document.querySelector('.desc');
     let cloudImg = document.querySelector('.cloudImg');
     desc.innerText = result?.weather?.[0]?.description;
     cloudImg.src = `http://openweathermap.org/img/w/${result?.weather?.[0]?.icon}.png`;

  
}

async function fetchUserDetails(coordinates){
     //we have coordinates so now start loading and remove grandAccess tab
     loader.classList.remove('disable');
     grantAccessContainer.classList.add('disable');
       const {lat,lon} = coordinates;
    try {
        const data = await fetch(  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` );
        const content = await data.json();

        //turn off loading screen and show data
        loader.classList.add('disable');
        showData.classList.remove('disable');
            setData(content);
    } catch (error) {
         
    }
}

function getCoordinates(position){
   const userCoordinates =  {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
   }
   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
   //for API call
   fetchUserDetails(userCoordinates);
}

function getUserLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getCoordinates);
    }else{
       
    }
}

grandAccessButton.addEventListener('click', getUserLocation);



//switching tabs
let oldTab =  showData;

function switchTab(newTab, fromWhere){

    oldTab.classList.add('disable');
    // console.log(newTab)
    newTab.classList.remove('disable');
    oldTab = newTab;

    if(fromWhere == searchWeather) searchBar.classList.remove('disable');
    else if(fromWhere ==  yourWeather){
    searchBar.classList.add('disable');
    }

}

searchWeather.addEventListener('click',()=>{
    yourWeather.classList.remove('tabsBg')
    searchWeather.classList.add('tabsBg')
   switchTab(searchBar, "");
})

yourWeather.addEventListener('click',()=>{
    yourWeather.classList.add('tabsBg')
    searchWeather.classList.remove('tabsBg')
    getFromSessionStorage();
    switchTab(showData, yourWeather );
    
})



async function fetchWeatherDetails(city){
    try {   
        if(oldTab == errorTab){
            switchTab(searchBar,"");
        }
        showData.classList.add('disable');
        loader.classList.remove('disable');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loader.classList.add('disable');
        // console.log(data);
        setData(data);
        switchTab(showData, searchWeather);

    } catch (error) {
       switchTab(errorTab,searchWeather);
    }

}

find.addEventListener('click',()=>{
    fetchWeatherDetails(cityInput.value);
})

cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
     fetchWeatherDetails(cityInput.value);
    }
  });
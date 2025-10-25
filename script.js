//  getting the empty div and button by their ids 

const getWeather = document.getElementById('show-weather');
const getBtn = document.getElementById('get-weather');

//  data is fetched from the openweather map using the async function and the api i provided from my account in openwathermap. its free by the way :}.
const fetchWeather = async () =>{
  
  const city = document.getElementById('location-input').value.trim();git push

  if (!city) return alert('enter city');

     getWeather.textContent = "Loading.....please wait";

  try {
      const res = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fddcb2c933aff748cdd3c445c8a34c7a&units=metric`); //fake key by the way.
      const data =  await res.json();

      if(Number(data.cod) !== 200)  throw new Error(`sorry ${data.message}`);

      getWeather.innerHTML = `<div style = "background-color:blue; margin-top: 20px; padding :60px; border-radius:14px;color:white;">

      <h1>: here is your weather!</h1>
        <h2>Temperature:${data.main.temp} ^C</h2> 
        <h2>Humidity: ${data.main.humidity} %</h2>   
        <h2>wind speed: ${data.wind.speed} m/s</h2>     
         <p>${data.weather[0].description}</p>
      `;


  }catch (err){
         getWeather.innerHTML = `<div style = "background-color:red; margin-top: 20px; padding :100px; border-radius:14px;color:white;">unfortunately : ${err} sorry `;
  }
}


getBtn.addEventListener('click' , fetchWeather);
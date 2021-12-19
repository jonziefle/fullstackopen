import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    const params = {
      q: `${country.capital[0]},${country.cca2}`,
      appid: process.env.REACT_APP_WEATHER_API_KEY,
      units: 'metric'
    }
    axios.get('https://api.openweathermap.org/data/2.5/weather', {params, signal})
      .then(response => {setWeather(response.data)})
      .catch(error => console.log(error))
    
    return () => controller.abort()
  }, [country])
  //console.log('country', country)
  //console.log('weather', weather)

  const convertDegreeToCompassPoint = (wind_deg) => {
    const compassPoints = ["N", "NNE", "NE", "ENE", 
                           "E", "ESE", "SE", "SSE",
                           "S", "SSW", "SW", "WSW", 
                           "W", "WNW", "NW", "NNW"];
    const rawPosition = Math.floor((wind_deg / 22.5) + 0.5)
    const arrayPosition = (rawPosition % 16)
    return compassPoints[arrayPosition]
  }
  
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {Object.keys(country.languages).map((key) =>
          <li key={key}>{country.languages[key]}</li>
        )}
      </ul>
      <img  src={country.flags.png} 
            alt={country.name.common + ' flag'}
            width='200px'/>
      {Object.keys(weather).length !== 0 &&
        <>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp.toFixed(0)}&#176; Celsius</p>
          <p>Conditions: {weather.weather[0].main}</p>
          <img  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                alt={weather.weather[0].main}
                width='100px'/>
          <p>Wind: {(weather.wind.speed * 3.6).toFixed(0)} km/h {convertDegreeToCompassPoint(weather.wind.deg)}</p>
        </>
      }
    </div>
  )
}

export default Country
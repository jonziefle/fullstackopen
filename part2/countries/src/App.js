import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countriesFiltered, setCountriesFiltered] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])
  //console.log('countries', countries.length)

  const handleFilterChange = (event) => {
    const targetValue = event.target.value
    setFilter(targetValue)
    setCountriesFiltered(
      targetValue === '' ? [] : countries.filter(country => country.name.common.toLowerCase().includes(targetValue.toLowerCase()))
    )
  }

  const handleButtonClick = (countryName) => {
    setCountriesFiltered(
      countries.filter(country => 
        country.name.common.toLowerCase() === countryName.toLowerCase())
    )
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountryList countriesFiltered={countriesFiltered} handleButtonClick={handleButtonClick} />
    </div>
  )
}

export default App
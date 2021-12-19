import React from 'react'
import Country from './Country'

const CountryList = ({countriesFiltered, handleButtonClick}) => {
  if (countriesFiltered.length > 10) {
    return (
      <div>
        <p>Too many matches. Please specify another filter.</p>
      </div>
    )
  } else if (countriesFiltered.length > 1 && countriesFiltered.length <= 10) {
    return (
      <div>
        <ul>
          {countriesFiltered.map(country =>
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleButtonClick(country.name.common)}>show</button>
              </li>
          )}
        </ul>
      </div>
    )
  } else if (countriesFiltered.length === 1) {
    return (
      <Country country={countriesFiltered[0]}/>
    )
  } else {
    return (
      <div>
        <p>No results</p>
      </div>
    )
  }
}

export default CountryList
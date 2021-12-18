import React from 'react'
import Person from './Person'

const PersonList = ({personsFiltered}) => {
  return (
    <div>
      <ul>
        {personsFiltered.map(person => 
          <Person key={person.id} person={person} />
        )}
      </ul>
    </div>
  )
}

export default PersonList
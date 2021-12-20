import React from 'react'
import Person from './Person'

const PersonList = ({personsFiltered, deletePerson}) => {
  return (
    <div>
      <ul>
        {personsFiltered.map(person => 
          <Person key={person.id} 
                  person={person} 
                  deletePerson={deletePerson}/>
        )}
      </ul>
    </div>
  )
}

export default PersonList
import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getEntries()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('entries could not be fetched')
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (persons.some(person => person.name === newName)) {
      const personToBeUpdated = persons.find((person) => person.name === newName)
      if (window.confirm(`${personToBeUpdated.name} is already added to the phonebook. Update the existing number?`)) {
        personService
        .updateEntry(personToBeUpdated.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== personToBeUpdated.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(`${personToBeUpdated.name} could not be updated`)
        })
      }
    } else {
      personService
        .addEntry(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(`${newName} could not be added`)
        })
    }
  }

  const deletePerson = (id) => {  
    const personToBeDeleted = persons.find((person) => person.id === id)
    if (window.confirm(`Delete ${personToBeDeleted.name}?`)) {
      personService
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log(`${personToBeDeleted.name} could not be deleted`)
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsFiltered = filter === '' 
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} 
              handleFilterChange={handleFilterChange} />
      <h3>Add a New Person</h3>
      <PersonForm addPerson={addPerson} 
                  newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <PersonList   personsFiltered={personsFiltered} 
                    deletePerson={deletePerson}/>
    </div>
  )
}

export default App
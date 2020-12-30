import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import axios from 'axios'
import serverService from './services/serverService'
import './index.css'

const Filter = (props) => {

  return(
    <p>filter shown with  <input onChange={props.onChange}/></p>
  )
}

const Phonebook = (props) => {


  const [message, setMessage] = useState('some message')

  const eliminatePerson = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note =  props.persons.find(n => n.id === id)
    
    serverService
    .eliminate(id)
    .then(response => {
      setMessage('id ' + id + ' was deleted')
      alert(message)
    })
    .catch(error => {
      alert(
        `the person '${id}' was already deleted from server`
      )
      
    })
    
  
    
  }  

  return(
    <div><h2>Numbers</h2>
 
    <ul>
    {props.persons.filter(person => person.name.includes(props.filter)).map(person =>
        <Person key={person.id} person={person} eliminatePerson={() => eliminatePerson(person.id)}/>
        
      )}
    </ul></div>
  )
}

const NewPersonForm = (props) => {

  return(
    <form onSubmit={props.submit}>
    <div>

    <h2>Add a new number</h2>
   
<div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
<div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
<div><button type="submit">add</button></div>

    </div>
  </form>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (message.includes("Added")){

  return (
    <div className="message">
      {message}
    </div>
  )}

  return(
    <div className="invisible">
      {message}
    </div>
  )

}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    serverService
      .getAll()
      .then(response => {
      
        setPersons(response.data)
      })
  }, [])


  const handleMessageChange = (event) => {
    setErrorMessage(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }



  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      date: new Date().toISOString(),
      id: Math.random()*persons.length + 1,
    }

    function containsObject(obj, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (list[i].name === obj.name) {
           return true;
          }
      }
      return false;
  }

  function findId(obj, list){
    var i;
    for (i=0; i < list.length; i++){
      if (list[i].name === obj.name) {
        return list[i].id;
       }
    }
  }

  console.log(personObject)
  console.log(persons)


  if (containsObject(personObject, persons) == false) {
    serverService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      setErrorMessage("Added " + personObject.name)
    })
  } else {
    var r = window.confirm(`${newName} is already added to phonebook, replace the old number with the new one? `);
              if (r==true){
                var id = findId(personObject, persons)
            
                serverService
                .update(id, personObject)
                .then(response => {
                  setPersons(persons.map(person => person.id !== id ? person : personObject))
                
                  setNewName('')
                  setNewNumber('')
                })
                .catch(error => {   
                   setErrorMessage(
                  `Note '${personObject.name}' was already removed from server`
                )
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
                
              })
              } else {
                alert("ok")
              }
  }
  




    
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <Filter  onChange={handleFilterChange}></Filter>
      <NewPersonForm submit={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></NewPersonForm>
      <Phonebook persons={persons} filter={filter} />
    </div>
  )
}

export default App
import React from 'react'
const Person = ({ person, eliminatePerson }) => {
    return (
      <li>{person.name}  {person.number}  <button onClick={eliminatePerson}>delete</button></li>
    )
  }
  
  export default Person
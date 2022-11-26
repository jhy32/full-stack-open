import { useState, useEffect} from 'react'
import axios from 'axios'
import noteService from './services/notes'



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("")
  useEffect(() => {
    //set state is async so the log is inaccurate
    noteService.get()
      .then(response => (
        setPersons(response.data)))
  }, []) 

  function setPersonsOnSubmit(event) {
    event.preventDefault()
    const newObj = {name: newName, number: newNumber}

    if (persons.some((person) => (person.name === newName))) {
      window.alert(`${newName} is already added to phonebook, replace the old number with a new one?`)
      let existingID = persons.find((personEntry)=> personEntry.name === newName).id
      console.log(existingID)
      noteService.replace(existingID, newObj).then((r) => {
        setPersons(persons.map((person) => (person.id === existingID ? r.data : person)))}).then(
        () => {setMessageType("successful");
          setMessage(`${newName} changed number successfully`)}).then(
        () => setTimeout(()=>setMessage(null), 5000)).catch(
          (error) => {setMessageType("unsuccessful") ;
          setMessage(`${newName} has already been deleted!`)}).then(
            () => setTimeout(()=>setMessage(null), 5000)
          )
      
    } else {
    const newObj = {name: newName, number: newNumber}
    noteService.create(newObj).then((r)=> {
      setPersons(persons.concat(r.data))
      setMessageType("successful")
      setMessage(`Added ${newName}`)}).then(
        () => setTimeout(()=>setMessage(null), 5000)).catch(
          error => {
            console.log(error.response.data.error)
            setMessageType("unsuccessful") ;
            setMessage(`${error.response.data.error}`)}).then(
            () => setTimeout(()=>setMessage(null), 5000))
    }
        
    
    // setPersons(persons.concat([r])))
    setNewName("")
    setNewNumber("")
  } 
  
  
  return (
    <div>
      <h1> Phonebook </h1>
      <Note message={message} messageType = {messageType}/>
      <Filter setFilter = {setFilter} />
      <h2>Phonebook</h2>
      <PersonForm setPersonsOnSubmit = {setPersonsOnSubmit} setNewName = {setNewName}
      setNewNumber = {setNewNumber} name = {newName} number = {newNumber} /> 
      <h2>Numbers</h2>
      <Persons persons = {persons} filter = {filter} setPersons = {setPersons} /> 
    </div>
  )
}


const Filter = (props) => (
  <p> filter shown with <input onChange = {(e) => {props.setFilter(e.target.value)}} /> </p>
)

const PersonForm = ({setPersonsOnSubmit, setNewName, setNewNumber, name, number}) => (
  <form onSubmit ={setPersonsOnSubmit}>
  <div>
    name: <input value = {name} onChange = {(e) => {setNewName(e.target.value)}} />
  </div>
  <div> number: <input value = {number} onChange = {(e)=> {setNewNumber(e.target.value)}}/></div>
  <div>
    <button type="submit">add</button>
  </div>
  </form>
)

const Persons = ({persons, filter, setPersons}) => {
  const removePerson = (person, e) => { 
    e.preventDefault()
    noteService.del(person.id)
    setPersons(persons.filter((personEntry)=> personEntry.id !== person.id))
  }
    //what about local id
  return (
  <div>
  {persons.filter((person)=> person.name.toLowerCase().includes(filter.toLowerCase())).map(
    (person) => (<div> <p> {person.name} {person.number} </p> 
                <button onClick = {(e) => removePerson(person, e)}> delete </button> </div>))}
  </div>
  )
}

const Note = ({message, messageType}) => {
  const successfulNoteStyle = {
    color: 'green', 
    fontStyle: 'bold', 
    fontsize: 40,
    fontFamily: 'Helvetica',
    borderColor: 'coral',
    borderStyle: 'solid',
    borderWidth: 10,
    padding: 20

  }
  const unsuccessfulNoteStyle = {
    color: 'red', 
    fontStyle: 'italics', 
    fontsize: 40,
    fontFamily: 'Arial',
    borderColor: 'black',
    borderStyle: 'dotted',
    borderWidth: 10,
    padding: 20
  }

  if (message == null){
    return null
  } else {
    return (
      <div style = {messageType==="successful"? successfulNoteStyle : unsuccessfulNoteStyle}> {message} </div>
    )
  }
}




// const App = () => {
// return (
//   <div>
//     <h2>Phonebook</h2>

//     <Filter filter = {filter} />

//     <h3>Add a new</h3>

//     <PersonForm 
//       ...
//     />

//     <h3>Numbers</h3>

//     <Persons ... />
//   </div>
// )
// } 


export default App

// {filter? persons.filter((person)=> person.name.toLowerCase().includes(filter)).
//   map((person) => <p> {person.name} {person.number} </p>) : persons}
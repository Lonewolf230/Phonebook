import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import axios from 'axios'
import { getAll,update,create } from './services/persons'
import './App.css'
import Notif from './components/Notif'

const App = () => {
  const [persons, setPersons] = useState([
    

  ]) 
  const [notif,setNotif]=useState({message:"",type:""})
  const [newPerson,setNewPerson]=useState({name:"",number:""})
  const [filter,setFilter]=useState("")

  const personObj={
    name:newPerson.name,
    number:newPerson.number
  }

  const handleNotification = (message,type, duration = 1000) => {
    setNotif({message,type})
    setTimeout(() => {
      setNotif({message:"",type:""})
    }, duration)
  }


  function addName(e){
    e.preventDefault()
    
    
    const nameExists = persons.find(person => person.name === personObj.name)
    
    if(nameExists){
      if(window.confirm(`${personObj.name} already exists. Replace with a new number`))
        axios.put(`http://localhost:5004/api/persons/${nameExists.id}`,personObj)
        .then(response=>{
          setPersons(prev=>prev.map(person=>person.id===nameExists.id? response.data:person))
        })
        handleNotification(`${personObj.name} has been updated`,"success")
      }
    else{
      axios.post("http://localhost:5004/api/persons",personObj)
    .then(response=>setPersons((prev)=>[...prev,response.data]))
    handleNotification(`${personObj.name} has been added`,"success")
    setNewPerson({name:"",number:""})  
    }
    
  }

  function handleInputChange(e){
    const {name,value}=e.target
    setNewPerson((prevPerson)=>({
      ...prevPerson,
      [name]:value,
    }))
  }
  function handleFilter(e){
    setFilter(e.target.value)
  }

  function deleteName(id,name){
    if(window.confirm(`Are you sure?`)){
      axios.delete(`http://localhost:5004/api/persons/${id}`)
      .then(()=>{
        setPersons((prev)=>prev.filter(person=> person.id!=id))
        handleNotification(`${name} deleted successfully`,'success')
    })
      .catch(error=>handleNotification(`Details of ${name} has already been deleted. Please refresh`,"fail"))
      
    }
  }

  const filteredPersons= filter? persons.filter(person=> person.name.toLowerCase().includes(filter.toLowerCase())):persons

  console.log(persons);

useEffect(()=>{
  axios.get('http://localhost:5004/api/persons').then(response=>setPersons(response.data));
},[])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notif message={notif.message} type={notif.type}/>
      <Filter onChange={handleFilter} value={filter}/>

      <PersonForm onSubmit={addName} onChange={handleInputChange} newPerson={newPerson} />
      
      <Persons filteredPersons={filteredPersons} deleteName={deleteName} />
    </div>
  )
}

export default App


/*
  import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }

  ]) 

  const [newPerson,setNewPerson]=useState({name:"",phone:""})
  const [filter,setFilter]=useState("")

  function addName(e){
    e.preventDefault()
    
    const personObj={
      name:newPerson.name,
      phone:newPerson.phone
    }
    const nameExists = persons.some(person => person.name === personObj.name)
    if(!nameExists)
      setPersons((prev)=>[...prev,personObj])
    else
      alert(`${personObj.name} already exists`)
    setNewPerson({name:"",phone:""})
      
  }

  function personUpdate(e){
    const {name,value}=e.target
    setNewPerson((prevPerson)=>({
      ...prevPerson,
      [name]:value,
    }))
  }
  function handleFilter(e){
    setFilter(e.target.value)
  }

  const filteredPersons= filter? persons.filter(person=> person.name.toLowerCase().includes(filter.toLowerCase())):persons

  console.log(persons);
  return (
    <div>
      <h2>Phonebook</h2>
      <input  name='filter' value={filter} onChange={handleFilter}/>

      <form onSubmit={addName}>
        <div>
          name: <input onChange={personUpdate} value={newPerson.name} name='name'/>
          phone: <input onChange={personUpdate} value={newPerson.phone} name='phone'/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map(person=>{
        return <h2 key={person.name}>{person.name} {person.phone}</h2>
      })}
      <div>debug: {newPerson.name}</div>
    </div>
  )
}

export default App
*/
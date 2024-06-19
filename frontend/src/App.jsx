import { useEffect, useState,useRef,useCallback } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import axios from 'axios'
import { getAll,update,create } from './services/persons'
import './App.css'
import Notif from './components/Notif'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [notif,setNotif]=useState({message:"",type:""})
  const [newPerson,setNewPerson]=useState({name:"",number:""})
  const [filter,setFilter]=useState("")

  
  

  const handleNotification = (message,type, duration = 1000) => {
    setNotif({message,type})
    setTimeout(() => {
      setNotif({message:"",type:""})
    }, duration)
  }


 
  function addName(e) {
    e.preventDefault();
  
      const personObj={
        name:newPerson.name.trim(),
        number:newPerson.number.trim()
      }
        

      const nameExists = persons.find(person => person.name === personObj.name);
      
      if (nameExists) {
          if (window.confirm(`${personObj.name} already exists. Replace with a new number?`)) {
              axios.put(`http://localhost:5004/api/persons/${nameExists.id}`, personObj)
                  .then(response => {
                      // Update existing person in state with the updated data
                      setPersons(prevPersons => prevPersons.map(person => person.id === nameExists.id ? response.data : person));
                      handleNotification(`${personObj.name} has been updated`, "success");
                      setNewPerson({name:"",number:""})
                  })
                  .catch(error => {
                      console.error('Error updating person:', error);
                      handleNotification(`Failed to update ${personObj.name}`, "fail");
                  });
          }
      } else {
        
          axios.post("http://localhost:5004/api/persons", newPerson)
              .then(response => {
                
                
                  if(newPerson.name && newPerson.number){
                  setPersons(prevPersons => [...prevPersons, response.data]);
                  handleNotification(`${newPerson.name} has been added`, "success");
                  setNewPerson({ name: "", number: "" });
                  }
                  
                
              })
              .catch(err => {
                // Handle network errors or other unexpected errors
                console.error('Error adding person:', err);
                handleNotification(err.response.data.error, 'fail');
              });
      
  
    }
}


  function handleInputChange(e){
    const {name,value}=e.target
    setNewPerson((prevPerson)=>({
      ...prevPerson,
      [name]:value,
    }))}
    
  
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



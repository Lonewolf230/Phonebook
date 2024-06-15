const express=require('express')
const morgan=require('morgan')
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())//Middleware used for handling response and requests
//Middlewares are executed in the order they are listed
//Middleware has request response and next as args
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', (request.body))
    console.log('---')
    next()
  }
  const unknownEndpoint = (request, response,next) => {
    response.status(404).send({ error: 'unknown endpoint' })
    next()
  }
  
  
app.use(requestLogger)


let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/',(request,response)=>{
    response.send('<h1>Welcome to Phonebook</h1>')
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const person=persons.find(person=>person.id==id)
    if(person)
        response.json(person)
    else
        response.status(404).send("User Not found")
})

app.delete('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const person_del=persons.find(person=>person.id==id)
    if(person_del){
        persons=persons.filter(person=>person.id!=id)
        response.status(204).end()
    }
    else
        response.status(404).send("Already Deleted/no such user")
        
})

app.post('/api/persons',(request,response)=>{
    const body=request.body
    const name=body.name
    const number=body.number

    const new_person={
        name:name,
        number:number,
        id:Math.floor(Math.random()*100)
    }
    let namecheck=persons.find(person=>person.name===new_person.name)

    if(namecheck){
       return response.status(404).end("User already exists")
    }
    if(!name || !number){
        return response.status(404).end("Name or Number is not specified")
    }
    persons=persons.concat(new_person)
    response.json(new_person)
    
})

app.put('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const number=request.body.number
    const update_person=(persons.filter(person=>person.id==id))[0]
    update_person.number=number
    response.json(update_person)
})


app.get('/info',(request,response)=>{
    let now = new Date();
    now= now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    response.send(`<h3>Phone has info for ${persons.length} people</h3>
        <br/><br/>
        <h3>${now}</h3>`)
})

app.use(unknownEndpoint)//Checks all handlers and an endpoint apart from them is made then it is executed

const PORT=5004
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
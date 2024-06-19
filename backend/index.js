const express=require('express')
const Person=require('./models/person')
require('dotenv').config()
const morgan=require('morgan')
const app=express()

const cors=require('cors')
app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

//Middleware used for handling response and requests
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

  const errorHandler=(error,request,response,next)=>{

    console.log(error.message)
    if(error.name==='CastError')
        return response.status(404).send({error:"Malformatted id"})
    else if(error.name==='ValidationError')
        return response.status(400).json({error:error.message})

    next(error)
  }
  
  
app.use(requestLogger)




app.get('/',(request,response)=>{
    response.send('<h1>Welcome to Phonebook</h1>')
})

app.get('/api/persons',(request,response)=>{

    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

app.get('/api/persons/:id',(request,response,next)=>{
    const id=request.params.id
    Person.findById(id).then(person=>{
        if(person)
            response.json(person)
        else
            response.status(404).send({error:"Person not found"})
    })
    .catch(error=>next(error))
    
})

app.delete('/api/persons/:id',(request,response,next)=>{
    const id=request.params.id
    //const person_del=persons.find(person=>person.id==id)
    Person.findOneAndDelete({_id:id}).then(deletedperson=>{
        if(deletedperson)
            response.status(204).end()
        else
            response.status(404).send("Person doesnt exist/Person Already Deleted")
    })
    .catch(error=>next(error))
        
})

app.post('/api/persons',(request,response,next)=>{
    const body =request.body
    

    const person=new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson=>{
        response.json(savedPerson)
    })
    .catch(error=>next(error))
    
    
})

app.put('/api/persons/:id',(request,response,next)=>{
    const id=request.params.id
    const number=request.body.number
    
    Person.findById(id).then(person=>{
        person.number=number
        person.save().then(person=>{
            response.json(person)
        })
    })
})

// app.put('/api/persons/:id', (request, response, next) => {

//     const { name,number } = request.body
  
//     Note.findByIdAndUpdate(
//       request.params.id, 
  
//       { name,number },
//       { new: true, runValidators: true, context: 'query' }
//     ) 
//       .then(updatedPerson  => {
//         response.json(updatedPerson)
//       })
//       .catch(error => next(error))
//   })


app.get('/info',(request,response)=>{
    let now = new Date();
    now= now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    response.send(`<h3>Phone has info for ${persons.length} people</h3>
        <br/><br/>
        <h3>${now}</h3>`)
})

app.use(unknownEndpoint)//Checks all handlers and an endpoint apart from them is made then it is executed

app.use(errorHandler)

const PORT=process.env.PORT||5004
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})





























const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery',false)
const url=process.env.MONGODB_URI

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    number:{
        type: String,
        required:true,
        trim:true,
        minlength:1
    }
})
//Transforming objects before sending them
personSchema.set('toJSON',{
    transform:(document,returnedObj)=>{
        returnedObj.id=returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports=mongoose.model('Person',personSchema)
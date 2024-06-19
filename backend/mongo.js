const mongoose=require('mongoose')


if (process.argv.length<3){
    console.log('give password as arg');
    process.exit(1)
}

const password=process.argv[2]
const url=`mongodb+srv://user_admin:${password}@atlascluster.i8srvhz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=AtlasCluster`
console.log(password)

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema=new mongoose.Schema({
    name:String,
    number:String
})

const Person=mongoose.model('Person',personSchema)
if(process.argv[3] && process.argv[4]){
    const person=new Person({
        name: process.argv[3],
        number:process.argv[4],
    })
    
    person.save().then(result=>{
        console.log(result);
        mongoose.connection.close()
    })
    console.log(`added ${person.name} to phonebook`);
}

else{
    Person.find({}).then(res=>{
        console.log('PhoneBook');
        res.forEach(person=>{
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close()
    })
}


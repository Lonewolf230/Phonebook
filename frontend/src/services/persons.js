

import axios from "axios";
const url="http://localhost:3001/api/persons"

 async function getAll(){

    const request= axios.get(url)
    return request.then(response=>response.data)
}

async function create(newObject){
    const request= axios.post(url,newObject)
    return request.then(response=>response.data)
}

async function update(id,updatedObject){
    const request= axios.put(`url/${id}`,updatedObject)
    return request.then(response=>response.data)
}

export {getAll,update,create}
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'


const create = (newObj) => (
    axios.post(baseUrl, newObj)
)

const del = (id) => (
    axios.delete(`${baseUrl}/${id}`)
)

const replace = (id, newObj) => (
    axios.put(`${baseUrl}/${id}`, newObj)
)


export default {
    create,
    del, 
    replace
}

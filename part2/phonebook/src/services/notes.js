import axios from 'axios'
const baseUrl = '/api/persons'


const create = (newObj) => (
    axios.post(baseUrl, newObj)
)

const del = (id) => (
    axios.delete(`${baseUrl}/${id}`)
)

const replace = (id, newObj) => (
    axios.put(`${baseUrl}/${id}`, newObj)
)

const get = () => (
    axios.get(baseUrl)
)


export default {
    get,
    create,
    del, 
    replace
}

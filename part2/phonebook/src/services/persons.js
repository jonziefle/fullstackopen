import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getEntries = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addEntry = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteEntry = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const updateEntry = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }

const exportedObject = {getEntries, addEntry, deleteEntry, updateEntry}
export default exportedObject
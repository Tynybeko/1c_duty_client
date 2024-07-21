
import axios from 'axios'
import Cookies from 'js-cookie'


const URL = 'https://backapp.gbaza.ru'

const API = axios.create({
    baseURL: URL,
    timeout: 3500
})


API.interceptors.request.use((config) => {
    const tokent = Cookies.get('authToken')
    if (tokent) {
        config.headers.set('authToken', tokent)
    }
    return Promise.resolve(config)
}, (error) => {
    return Promise.reject(error)
})



API.interceptors.response.use((fullfiled) => {
    return Promise.resolve(fullfiled)
}, (error) => {
    const token = Cookies.get('authToken')
    if (error.response && error.response.status === 401 && token) {
        Cookies.remove('authToken')
        window.location.replace('/login')
    }
    return Promise.reject(error)
})




export default API
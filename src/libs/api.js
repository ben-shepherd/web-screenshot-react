import axios from 'axios'
import config from '../config';

export const sendPingRequest = async() => {
    try {
        return await axios.get(config.api_url + 'ping')
    }
    catch (err) {
        return err
    }
}
export const webshot = async(url) => {

    try {
        return await axios.post(config.api_url + 'snap', {
            params: {url}
        })
    }
    catch (err) {
        return err.response    
    }
}

export const saveFile = async(url, image_url, category) => {
    try {

        const params = { url, image_url, category }
        return await axios.post(config.api_url + 'save', params)
    }
    catch (err) {
        console.log('Error on SaveFile:', err)
        return err
    }
}

export const getFiles = async(category) => {
    try {
        return await axios.post(config.api_url + 'get', {category})
    }
    catch (err) {
        console.log('Error on getFiles:', err)
        return err
    }
}

export const deleteFile = async(id) => {
    try {
        return await axios.post(config.api_url + 'delete', {id})
    }
    catch (err) {
        console.log('Error on deleteFile', err)
    }
}
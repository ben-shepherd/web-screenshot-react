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
        return await axios.get(config.api_url + 'snap', {
            params: {url}
        })
    }
    catch (err) {
        return err.response    
    }
}
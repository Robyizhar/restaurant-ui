import axios from 'axios';
import { config } from '../config';

export async function registerUser(data){
    return await axios.post(`${config.api_host}/register`, data);
}

export async function login(email, password){
    return await axios.post(`${config.api_host}/login`, {email, password});
}

export async function logout(){
    let { token } = localStorage.getItem('auth')
        ? JSON.parse(localStorage.getItem('auth')) : {};
    return await axios.post(`${config.api_host}/logout`, null, {
        headers: {
            authorization: `Bearer ${token}`
        }
    }).then((response) => {
        localStorage.removeItem('auth');
        return response;
    });
}
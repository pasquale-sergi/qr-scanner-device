import axios from 'axios';

const API_URL = 'http://addressip:8080/api/auth';

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type': 'application/json',
    },
});

export const login = async (username, password) =>{
    console.log('Attempting to login with username:', {username});
    try{
        console.log('Sending request to:', `${API_URL}/signin`);

        const response = await api.post('/signin', {
            username, 
            password,
        });
        console.log('Login response:', response.data);

        return response.data;
    }catch(error){
        throw error;
    }
};

export const signup = async (email, username, password) =>{
    console.log("******************\nSending data to sign up new user: ", email, username,password);

    try{
        const response = await api.post('/signup', {
            email, 
            username,
            password,
        });

        console.log("Received from backend data: ", response.data);
        const data = response.data;

        const userInfo = {
            id: data.id,
            username: data.username,
            email: data.email,
        }
        return userInfo;
    }catch(error){
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const setAuthToken = (token) => {
    if(token){
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Set auth token:', `Bearer ${token}`);

    }else {
        delete api.defaults.headers.common['Authorization'];
        console.log('Cleared auth token');

    }
};
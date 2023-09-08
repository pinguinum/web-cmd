import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export async function sendCommand(command) {
    try {
        const response = await api.post('/command', {command});
        return response.data;
    } catch (error) {
        throw error;
    }
}

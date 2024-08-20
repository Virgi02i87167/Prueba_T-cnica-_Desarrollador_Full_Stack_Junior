import axiosInstance from "../lib/axiosInstace";
import { Task } from '../types';

export const getTasks = async () => {
    const response = await axiosInstance.get('/tasks');
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>) => {
    const response = await axiosInstance.post('/tasks', task);
    return response.data;
};

export const updateTask = async (id: number, task: Partial<Omit<Task, 'id'>>) => {
    try {
        const response = await axiosInstance.put(`/tasks/${id}`, task);
        return response.data;
    } catch (error: any) {
        console.error('Error updating task:', error.message);
        console.error('Error details:', error.response?.data);
        throw error;
    }
};


// taskService.ts
export const deleteTask = async (id: number) => {
    try {
        if (id === undefined || id === null) {
            throw new Error('El ID de la tarea es inválido.');
        }
        await axiosInstance.delete(`/tasks/${id}`);
    } catch (error: any) {
        console.error('Error deleting task:', error.message);
        if (error.response) {
            console.error('Server responded with:', error.response.data);
        } else {
            console.error('Error details:', error.message);
        }
        throw error; // Opcionalmente, puedes volver a lanzar el error para que el llamador también lo maneje
    }
};

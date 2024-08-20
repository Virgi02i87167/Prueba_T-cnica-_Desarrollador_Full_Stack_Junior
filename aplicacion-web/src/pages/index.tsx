// pages/index.tsx
import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../services/taskService';
import { Task } from '../types';
import { Button, TextField, Container, List, ListItem, ListItemText, Checkbox, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [editTask, setEditTask] = useState<Task | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await getTasks();
            setTasks(tasks);
        };
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        if (newTaskTitle.trim()) {
            const newTask = await createTask({ title: newTaskTitle, completed: false });
            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
        }
    };

    const handleUpdateTask = async (task: Task) => {
        const updatedTask = await updateTask(task.id, { completed: !task.completed });
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleEditTask = (task: Task) => {
        setEditTask(task);
        setNewTaskTitle(task.title);
    };

    const handleSaveEdit = async () => {
        if (editTask && newTaskTitle.trim()) {
            const updatedTask = await updateTask(editTask.id, { title: newTaskTitle });
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setEditTask(null);
            setNewTaskTitle('');
        }
    };

    const handleDeleteTask = async (id: number) => {
        console.log('ID recibido para eliminar:', id); // Depuración del ID
        if (id === undefined || id === null || isNaN(id)) {
            console.error('ID inválido:', id);
            return;
        }
    
        try {
            await deleteTask(id);
        } catch (error) {
            console.error('Error al manejar la eliminación de la tarea:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Task Manager</Typography>
            <TextField
                label="New Task"
                variant="outlined"
                fullWidth
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={editTask ? handleSaveEdit : handleCreateTask}>
                {editTask ? 'Actualizar' : 'Guardar Tarea'}
            </Button>
            <List>
                {tasks.map(task => (
                    <ListItem key={task.id}>
                        <Checkbox
                            edge="start"
                            checked={task.completed}
                            onChange={() => handleUpdateTask(task)}
                            inputProps={{ 'aria-label': 'complete task checkbox' }} 
                        />
                        <ListItemText primary={task.title} />
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditTask(task)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}
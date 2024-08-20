import express, { Request, Response } from 'express';
import { Tasks } from './Task';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001',
}));

let tasks: Tasks[] = []

app.get('/', (req: Request, res: Response) => {
    res.send('Api de Tareas')
})

// Creacion de una nueva tarea
app.post('/tasks', (req: Request, res: Response) => {
    const { title } = req.body;
    const newTask: Tasks = {
        id: tasks.length + 1,
        title,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask)
});

// Lectura de  todas las tareas
app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks)
});


// lectura de una tarea por ID
app.get('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
});

// Actualizacion de una tarea por ID
app.put('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.title = title || task.title;
    task.completed = completed !== undefined ? completed : task.completed;

    res.json(task);
});

// Eliminar una tarea por ID
app.delete('/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

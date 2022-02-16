import { Task } from "../entity/task";

export class TaskService {
    public async getAllTasks(): Promise<Task[]> {
        return Task.find({});
    }

    public async createTask(title: string, body: string) {
        const task = new Task();
        task.title = title;
        task.body = body;
        task.isDone = false;
        return task.save();
    }

    public async findTaskById(id: number) {
        return Task.findOne({ where: { id } });
    }

    public async deleteTask(id: number) {
        return Task.delete(id);
    }
}

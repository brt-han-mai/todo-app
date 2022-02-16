import { TaskController } from '../controllers/task.controller';
import { AbstractRouter } from './router.abstract';

export class TaskRouter extends AbstractRouter {
    private _controller = new TaskController();

    protected _configure(): void {
        this._router.get('/all', this._controller.getAllTasks);
        this._router.post('/create', this._controller.createOneTask);
        this._router.delete('/delete/:id', this._controller.deleteTask);
    }
}

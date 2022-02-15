import { RequestHandler } from 'express';
import { TaskService } from '../services/task.service';
import { BaseController } from './base-controller.abstract';
import { EErrorCode } from './error-code.enum';

export class TaskController extends BaseController {
    public getAllTasks: RequestHandler = async (req, res) => {
        try {
            const service = new TaskService();
            const tasks = await service.getAllTasks();
            res.status(200).json(this.makeOkResponse(undefined, tasks));
        } catch (ex) {
            res.status(500).json(this.makeNegativeResponse(EErrorCode.COMMON_INTERNAL_ERROR, "Internal server error"));
        }
    };

    public createOneTask: RequestHandler = async (req, res) => {
        try {
            const { title, body } = req.body as { title: string, body: string };

            if (!title) {
                return res.status(400).json(this.makeNegativeResponse(EErrorCode.TASK_MISSING_TITLE,
                    "Title is missing"));
            }

            if (!body) {
                return res.status(400).json(this.makeNegativeResponse(EErrorCode.TASK_MISSING_BODY,
                    "Body is missing"));
            }

            const service = new TaskService();
            const task = await service.createTask(title, body);
            res.status(201).json(this.makeOkResponse(undefined, task));
        } catch (ex) {
            res.status(500).json(this.makeNegativeResponse(EErrorCode.COMMON_INTERNAL_ERROR, "Internal server error"));
        }
    };

    public deleteTask: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params as { id: string };

            if (!id) {
                return res.status(400).json(this.makeNegativeResponse(EErrorCode.TASK_MISSING_ID,
                    "ID is missing"));
            }

            const service = new TaskService();
            const task = await service.findTaskById(Number(id));
            if (!task) {
                return res.status(404).json(this.makeNegativeResponse(EErrorCode.TASK_NOT_FOUND,
                    "Task is not found"));
            }

            await service.deleteTask(task.id);

            res.status(200).json(this.makeOkResponse());
        } catch (ex) {
            res.status(500).json(this.makeNegativeResponse(EErrorCode.COMMON_INTERNAL_ERROR, "Internal server error"));
        }
    };
}

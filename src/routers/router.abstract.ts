import { Router } from "express";

export abstract class AbstractRouter {
    protected _router = Router();
    protected _configured = false;

    public getRouter(): Router {
        return this._router;
    }

    public configure(): AbstractRouter {
        if (this._configured) {
            return this;
        }

        this._configure();
        this._configured = true;
        return this;
    }

    // Override this function in the derived class to configure the router
    protected abstract _configure(): void;
}

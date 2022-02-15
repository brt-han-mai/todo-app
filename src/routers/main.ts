import { Router, json, urlencoded } from 'express';
import { TaskRouter } from './task.router';
import { AbstractRouter } from './router.abstract';

interface IRouteInfo {
    path: string;
    router: AbstractRouter;
};

// Specify the sub routers info here:
const SUB_ROUTER_INFO_LIST: IRouteInfo[] = [
    { path: "/task", router: new TaskRouter() },
];

export class MainRouter {
    private _router = Router();
    private _subRouters: IRouteInfo[] = [];
    private configured = false;

    public getRouter(): Router {
        return this._router;
    }

    public configure(): MainRouter {
        if (this.configured) {
            return this;
        }

        this._router.use(json()) // for parsing application/json
        this._router.use(urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

        this._subRouters = SUB_ROUTER_INFO_LIST;
        this._subRouters.forEach(r => {
            const router = r.router.configure().getRouter();
            this._router.use(r.path, router)
        });

        this.configured = true;
        return this;
    }
}

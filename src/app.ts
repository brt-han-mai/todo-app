import dotenv from 'dotenv';
import express from 'express';
import { MainRouter } from './routers/main';
import { DbService } from './services/db.service';

// load the environment variables from the .env file
dotenv.config({
    path: '.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
    private dbInit = false;
    public app = express();
    public router = new MainRouter().configure().getRouter();

    public async start() {
        process.on("SIGINT", this.stop.bind(this));

        // initialize Db
        await DbService.start();
        this.dbInit = true;

        // initialize server app
        const server = new Server();
        server.app.use('/api', server.router);

        // make server listen on some port
        const port = process.env.APP_PORT || 5000;
        server.app.listen(port, () => { /**/ });
    }

    public async stop() {
        if (this.dbInit) {
            return DbService.stop();
        }
        process.off("SIGINT", this.stop.bind(this));
    }
}

const server = new Server();
server.start();

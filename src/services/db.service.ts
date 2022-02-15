import { Connection, createConnections } from "typeorm";

export class DbService {
    public static connections: Connection[] = [];
    public static async start() {
        DbService.connections = await createConnections();
    }
    public static async stop() {
        for (const connection of DbService.connections) {
            await connection.close();
        }
    }
}

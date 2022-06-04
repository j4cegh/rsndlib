import { WebSocket } from "ws"

class Database {
    ws: WebSocket;
    queue = [];

    constructor(url) {
        this.ws = new WebSocket(url);

        this.ws.on("message", data => {
          if (this.queue.length === 0) return
          this.queue.shift()(data)
        })
    }

    connect() {
        return new Promise((resolve) => {
            this.ws.on("open", () => {
                resolve(null);
            });
        })
    }

    get(tableName, select, key, value) {
        return new Promise((resolve) => {
            this.queue = [...this.queue, resolve];

            this.ws.send(JSON.stringify({
                Type: "GetValue",
                TableName: tableName,
                Select: select,
                Key: key,
                Value: value
            }));
        });
    }
    set(tableName, key, value) {
        return new Promise((resolve) => {

            this.ws.send(JSON.stringify({
                Type: "SetValue",
                TableName: tableName,
                Key: key,
                Value: value
            }));
            resolve(null);
        });
    }
    add(tableName, key, value) {
        return new Promise((resolve) => {
            this.ws.send(JSON.stringify({
                Type: "AddToTable",
                TableName: tableName,
                Columns: [
                    {
                        Name: key,
                        Value: value
                    }
                ]
            }));

            resolve(null);
        });
    }
}
module.exports = Database;
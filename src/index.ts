import { RawData, WebSocket } from "ws"

export class Database {
    ws: WebSocket;
    queue: ((data: RawData) => void)[] = [];

    constructor(url: string) {
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

    get(tableName: string, select: string, key: string, value: string) {
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
    set(tableName: string, key: string, value: string) {
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
    add(tableName: string, key: string, value: string) {
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
    addRow(tableName: string, columns: { [key: string]: string }) {
        return new Promise((resolve) => {
            this.ws.send(JSON.stringify({
                Type: "AddToTable",
                TableName: tableName,
                Columns: Object.keys(columns).map(key => ({
                    Name: key,
                    Value: columns[key]
                }))
            }));
            resolve(null);
        });
    }

    createTable(tableName: string) {
        return new Promise((resolve) => {
            this.ws.send(JSON.stringify({
                Type: "CreateTable",
                TableName: tableName,
                Rows: []
            }));
            resolve(null);
        });
    }
}
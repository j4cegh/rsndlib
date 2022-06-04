const WS = require("ws")

class Database {
    constructor(url) {
        this.ws = new WS(url);
        this.queue = []

        this.ws.on("message", data => {
          if (this.queue.length === 0) return
          this.queue.shift()(data)
        })
    }

    connect() {
        return new Promise((resolve) => {
            this.ws.on("open", () => {
                resolve();
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

            resolve();
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

            resolve();
        });
    }
}
module.exports = Database;
export = Database;
declare class Database {
    constructor(url: any);
    ws: WebSocket;
    queue: void[];
    connect(): Promise<any>;
    get(tableName: string, select: string, key: string, value: string): Promise<string>;
    set(tableName: string, key: string, value: string): Promise<string>;
    add(tableName: string, key: string, value: string): Promise<string>;
}
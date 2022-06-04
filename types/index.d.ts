export {Database};
declare class Database {
    constructor(url: any);
    ws: any;
    queue: any[];
    connect(): Promise<any>;
    get(tableName: any, select: any, key: any, value: any): Promise<any>;
    set(tableName: any, key: any, value: any): Promise<any>;
    add(tableName: any, key: any, value: any): Promise<any>;
}

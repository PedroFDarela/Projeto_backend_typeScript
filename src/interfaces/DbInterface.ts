export default interface Db{
    connectDB(msgSuccess?: string): Promise<void>;
    disconnectDB(): Promise<void>;
    connectionCloseDB(): Promise<void>;
    isEmpty(): Promise<boolean>;
    dropDB(): Promise<void>;
}
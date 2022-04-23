import mongoose from "mongoose";
import Interface from "../interfaces/DbInterface";

class DataBase implements Interface{
    async connectDB(msgSuccess?: string): Promise<void> {
        try {
            await mongoose.connect(`${process.env.DB_URL}`);
            mongoose.Promise = global.Promise;
        } catch (e: any) {
            console.log({
                msg: "Erro ao Conectar Banco!",
                error: e
            })
            process.exit(1);
        }
    }

    async disconnectDB(): Promise<void> {
        await mongoose.disconnect();
    }

    async connectionCloseDB(): Promise<void> {
        await mongoose.connection.close();
    }

    async isEmpty(): Promise<boolean> {

        const collections = await mongoose.connection.db.collections()
        if (collections.length === 0) {
            return true;
        } 
        return false;
    }

    async dropDB(): Promise<void> {
        await mongoose.connection.db.dropDatabase();
    }

}

export default DataBase;












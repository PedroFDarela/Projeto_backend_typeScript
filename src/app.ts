
import * as dotenv from "dotenv";
dotenv.config({
    path: process.env.NODE_ENV === "test" ? __dirname+"/../.env.test" : __dirname+"/../.env"
});

import express, {Express} from "express";
import routes from "./routes";
import Interface from "./interfaces/AppInterface";

class App implements Interface{
    public express: Express;

    constructor(){
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares():void{
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true}));
    }

    routes():void{
        this.express.use(routes);
    }
    
}

export default App;
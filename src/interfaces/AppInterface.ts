import {Express} from "express";

export default interface App{

    express: Express;
    middlewares():void;
    routes():void;
}
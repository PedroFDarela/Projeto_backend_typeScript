import { Request, Response, NextFunction } from "express";
import {ValidationChain } from "express-validator";


export default interface Db {
    auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined
    notEmpty(): ValidationChain[]
    typeValidation(): ValidationChain[]
    validate(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>
    querySearch(req: Request, res: Response, next: NextFunction): void
    querySOS(req: Request<unknown, unknown, unknown, any>, res: Response, next: NextFunction): void
}



import { Request, Response } from "express";

export default interface Controler{

    createHero(req: Request, res: Response):Promise<Response<any, Record<string, any>>>;
    authenticateHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findHeroByCodinome(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSearchHeros(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSOSHeros(req: Request<unknown, unknown, unknown, any>, res: Response): Promise<Response<any, Record<string, any>>>;
    removeHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;

}
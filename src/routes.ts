import { Router, Request, Response } from "express";
import Controllers from "./controllers/Controllers";
import Middlewares from "./middlewares/Middlewares";

const HeroControllers: Controllers = new Controllers();
const HeroMiddlewares: Middlewares = new Middlewares();

const router = Router();

router.get('/api/heros', HeroMiddlewares.querySearch,
    HeroControllers.getSearchHeros);

router.get('/api/heros/SOS', HeroMiddlewares.querySOS,
    HeroControllers.getSOSHeros);

router.get('/api/heros/:codinome', HeroControllers.findHeroByCodinome);

router.put('/api/heros/:codinome', HeroMiddlewares.typeValidation(), HeroMiddlewares.validate,
    HeroMiddlewares.auth,
    HeroControllers.updateHero);

router.delete('/api/heros/:codinome', HeroMiddlewares.auth,
    HeroControllers.removeHero);

    ///api/heros/new-hero ???
router.post('/api/new-hero', HeroMiddlewares.notEmpty(), HeroMiddlewares.validate,
    HeroMiddlewares.typeValidation(), HeroMiddlewares.validate,
    HeroControllers.createHero);

    ///api/heros/authenticate ???
router.post('/api/authenticate', HeroControllers.authenticateHero);

router.use(function (req: Request, res: Response) {
    res.status(404).send({ Message: "This route not exists" });
});

export default router;
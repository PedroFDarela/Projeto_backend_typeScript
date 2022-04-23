import { Request, NextFunction, Response } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import jsonwebtoken from "jsonwebtoken";
import heroConfig from "../config/hero.config";
import Interface from "../interfaces/MiddlewareInterface";


class Middlewares implements Interface {

    public auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined {
        const authHeaders = req.headers.authorization;

        if (!authHeaders) return res.status(401).send({ error: "No token provided" });

        const parts = authHeaders.split(" ");

        if (!(parts.length === 2)) return res.status(401).send({ error: "Token error" });

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: "Token malformatted" });

        jsonwebtoken.verify(token, `${process.env.SECRET_JWT}`, (err: any, decoded: any) => {

            if (err) return res.status(401).send({ error: "Invalid token" });

            req.query.userCodinome = decoded.id;
            return next();
        });
    }

    public notEmpty(): ValidationChain[] {
        return [
            body("nome_real")
                .not().isEmpty().withMessage("The field cannot be empty"),
            body("codinome")
                .not().isEmpty().withMessage("The field cannot be empty"),
            body("password")
                .not().isEmpty().withMessage("The field cannot be empty"),
            body("tipo_desastre")
                .not().isEmpty().withMessage("The field cannot be empty"),
            body("cidades")
                .not().isEmpty().withMessage("The field cannot be empty"),
        ];
    };

    public typeValidation(): ValidationChain[] {
        return [
            body("nome_real")
                .if(body("nome_real").exists())
                .isString().withMessage("nome_real tem que ser String."),
            body("codinome")
                .if(body("codinome").exists())
                .isString().withMessage("codinome tem que ser String.")
                .custom((value: String, { req }: { req: any }): boolean => {
                    if (value === req.body.nome_real) {
                        return false;
                    }
                    return true;
                }).withMessage("codinome tem que ser diferente do nome_real."),
            body("password")
                .if(body("password").exists())
                .isString().withMessage("password tem que ser String."),
            body("tipo_desastre")
                .if(body("tipo_desastre").exists())
                .isArray().withMessage("tipo_desastre tem que ser Array."),
            body('tipo_desastre[*]')
                .if(body("tipo_desastre").isArray())
                .isIn(heroConfig.tipo_desastre.enum)
                .withMessage(`escolha entre ${heroConfig.tipo_desastre.enum}`),
            body("cidades")
                .if(body("cidades").exists())
                .isArray().withMessage("cidades tem que ser Array."),
            body('cidades[*]')
                .if(body("cidades").isArray())
                .isIn(heroConfig.cidades.enum)
                .withMessage(`escolha entre ${heroConfig.cidades.enum}`),
            body("trabalho_equipe")
                .if(body("trabalho_equipe").exists())
                .isString().withMessage("trabalho_equipe tem que ser String.")
                .isIn(heroConfig.trabalho_equipe.enum)
                .withMessage(`escolha entre ${heroConfig.trabalho_equipe.enum}`),
        ];
    };

    public validate(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const extractedErrors: object[] = [];
        errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

        return res.status(422).json({
            errors: extractedErrors,
        });
    };

    public querySearch(req: Request, res: Response, next: NextFunction): void {

        req.query.searchQuery = {}
        if (req.query.codinome) req.query.searchQuery.codinome = req.query.codinome;
        if (req.query.tipo_desastre) req.query.searchQuery.tipo_desastre = { $in: req.query.tipo_desastre };
        if (req.query.cidades) req.query.searchQuery.cidades = { $in: req.query.cidades };
        if (req.query.trabalho_equipe) req.query.searchQuery.trabalho_equipe = req.query.trabalho_equipe;

        next();
    }

    public querySOS(req: Request<unknown, unknown, unknown, any>, res: Response, next: NextFunction): void {
        const query = []

        let n_heroes = Math.floor(Math.random() * 3);
        if (req.query.tipo_desastre === "assalto a bancos") {
            n_heroes += 1;
        } else if (req.query.tipo_desastre === "monstros gigantes") {
            n_heroes += 2;
        } else if (req.query.tipo_desastre === "desastres naturais") {
            n_heroes += 3;
        }

        if (n_heroes == 1) {
            query.push({
                $match: {
                    trabalho_equipe: {
                        $in: ['sim', 'não', 'indiferente']
                    }
                }
            });
        } else {
            query.push({
                $match: {
                    trabalho_equipe: {
                        $in: ['sim', 'indiferente']
                    }
                }
            });
        }

        query.push(
            {
                $match: {
                    cidades: {
                        $in: [req.query.cidades]
                    }
                }
            }
        );

        query.push(
            {
                $match: {
                    tipo_desastre: {
                        $in: [req.query.tipo_desastre]
                    }
                }
            }
        );

        query.push(
            {
                $sample: {
                    size: n_heroes
                }
            }
        );

        query.push(
            {
                $project: {
                    _id: 0, codinome: "$codinome"
                }
            }
        );

        req.query.querySOS = query;

        next();
    }
}

export default Middlewares;
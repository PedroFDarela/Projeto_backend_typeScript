import { Request, Response } from "express";
import HeroModel from "../models/Hero";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import Interface from "../interfaces/ControllerInterface";


class Controllers implements Interface {

    public async createHero(req: Request, res: Response):Promise<Response<any, Record<string, any>>> {
        try {
            const data = req.body;
            req.body.tipo_desastre  = [...new Set(req.body.tipo_desastre)];
            req.body.cidades  = [...new Set(req.body.cidades)];
            const hero1 = await HeroModel.find({ codinome: data.codinome })
            
            if (hero1.length !== 0) {
                return res.status(400).json({ error: "Codinome já está sendo usado!" })
            }
            const hero = await HeroModel.create(data);
            hero.password = undefined;

            return res.status(201).json({
                hero, token: jsonwebtoken.sign({ id: hero.codinome }, `${process.env.SECRET_JWT}`, {
                    expiresIn: 60,
                })
            });
        } catch (e: any) {
            console.log("Erro em criar Herói (createHero)!")
            return res.status(500).json({ error: "Problema em criar Herói, tente novamente mais tarde!" });
        }
    }


    public async authenticateHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        const { codinome, password } = req.body

        const hero = await HeroModel.findOne({ codinome }).select("+password");

        if (!hero) {
            return res.status(400).send({ error: "Hero not found!" });
        }

        if (!await bcryptjs.compare(password, hero.password)) {
            return res.status(400).send({ error: "Invalid password!" });
        }

        hero.password = undefined;

        return res.send({
            hero, token: jsonwebtoken.sign({ id: hero.codinome }, `${process.env.SECRET_JWT}`, {
                expiresIn: 60,
            })
        });

    }

    public async findHeroByCodinome(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const codinome = req.params.codinome;
            const hero = await HeroModel.find({ codinome });

            if (hero.length === 0) {
                return res.status(404).json({ error: "O herói não existe." });
            }
            return res.status(200).json(hero);
        } catch (e: any) {
            console.log("Erro em pesquisar herói por codinome (findHeroByCodinome)!");
            return res.status(500).json({ error: "Problema pesquisar Herói, tente novamente mais tarde!" });
        }
    }

    public async getSearchHeros(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        const outro: any = req.query.searchQuery
        try {
            const heros = await HeroModel.find(outro);
            if(heros.length === 0){
                return res.status(404).json({msg: "Nenhum herói encontrado!"});
            }
            return res.status(200).json({heros});
        } catch (e: any) {
            console.log("Erro em listar Heróis(getSearchHeros)!");
            return res.status(500).json({ error: "Problema listar Heróis, tente novamente mais tarde!" });
        }
    }

    public async getSOSHeros(req: Request<unknown, unknown, unknown, any>, res: Response): Promise<Response<any, Record<string, any>>> {

        if (!req.query.tipo_desastre || !req.query.cidades) {
            return res.status(400).send({ error: "Choose a city and a disaster type!" });
        }
        const hero = await HeroModel.aggregate(req.query.querySOS);
        return res.status(200).send({ hero });
    }

    public async removeHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const userCodinome = req.params.codinome;
            // const hero = await HeroModel.findById(id);

            if (req.query.userCodinome !== userCodinome) {
                return res.status(401).json({ error: "Não autorizado!" });
            }

            const hero = await HeroModel.deleteOne({ codinome: userCodinome });

            if (!hero) {
                return res.status(404).json({ error: "O Herói não existe." });
            }


            return res.status(201).json({ msg: "Herói removido com sucesso!" });
        } catch (e: any) {
            console.log("Erro em remover Herói (removeHero)!");
            return res.status(500).json({ error: "Problema remover Herói, tente novamente mais tarde!" });
        }
    }

    public async updateHero(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const codinome = req.params.codinome;
            // const data = req.body
            const hero = await HeroModel.findOne({ codinome }).select("+nome_real");

            if (!hero) {
                return res.status(404).json({ error: "O Hero não existe." });
            }

            if (codinome !== req.query.userCodinome) {
                return res.status(401).json({ error: "Não autorizado!" });
            }

            if (hero.nome_real === req.body.codinome && req.body.nome_real === undefined) {
                return res.status(400).json({ error: "Codinome  e nome_real não podem sem iguais!" });
            }

            req.body.tipo_desastre  = [...new Set(req.body.tipo_desastre)];
            req.body.cidades  = [...new Set(req.body.cidades)];
            const update_hero: any = {}
            if (req.body.codinome) update_hero.codinome = req.body.codinome
            if (req.body.nome_real) update_hero.nome_real = req.body.nome_real
            if (req.body.password) update_hero.password = await bcryptjs.hash(req.body.password, 10);
            if (req.body.tipo_desastre) update_hero.tipo_desastre = req.body.tipo_desastre
            if (req.body.cidades) update_hero.cidades = req.body.cidades
            if (req.body.trabalho_equipe) update_hero.trabalho_equipe = req.body.trabalho_equipe

            const data = await HeroModel.updateOne({ codinome: req.query.userCodinome }, update_hero);
            return res.status(200).json({msg: "Dados Atualizados!"});
        } catch (e: any) {
            console.log("Erro em atualizar herói (getAllHeros)!");
            return res.status(500).json({ error: "Problema em atualizar herói, tente novamente mais tarde!" });
        }
    }
}

export default Controllers;
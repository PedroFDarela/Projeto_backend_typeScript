import App from "../src/app";
import request from "supertest";
import DataBase from "../src/database/dbHeros";
import ModelHero from "../src/models/Hero";
import { body } from "express-validator";

const app = new App().express;
const db = new DataBase();
describe('Desafio', () => {

  beforeAll(async () => {
    await db.connectDB();
    const heros = require("../herosList.json");
    await ModelHero.insertMany(heros);
  });

  afterAll(async () => {
    // await connectDB();
    await db.dropDB();
    await db.connectionCloseDB();
  });

  it('Cadastro de herói sendo realizado com sucesso:', async () => {
    let res = await request(app).post('/api/new-hero')
      .send({
        "nome_real": "nome1",
        "password": "1234567",
        "codinome": "codinome1",
        "tipo_desastre": ["assalto a bancos"],
        "cidades": ["New York", "Rio de Janeiro"],
        "trabalho_equipe": "sim"
      });
    expect(res.body.hero.hasOwnProperty("_id")).toBe(true);
    expect(res.body.hero.hasOwnProperty("nome_real")).toBe(true);
    expect(res.body.hero.hasOwnProperty("codinome")).toBe(true);
    expect(res.body.hero.hasOwnProperty("tipo_desastre")).toBe(true);
    expect(res.body.hero.hasOwnProperty("cidades")).toBe(true);
    expect(res.body.hero.hasOwnProperty("trabalho_equipe")).toBe(true);
    expect(res.body.hero.hasOwnProperty("password")).toBe(false);
    expect(res.body.hasOwnProperty("hero")).toBe(true);
    expect(res.body.hasOwnProperty("token")).toBe(true);
    expect(res.statusCode).toEqual(201);
  });


  it('Cadastro de herói falhando em caso de codinome igual ao nome real:', async () => {
    let res = await request(app).post('/api/new-hero')
      .send({
        "nome_real": "codinome2",
        "password": "1234567",
        "codinome": "codinome2",
        "tipo_desastre": ["assalto a bancos"],
        "cidades": ["New York", "Rio de Janeiro"],
        "trabalho_equipe": "sim"
      });

    expect(res.statusCode).toEqual(422);
  });

  it('Cadastro de herói falhando em caso de coninome duplicado:', async () => {

    let res = await request(app).post('/api/new-hero')
      .send({
        "nome_real": "nome2",
        "password": "1234567sdf",
        "codinome": "codinome1",
        "tipo_desastre": ["assalto a bancos"],
        "cidades": ["New York", "Rio de Janeiro"],
        "trabalho_equipe": "sim"
      });
    expect(res.statusCode).toEqual(400);
  });

  it('Recuperação de herói sendo realizada com sucesso e não retornando seu nome real:', async () => {

    let res = await request(app).get('/api/heros/codinome1');
    expect(res.body[0].hasOwnProperty("nome_real")).toBe(false);
    expect(res.body[0].hasOwnProperty("codinome")).toBe(true);
    expect(res.body[0].hasOwnProperty("tipo_desastre")).toBe(true);
    expect(res.body[0].hasOwnProperty("cidades")).toBe(true);
    expect(res.body[0].hasOwnProperty("trabalho_equipe")).toBe(true);
    expect(res.body[0].hasOwnProperty("password")).toBe(false);
    expect(res.statusCode).toEqual(200);
  });


  it('Recuperação de herói falhando em caso de inexistência do herói com o codinome:', async () => {

    const res = await request(app).get('/api/heros/codinome5');
    expect(res.statusCode).toEqual(404);
  });


  it('Testes com os possíveis tipos de query(1):', async () => {
    const res = await request(app).get('/api/heros').query({
      tipo_desastre: ["monstros gigantes"],
      cidades: ["Rio de Janeiro"]
    });
    expect(res.body.heros.length).toEqual(1);
    expect(res.statusCode).toEqual(200);
  });

  it('Testes com os possíveis tipos de query(2):', async () => {
    const res = await request(app).get('/api/heros').query({ cidades: ["Rio de Janeiro"] });
    expect(res.body.heros.length).toEqual(3);
    expect(res.statusCode).toEqual(200);
  });

  it('Testes com os possíveis tipos de query(3):', async () => {
    const res = await request(app).get('/api/heros').query({});
    expect(res.body.heros.length).toEqual(8);
    expect(res.statusCode).toEqual(200);
  });

  it('Testes com os possíveis tipos de query(4):', async () => {
    const res = await request(app).get('/api/heros').query({
      tipo_desastre: ["monstros gigantes"],
      cidades: ["New York"],
      trabalho_equipe: "indiferente"
    });
    expect(res.body.heros.length).toEqual(4);
    expect(res.statusCode).toEqual(200);
  });

  it('Testes com os possíveis tipos de query(5):', async () => {
    const res = await request(app).get('/api/heros').query({
      cidades: ["Rio de Janeiro"],
      trabalho_equipe: "não"
    });
    expect(res.statusCode).toEqual(404);
  });

  it('Atualização de herói sendo realizada com sucesso:', async () => {
    let res = await request(app).post('/api/new-hero')
      .send({
        "nome_real": "nome4",
        "password": "1234567o",
        "codinome": "codinome4",
        "tipo_desastre": ["assalto a bancos", "assalto a bancos", "assalto a bancos"],
        "cidades": ["New York", "Rio de Janeiro", "Rio de Janeiro"]
      });

    res = await request(app).put('/api/heros/codinome4')
      .set({ Authorization: `Bearer ${res.body.token}` })
      .send({ "codinome": "codinome_atualizado" })


    expect(res.body.msg).toBe('Dados Atualizados!');
    expect(res.statusCode).toEqual(200);
  });

  it('Remoção de herói sendo realizada com sucesso:', async () => {
    let res = await request(app).post('/api/new-hero')
      .send({
        "nome_real": "nome5",
        "password": "1234567o",
        "codinome": "codinome5",
        "tipo_desastre": ["assalto a bancos", "assalto a bancos", "assalto a bancos"],
        "cidades": ["New York", "Rio de Janeiro", "Rio de Janeiro"]
      });

    expect(res.statusCode).toEqual(201);

    res = await request(app).delete('/api/heros/codinome5').set({ Authorization: `Bearer ${res.body.token}` });

    expect(res.body.msg).toBe('Herói removido com sucesso!');
    expect(res.statusCode).toEqual(201);
  });

  it('Testando o chamado de ajuda:', async () => {

    let res = await request(app).get('/api/heros/SOS').query({
      tipo_desastre: "monstros gigantes",
      cidades: "Rio de Janeiro"
    });

    expect(res.body.hero.length).not.toEqual(0);
    expect(res.statusCode).toEqual(200);

  });



});
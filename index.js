/*
PSS Trabalho 01
Wellington Ribeiro Lara
João Gabriel Silveira Costa
Gustavo dos Santos Bezerra

Tema: Songs/Musica
*/

import { fastify } from "fastify";
import { dataBase } from "./dataBaseMemory.js";
import { request } from "http";

const server = fastify();

dataBase = new DatabaseMemory();


server.get('/musicas', (request)=>{
    const search = request.query.search;

    const musicas = dataBase.list(search);

    return musicas;
});

server.post('/musicas', (request, reply) =>{
    const { nome, autor, compositor,  }
});
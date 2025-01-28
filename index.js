/*
PSS Trabalho 01
Wellington Ribeiro Lara
João Gabriel Silveira Costa
Gustavo dos Santos Bezerra

Tema: Streaming de Músicas/"Songs"
*/

import { fastify } from "fastify";
import { dataBaseMemory } from "./dataBaseMemory.js";
import { request } from "http";

const server = fastify();

const dataBase = new dataBaseMemory();


server.get('/songs', (request) => {
    const search = request.query.search;

    const songs = dataBase.list(search);

    return songs;
});

server.post('/songs', (request, reply) => {
    const { nome, autor, compositor, álbum, estilo, produtor } = request.body;

    dataBase.create({
        nome: nome,
        autor: autor,
        compositor: compositor,
        álbum: álbum,
        estilo: estilo,
        produtor: produtor
    });

    return reply.status(201).send();
});

server.put('/songs/:id', (request, reply) => {
    return reply.status(204).send()
});

server.patch('/songs/:id', (request, reply) => {
    return reply.status(204).send()
});

server.delete('/songs/:id', (request,reply) => {
    return reply.status(204).send()
});

server.listen({
    port: 3333,
});
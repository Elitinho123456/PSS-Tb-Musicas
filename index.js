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

    return songs

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

    const songId = request.params.id;

    const { nome, autor, compositor, álbum, estilo, produtor } = request.body;
    const song = dataBase.update(songId, {
        nome,
        autor,
        compositor,
        álbum,
        estilo,
        produtor
    });

    return reply.status(204).send();

});

server.patch('/songs/:id', (request, reply) => {

    const songId = request.params.id;
    const update = request.body;

    const OnMusics = dataBase.getById(songId);
    if (!OnMusics) {
        return reply.status(404).send({ message: 'Music not found.' })
    };

    const upMusics = { ...OnMusics, ...update };

    dataBase.update(songId, upMusics);

    return reply.status(204).send();

});

server.delete('/songs/:id', (request,reply) => {

    const songId = request.params.id;
    dataBase.delete(songId);
    
    return reply.status(204).send();

});

server.listen({
    port: 3333,
});
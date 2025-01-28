/*

PSS Trabalho 02
Wellington Ribeiro Lara
João Gabriel Silveira Costa
Gustavo dos Santos Bezerra

Tema: Streaming de Músicas/"Songs"

*/

import { fastify } from "fastify"; // Importa o framework Fastify para criar o servidor
import { dataBaseMemory } from "./dataBaseMemory.js"; // Importa a classe dataBaseMemory do arquivo dataBaseMemory.js, responsável pela manipulação dos dados em memória

const server = fastify(); // Cria uma instância do servidor Fastify

const dataBase = new dataBaseMemory(); // Cria uma instância da classe dataBaseMemory, inicializando o "banco de dados" em memória

// Rota GET /songs: Retorna a lista de músicas
server.get('/songs', (request) => {
    try {

        const search = request.query.search; // Obtém o parâmetro de busca "search" da query string da requisição
        const songs = dataBase.list(search); // Chama o método list da classe dataBaseMemory para obter a lista de músicas, filtrada pelo parâmetro de busca (se fornecido)

        return songs; // Retorna a lista de músicas como resposta

    } catch (error) {

        console.error("Error in GET /songs:", error); // Imprime o erro no console para depuração
        return { error: "Failed to retrieve songs." }; // Retorna um objeto com a mensagem de erro

    }
});

// Rota POST /songs: Cria uma nova música
server.post('/songs', (request, reply) => {
    try {

        const { nome, autor, compositor, álbum, estilo, produtor } = request.body; // Obtém os dados da música do corpo da requisição

        dataBase.create({ // Chama o método create da classe dataBaseMemory para criar a nova música
            nome,
            autor,
            compositor,
            álbum,
            estilo,
            produtor
        });

        return reply.status(201).send(); // Retorna uma resposta com status 201 (Created) indicando sucesso na criação

    } catch (error) {

        console.error("Error in POST /songs:", error); // Imprime o erro no console para depuração
        return reply.status(500).send({ error: "Failed to create song." }); // Retorna uma resposta com status 500 (Internal Server Error) e a mensagem de erro

    }
});

// Rota PUT /songs/:id: Atualiza uma música existente
server.put('/songs/:id', (request, reply) => {
    try {

        const songId = request.params.id; // Obtém o ID da música da URL
        const { nome, autor, compositor, álbum, estilo, produtor } = request.body; // Obtém os dados da música do corpo da requisição

        const song = dataBase.update(songId, { // Chama o método update da classe dataBaseMemory para atualizar a música
            nome,
            autor,
            compositor,
            álbum,
            estilo,
            produtor
        });

        return reply.status(204).send(); // Retorna uma resposta com status 204 (No Content) indicando sucesso na atualização

    } catch (error) {

        console.error("Error in PUT /songs/:id:", error); // Imprime o erro no console para depuração
        return reply.status(500).send({ error: "Failed to update song." }); // Retorna uma resposta com status 500 (Internal Server Error) e a mensagem de erro

    }
});

// Rota PATCH /songs/:id: Atualiza parcialmente uma música existente
server.patch('/songs/:id', (request, reply) => {
    try {

        const songId = request.params.id; // Obtém o ID da música da URL
        const update = request.body; // Obtém os dados da música do corpo da requisição, que serão usados para atualização parcial

        const OnMusics = dataBase.getById(songId); // Obtém a música pelo ID
        if (!OnMusics) { // Verifica se a música foi encontrada
            return reply.status(404).send({ message: 'Music not found.' }); // Retorna status 404 se a música não foi encontrada
        };

        const upMusics = { ...OnMusics, ...update }; // Cria um novo objeto com os dados da música original e os dados de atualização

        dataBase.update(songId, upMusics); // Chama o método update para atualizar a música com os dados combinados

        return reply.status(204).send(); // Retorna uma resposta com status 204 (No Content) indicando sucesso na atualização

    } catch (error) {

        console.error("Error in PUT /songs/:id:", error); // Imprime o erro no console para depuração
        return reply.status(500).send({ error: "Failed to update song." }); // Retorna uma resposta com status 500 (Internal Server Error) e a mensagem de erro

    }
});

// Rota DELETE /songs/:id: Deleta uma música existente
server.delete('/songs/:id', (request, reply) => {
    try {

        const songId = request.params.id; // Obtém o ID da música da URL
        const deleted = dataBase.delete(songId); // Chama o método delete da classe dataBaseMemory para deletar a música

        return reply.status(204).send({ message: "Song deleted." }); // Retorna uma resposta com status 204 (No Content) indicando sucesso na exclusão

    } catch (error) {

        console.error("Error in DELETE /songs/:id:", error); // Imprime o erro no console para depuração
        return reply.status(500).send({ error: "Failed to delete song." }); // Retorna uma resposta com status 500 (Internal Server Error) e a mensagem de erro

    }
});

server.listen({ // Inicia o servidor na porta 3333
    port: 3333,
});
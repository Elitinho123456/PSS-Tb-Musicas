/*

PSS Trabalho 02
Wellington Ribeiro Lara
João Gabriel Silveira Costa
Gustavo dos Santos Bezerra

Tema: Streaming de Músicas/"Songs"

*/

import dotenv from 'dotenv';
dotenv.config();
import { fastify } from "fastify";
import { neon } from "@neondatabase/serverless";

const server = fastify();
const sql = neon(process.env.DATABASE_URL);

// Criação da tabela (executar uma vez)

await sql`
  CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    autor TEXT NOT NULL,
    compositor TEXT NOT NULL,
    album TEXT,
    estilo TEXT,
    produtor TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )
`;


// Rotas
server.get("/songs", async (request) => {
    try {
        const { search } = request.query;
        let query = sql`SELECT * FROM songs`;

        if (search) {
            query = sql`${query} WHERE nome ILIKE ${"%" + search + "%"}`;
        }

        const result = await query;
        return result;
    } catch (error) {
        console.error("Error in GET /songs:", error);
        return { error: "Failed to retrieve songs." };
    }
});

server.post("/songs", async (request, reply) => {
    try {
        const { nome, autor, compositor, álbum, estilo, produtor } = request.body;

        await sql`
      INSERT INTO songs (nome, autor, compositor, album, estilo, produtor)
      VALUES (${nome}, ${autor}, ${compositor}, ${álbum}, ${estilo}, ${produtor})
    `;

        return reply.status(201).send();
    } catch (error) {
        console.error("Error in POST /songs:", error);
        return reply.status(500).send({ error: "Failed to create song." });
    }
});

server.put("/songs/:id", async (request, reply) => {
    try {
        const songId = request.params.id;
        const { nome, autor, compositor, álbum, estilo, produtor } = request.body;

        await sql`
      UPDATE songs
      SET 
        nome = ${nome},
        autor = ${autor},
        compositor = ${compositor},
        album = ${álbum},
        estilo = ${estilo},
        produtor = ${produtor}
      WHERE id = ${songId}
    `;

        return reply.status(204).send();
    } catch (error) {
        console.error("Error in PUT /songs/:id:", error);
        return reply.status(500).send({ error: "Failed to update song." });
    }
});

server.patch('/songs/:id', async (request, reply) => {
    try {
        const songId = request.params.id;
        const updateFields = request.body;

        if (!updateFields || Object.keys(updateFields).length === 0) {
            return reply.status(400).send({ error: "No fields to update." });
        }

        // Construir cláusulas SET manualmente
        const setClauses = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updateFields)) {
            setClauses.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }

        // Usar query raw com parâmetros seguros
        await sql(`
        UPDATE songs
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
      `, [...values, songId]);

        return reply.status(204).send();
    } catch (error) {
        console.error("Error in PATCH /songs/:id:", error);
        return reply.status(500).send({
            error: "Failed to update song.",
            details: error.message
        });
    }
});

server.delete("/songs/:id", async (request, reply) => {
    try {
        const songId = request.params.id;

        await sql`
      DELETE FROM songs
      WHERE id = ${songId}
    `;

        return reply.status(204).send({ message: "Song deleted." });
    } catch (error) {
        console.error("Error in DELETE /songs/:id:", error);
        return reply.status(500).send({ error: "Failed to delete song." });
    }
});

server.listen({
    port: 3333,
    host: "0.0.0.0",
}, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Server running at http://localhost:3333");
});
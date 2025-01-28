import { randomUUID } from "node:crypto"; // Importa a função randomUUID do módulo node:crypto para gerar IDs únicos
import { get } from "node:http"; // Importa o módulo node:http (não está sendo usado neste código, pode ser removido)

export class dataBaseMemory { // Define a classe dataBaseMemory, responsável por simular um banco de dados em memória

    #songs = new Map(); // Cria um novo Map privado (#songs) para armazenar as músicas. Maps são estruturas de dados que armazenam pares chave-valor.

    getById(id) { // Método getById: Retorna uma música pelo seu ID
        return this.#songs.get(id); // Usa o método get do Map para obter a música com o ID fornecido
    };

    list(search) { // Método list: Retorna uma lista de músicas, opcionalmente filtrada por um termo de busca
        return Array.from(this.#songs.entries()).map((SongArray) => { // Converte o Map #songs em um array de entradas [chave, valor] e usa map para transformar cada entrada em um objeto de música

            const id = SongArray[0]; // Extrai o ID da música (chave do Map)
            const data = SongArray[1]; // Extrai os dados da música (valor do Map)

            return { // Retorna um novo objeto contendo o ID e os dados da música
                id,
                ...data, // Espalha os dados da música no objeto
            };
        })
            .filter(song => { // Filtra o array de músicas com base no termo de busca (se fornecido)
                if (search) { // Verifica se o termo de busca foi fornecido
                    return song.nome.includes(search); // Retorna true se o nome da música inclui o termo de busca, false caso contrário
                };
                return true; // Se o termo de busca não foi fornecido, retorna true para todas as músicas (inclui todas na lista)
            });
    };

    create(song) { // Método create: Cria uma nova música e a adiciona ao "banco de dados"
        const songID = randomUUID(); // Gera um novo ID único usando randomUUID
        this.#songs.set(songID, song); // Adiciona a música ao Map #songs, usando o ID gerado como chave
    };

    update(id, song) { // Método update: Atualiza uma música existente
        this.#songs.set(id, song); // Atualiza a música no Map #songs, usando o ID fornecido como chave e os novos dados da música como valor
    };

    delete(id) { // Método delete: Deleta uma música existente
        this.#songs.delete(id); // Remove a música do Map #songs, usando o ID fornecido como chave
    };
};
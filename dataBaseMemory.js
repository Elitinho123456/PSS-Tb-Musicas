import {randomUUID} from "node:crypto"
import { get } from "node:http"

export class dataBaseMemory{

    #songs = new Map();

    getById(id){
        return this.#songs.get(id);
    };

    list(search){
        return Array.from(this.#songs.entries()).map((SongArray) => {

            const id = SongArray[0];

            const data = SongArray[1];

            return{
                id,
                ...data,
            };
        })
        
    .filter(song => {
        if(search){
            return song.nome.includes(search)
        };
        return true;
    });
    };

    create(song){
        const songID = randomUUID();
        this.#songs.set(songID, song);
    };

    update(id, song){
        this.#songs.set(id, song)
    };

    delete(id){
        this.#songs.delete(id)
    };
};
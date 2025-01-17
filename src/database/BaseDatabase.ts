import { knex } from "knex"
export abstract class BaseDatabase{
    protected static connection = knex({
    client: "sqlite3",
    connection: {
        filename: "./src/database/poo1.db",
    },
    useNullAsDefault: true,
    pool: { 
        min: 0,
        max: 1,
        afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb)
        }
    }
})

}

/*1- Refatore o arquivo knex.ts para implementar a classe BaseDatabase como foi feito em aula.
Lembre-se de renomear o arquivo também (isso vai gerar bugs, ignore-os comentando o código e vá corrigindo de um em um ao longo dos próximos exercícios).*/
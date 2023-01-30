import express, { Request, Response } from 'express'
import cors from 'cors';
import { db } from './database/knex';
import { Video } from './models/Videos';
import { TVideoDB } from './types';

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
//Busca todos os vídeos
app.get("/videos", async (req: Request, res: Response) => {
    try {
        let videosDB: TVideoDB[] = await db("videos")//videosDB é do tipo TVideoDB do arquivo types
        //1º PASSO- VAR Q OLHA PRA DENTRO DA TABELA VIDEOS DO SQL - videosDB mapeia todos os videos da tabela videos do sql

        //const videos recebe a classe Video no arquivo Videos.ts 
        //mapeia videosDB e passa todos os valores do novo video para videoDB
        const videos: Video[] = videosDB.map((videoDB) =>
            new Video(
                videoDB.id,
                videoDB.title,
                videoDB.duration,
                videoDB.created_at
            )
        )
        res.status(200).send(videos)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
//Posta novo vídeo
app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        //newVideo vai receber os valores de Video p/ serem editados depois
        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )
        //newVideoDB é do tipo TVideoDB e atribui valores aos atributos da tabela newVideo
        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitulo(),
            duration: newVideo.getDuracao(),
            created_at: newVideo.getCreatedAt()
        }
        //Olha a tabela videos no sql e insere newVideoDB
        await db("videos").insert(newVideoDB)
        res.status(201).send(newVideo)


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
//Edita video pelo id
app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const { newId, newTitle, newDuration } = req.body

        //variavel videoMap vai mapear tabela videos do sql e receber id do video que será editado passado na req como param
        const [videoMap] = await db("videos").where({ id: idToEdit })
        //1º PASSO: CONSULTAR TABELA SQL - mapeia o id da tabela videos do SQL

        //variavel newVideo vai receber atributos da tabela Video p/ editar os valores de seus atributos
        const newVideo = new Video(
            newId,
            newTitle,
            newDuration,
            new Date().toISOString()
        )//2º PASSO: CONSULTAR A CLASSE- editar a classe. newVideo recebe e edita os dados da tabela Video da classe

        //variavel newVideoDB recebe os atributos do tipo TVideoDB e define novos valores aos seus atributos 
        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitulo(),
            duration: newVideo.getDuracao(),
            created_at: newVideo.getCreatedAt()
        }//3º PASSO CONSULTAR A TABELA DE TIPOS- atribui novos tipos de acordo com as alteracoes em newVideo

        //se existir o videoMap, ou seja, houver algum video com a id passada no parametro, continue
        if (videoMap) {
            //var upDatedVideo redefine os valores dos atributos id, title e duration de acordo 
            //com os valores de newVideoDB, ou mantém os dados localizados no videoMap
            const upDatedVideo = {
                id: newVideoDB.id || videoMap.id,
                title: newVideoDB.title || videoMap.title,
                duration: newVideoDB.duration || videoMap.duration,
            }
            //olha pra tabela videos da sql, atualiza videos para upDateVideos a partir da id
            await db("videos")
                .update(upDatedVideo)
                .where({ id: idToEdit })
        } else {
            res.status(404)
            throw new Error("Id inválida")
        }
        res.status(201).send(newVideoDB)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
//Deleta video pelo id
app.delete("/videos/:id", async (req:Request, res:Response)=>{
try{    
    //recebe no parametro a id que será deletada
    const idToDelete = req.params.id
    //videoExisting verifica em videos se há alguma id = a idToDelete
    const [videoExisting] = await db("videos").where({id: idToDelete})

    //Se videoExisting for true, prossiga com o metodo del()
    if(videoExisting){
        await db("videos").del().where({id: idToDelete})
    }else{
        res.status(400)
        throw new Error("Id não encontrada")
    } 
}catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})
//Implemente os endpoints GET /videos, POST /videos  PUT /videos/:id e DELETE videos/:id utilizando classes.. <br>

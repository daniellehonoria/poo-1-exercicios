import express, { Request, Response } from 'express'
import cors from 'cors';
import { Video } from './models/Videos';
import { TVideoDB } from './types';
import { VideosDatabase } from './database/VideosDatabase';

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
        // let videosDB: TVideoDB[] = await db("videos")

        const videoDatabase = new VideosDatabase// instanciamento da class VideosDatabase
        const videosDB = await videoDatabase.findVideos()
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
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }
        if (typeof  title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }
        if (typeof  duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser number")
        }
            const videoDatabase = new VideosDatabase()
            const videoDBExists = await videoDatabase.findVideosById(id)

            if (videoDBExists) {
                res.status(400)
                throw new Error("'id' já existe")
            }
        //newVideo vai receber os atributos da classe Video p/ ser copulado
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
        //Olha a tabela videos no sql e insere os dados do body enviados para newVideoDB
        await videoDatabase.insertNewVideo(newVideoDB)

        //a resposta é newVideo q é do tipo newVideoDB
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
        const id = req.params.id
        const { newId, newTitle, newDuration } = req.body

        const videoDatabase = new VideosDatabase()
        const videoDBExists = await videoDatabase.findVideosById(id)
        console.log({videoDBExists})
        if (!videoDBExists) {
            res.status(400)
            throw new Error("'id' não encontrada")
        }
         
          const newVideo = new Video(
            newId || videoDBExists.id,
            newTitle,
            newDuration,
            videoDBExists.created_at     
          )
            const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitulo(),
            duration: newVideo.getDuracao(),
            created_at: newVideo.getCreatedAt()
        }
        console.log(newVideoDB)
        //    const upDatedVideo = {
        //         id: newVideoDB.id || videoDBExists.id,
        //         title: newVideoDB.title || videoDBExists.title,
        //         duration: newVideoDB.duration || videoDBExists.duration,
        //     }
        await videoDatabase.editedToVideo(newVideoDB, id)
        console.log({newVideoDB})
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
//Deleta video pelo id
app.delete("/videos/:id", async (req:Request, res:Response)=>{
try{    
    const id = req.params.id

    const videoDatabase = new VideosDatabase()
    const videoDBExists = await videoDatabase.findVideosById(id)

    //recebe no parametro a id que será deletada
   // const [videoExisting] = await db("videos").where({id: idToDelete})

    //Se videoExisting for true, prossiga com o metodo del()
    if(videoDBExists){
        await videoDatabase.deletedToVideo(id)
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
//Agora crie o arquivo src/database/VideoDatabase.ts e implemente a respectiva classe.
//Refatore o endpoint GET /videos implementando o(s) método(s) público(s) necessários seguindo o que você desenvolveu.
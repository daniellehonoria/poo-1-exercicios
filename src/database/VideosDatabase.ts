import { TVideoDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class VideosDatabase extends BaseDatabase{
    public static TABLE_VIDEOS = "videos"

    public async findVideos(){
        const videosDB: TVideoDB[] = await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        return videosDB
    }
    public async findVideosById(id: string){
        const [videoDB]: TVideoDB[] | undefined[] = await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .where({id})
        console.table(videoDB)
    return videoDB
    }
    public async insertNewVideo(newVideoDB: TVideoDB){
        await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .insert(newVideoDB)
    }

    public async editedToVideo(newVideoDB: TVideoDB, id: string){
        await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .update(newVideoDB)
        .where({id})
    }

    public async deletedToVideo(id: string){
        await BaseDatabase
        .connection(VideosDatabase.TABLE_VIDEOS)
        .del()
        .where({id})
    }
}
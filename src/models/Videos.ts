export class Video{

    constructor(
        private id:string,
        private titulo: string,
        private duracao: number,
        private createdAt: string
    ){}
    public getId():string{
        return this.id
    }
    public getTitulo():string{
        return this.titulo
    }
    public getDuracao():number{
        return this.duracao
    }
    public getCreatedAt():string{
        return this.createdAt
    }


    public setId(value:string):void{
        this.id = value
      }

      public setTitulo(value:string):void{
        this.titulo = value
      }
      public setDuracao(value:number):void{
        this.duracao = value
      }
      public setCreatedAt(value:string):void{
        this.createdAt = value
      }
}

// const video4 = new Video(
//     "v004",
//     "JS aula 4",
//     31,
//     "2023-01-30 15:08:00"

// )
// console.table(video4)

/*## Videos
Será a única entidade da aplicação e deve possuir:
- uma id
- um título
- uma duração em segundos
- a data de upload*/
import { Model, ModelObject } from "objection";
import { ArticlesModel } from "./article.model";

export class CommentModel extends Model {
  id!: number;
  article_id!: number;
  description!: string;

  static get tableName() {
    return "comments";
  }

  static get relationMappings(){
    return{
        article:{
            relation:Model.BelongsToOneRelation,
            modelClass: ArticlesModel,
            join:{
                from: 'comments.article_id',
                to: 'articles.id'
            }
        }
    }
  }
}

export type Comments = ModelObject<CommentModel>;


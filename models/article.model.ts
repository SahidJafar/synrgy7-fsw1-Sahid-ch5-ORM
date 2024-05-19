import { Model, ModelObject } from "objection";
import { CommentModel } from "./comment.model";

export class ArticlesModel extends Model {
  id!: number;
  title!: string;
  body!: string;
  isApproved!: boolean;

  static get tableName() {
    return "articles";
  }

  static get relationMappings(){
    return{
        article:{
            relation:Model.HasManyRelation,
            modelClass: CommentModel,
            join:{
                from: 'article.id',
                to: 'comments.article_id'
            }
        }
    }
  }
}

export type Articles = ModelObject<ArticlesModel>;


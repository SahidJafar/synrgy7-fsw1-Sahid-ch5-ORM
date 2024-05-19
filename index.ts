import express, { Express, Request, Response } from "express";
import knex from 'knex';
import { Model } from 'objection';
import { ArticlesModel } from "./models/article.model";
import { CommentModel } from "./models/comment.model";

// Initialize knex instance
const knexInstance = knex({
  client: "pg",
  connection: {
    user: 'postgres',
    password: '12345678',
    port: 5432,
    host: 'localhost',
    database: 'CH_5_ORM'
  }
});

// Bind the knex instance to Objection's Model
Model.knex(knexInstance);

// Initialize Express app
const app: Express = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (_, res: Response) => {
  res.send("Express + TypeScript Server");
});

/* 
Articles Endpoint
*/
app.get("/articles", async (_, res: Response) => {
  const articles = await ArticlesModel.query();
  res.json({ data: articles });
});

app.get("/articles/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const articles = await ArticlesModel.query().findById(id)

    if (!articles) res.status(404).json({ message: "Data tidak ditemukan!", data:null });
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil ditemukan!`, data: articles });
  } catch (error) {
    res.status(400).json({ message: "Data gagal ditambahkan!", data:null });
  }
});

app.post("/articles", async (req: Request, res: Response) => {
  try {
    const { title, body, isApproved } = req.body;

    // Validate the request body
    if (typeof title !== 'string' || typeof body !== 'string' || typeof isApproved !== 'boolean') {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }

    const articles = await ArticlesModel.query().insert({
      title,
      body,
      isApproved
    });

    res.status(200).json({ message: "Data berhasil ditambahkan!", data: articles });
  } catch (error) {
    res.status(400).json({ message: "Data gagal ditambahkan!", data: null });
  }
});


app.put("/articles/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { title, body, isApproved } = req.body;

    // Validate the request body
    if (typeof title !== 'string' || typeof body !== 'string' || typeof isApproved !== 'boolean') {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }

    const articles = await ArticlesModel.query().patchAndFetchById(id,{
      title,
      body,
      isApproved
    });
    if (!articles) res.status(404).json({ message: "Data tidak ditemukan!", data:null })
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil diubah!`, data: articles });
  } catch (error) {
    res.status(400).json({ message: "Data gagal diubah!", data:null });
  }
});

app.delete("/articles/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
  
    const articles = await ArticlesModel.query().deleteById(id)

    if (!articles) res.status(404).json({ message: "Data tidak ditemukan!", data:null })
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil dihapus!`});
  } catch (error) {
    res.status(400).json({ message: "Data gagal dihapus!", data:null });
  }
});

/* 
Comments Endpoint
*/
app.get("/comments", async (_, res: Response) => {
  const comments = await CommentModel.query().withGraphFetched('article');
  res.json({ data: comments });
});

app.get("/comments/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const comments = await CommentModel.query().findById(id).withGraphFetched('article')

    if (!comments) res.status(404).json({ message: "Data tidak ditemukan!", data:null })
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil ditemukan!`, data: comments });
  } catch (error) {
    res.status(400).json({ message: "Data gagal ditambahkan!", data:null });
  }
});

app.post("/comments", async (req: Request, res: Response) => {
  try {
    const { article_id, description} = req.body;

    // Validate the request body
    if (typeof article_id !== 'number' || typeof description !== 'string') {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }

    // Check if the article_id exists
    const articleExists = await ArticlesModel.query().findById(article_id);
    if (!articleExists) {
      res.status(404).json({ message: "Article ID tidak ditemukan!" });
      return;
    }

    const comments = await CommentModel.query().insert({
      article_id,
      description
    });

    res.status(200).json({ message: "Data berhasil ditambahkan!", data: comments });
  } catch (error) {
    res.status(400).json({ message: "Data gagal ditambahkan!", data:null });
  }
});

app.put("/comments/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { article_id, description} = req.body;

   // Validate the request body
   if (typeof article_id !== 'number' || typeof description !== 'string') {
    res.status(400).json({ message: "Invalid input data" });
    return;
  }

    const comments = await CommentModel.query().patchAndFetchById(id,{
      article_id,
      description
    });

    if (!comments) res.status(404).json({ message: "Data tidak ditemukan!", data:null });
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil diubah!`, data: comments });
  } catch (error) {
    res.status(400).json({ message: "Data gagal ditambahkan!", data:null });
  }
});

app.delete("/comments/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
   
    const comments = await CommentModel.query().deleteById(id)
    if (!comments) res.status(404).json({ message: "Data tidak ditemukan!", data:null })
    else res.status(200).json({ message: `Data dengan ID ${id} berhasil dihapus!`});
  } catch (error) {
    res.status(400).json({ message: "Data gagal dihapus!", data:null });
  }
});



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

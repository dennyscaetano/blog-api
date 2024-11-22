import express from 'express'; // Importa o framework Express
import cors from 'cors'; // Importa o middleware CORS
import logger from 'morgan'; // Importa o middleware de logging
import swaggerJSDoc from 'swagger-jsdoc'; // Importa a geração de documentação Swagger
import swaggerUI from 'swagger-ui-express'; // Importa o middleware para servir a documentação Swagger

import { userRouter } from './routes/users'; // Importa as rotas de usuários
import './data-source'; // Conecta ao banco de dados
import { swaggerOptions } from './config/swagger'; // Importa as configurações do Swagger
import { postRouter } from './routes/posts'; // Importa as rotas de posts

const app = express(); // Cria uma instância do Express
export default app;

app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições
app.use(cors()); // Habilita o CORS para permitir requisições de diferentes origens
app.use(logger('dev')); // Habilita o logging de requisições

app.use('/users', userRouter); // Monta as rotas de usuários
app.use('/posts', postRouter); // Monta as rotas de posts

const specs = swaggerJSDoc(swaggerOptions); // Gera a documentação Swagger
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs)); // Serve a documentação Swagger

app.get('/', (req, res) => res.send('Blog API')); // Rota raiz, retorna uma mensagem
import 'reflect-metadata'; // Import necessário para o TypeORM
import { DataSource } from 'typeorm'; // Importa a classe DataSource do TypeORM
import { Post } from './entities/Post'; // Importa a entidade Post
import { User } from './entities/User'; // Importa a entidade User

export const AppDataSource = new DataSource({
  type: 'sqlite', // Define o tipo de banco de dados como SQLite
  database: 'database.sqlite', // Define o caminho para o arquivo do banco de dados
  synchronize: true, // Sincroniza o esquema do banco de dados com as entidades
  logging: false, // Desativa o logging do TypeORM
  entities: [User, Post], // Define as entidades a serem usadas
  migrations: [], // Define as migrações a serem executadas
  subscribers: [], // Define os subscribers a serem usados
});

AppDataSource.initialize() // Inicializa a conexão com o banco de dados
  .then(() => {
    console.log('Data Source has been initialized!'); // Log de sucesso
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err); // Log de erro
  });
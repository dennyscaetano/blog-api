import { Length } from 'class-validator'; // Importa a validação de tamanho
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'; // Importa decorações do TypeORM
import { User } from './User'; // Importa o modelo de Usuário
import { BaseEntity } from './BaseEntity'; // Herda propriedades de BaseEntity

@Entity() // Define a classe como uma entidade do TypeORM
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn() // Define o ID como chave primária gerada automaticamente
  id: number;

  @Column() // Define a coluna "title"
  @Length(5, 30, { // Valida o tamanho do título entre 5 e 30 caracteres
    message: 'Post title must have between 5 and 30 characters',
  })
  title: string;

  @Column() // Define a coluna "content"
  @Length(5, 144, { // Valida o tamanho do conteúdo entre 5 e 144 caracteres
    message: 'Post content must have between 5 and 144 characters',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' }) // Define o relacionamento ManyToOne com o usuário
  user: User;

  static createPost(title: string, content: string) {
    const post = new Post(); // Cria uma nova instância de Post
    post.title = title; // Define o título do post
    post.content = content; // Define o conteúdo do post
    return post; // Retorna a nova instância de Post
  }
}
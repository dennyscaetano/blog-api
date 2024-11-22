import { Repository } from 'typeorm'; // Importa a interface Repository do TypeORM para manipulação de entidades
import { AppDataSource } from '../data-source'; // Importa a fonte de dados configurada
import { Post } from '../entities/Post'; // Importa a entidade Post

// Classe controladora para realizar operações com posts
export class PostController {
  private _repo: Repository<Post>; // Repositório privado para manipular entidades Post

  constructor() {
    this._repo = AppDataSource.getRepository(Post); // Inicializa o repositório para a entidade Post
  }

  // Salva um novo post ou atualiza um post existente
  async save(post: Post): Promise<Post> {
    const savedPost = await this._repo.save(post); // Salva o post no banco de dados
    const user = savedPost.user.clear(); // Limpa os dados do usuário (opcional)
    savedPost.user = user; // Reatribui os dados do usuário (opcional)
    return savedPost; // Retorna o post salvo
  }

  // Encontra todos os posts de um determinado usuário
  async findAllByUserId(userId: number): Promise<Post[]> {
    const posts = await this._repo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return posts; // Retorna um array de posts
  }

  // Encontra um post pelo seu ID
  async findById(id: number): Promise<Post> {
    const post = await this._repo.findOne({
      where: {
        id,
      },
      relations: ['user'], // Inclui os dados do usuário relacionado ao post
    });
    return post; // Retorna o post encontrado
  }

  // Deleta um post pelo seu ID
  async delete(id: number) {
    await this._repo.delete(id); // Deleta o post
  }
}
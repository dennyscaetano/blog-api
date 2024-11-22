import { NextFunction, Request, Response } from 'express'; // Importa interfaces para manipulação de requisições e respostas
import { Repository } from 'typeorm'; // Importa interface Repository do TypeORM
import { SECRET } from '../config/secret'; // Importa a chave secreta (provavelmente para JWT)
import { verify } from 'jsonwebtoken'; // Importa função de verificação de JWT

import { AppDataSource } from '../data-source'; // Importa fonte de dados configurada
import { User } from '../entities/User'; // Importa a entidade User

// Classe controladora para gerenciar operações com usuários
export class UserController {
  private _repo: Repository<User>; // Repositório privado para manipular entidades User

  constructor() {
    this._repo = AppDataSource.getRepository(User); // Inicializa o repositório para a entidade User
  }

  // Registra um novo usuário (remove a senha antes de salvar)
  async registerUser(user: User): Promise<User> {
    delete user.password; // Remove a senha do objeto do usuário
    try {
      const savedUser = await this._repo.save(user); // Salva o usuário no banco de dados
      return savedUser;
    } catch (error) {
      console.log(error); // Registra erro no console
      throw new Error(error); // Re-lança o erro para a camada superior
    }
  }

  // Verifica se um usuário com o e-mail informado já existe
  async userAlreadyExists(email: string): Promise<boolean> {
    const count = await this._repo.countBy({ email }); // Conta usuários com o e-mail informado
    return count > 0; // Retorna true se houver ao menos um usuário
  }

  // Encontra um usuário pelo e-mail
  async findUserByEmail(email: string): Promise<User> {
    const user = await this._repo.findOneBy({ email: email }); // Busca usuário pelo e-mail
    return user; // Retorna o usuário encontrado
  }

  // Encontra um usuário pelo ID
  async findUserById(id: number): Promise<User> {
    const user = await this._repo.findOneBy({ id }); // Busca usuário pelo ID
    return user; // Retorna o usuário encontrado
  }

  // Deleta um usuário pelo e-mail
  async deleteUserByEmail(email: string): Promise<boolean> {
    const user = await this._repo.findOneBy({ email }); // Busca usuário pelo e-mail
    if (user) {
      await this._repo.delete(user.id); // Deleta o usuário
      return true; // Retorna true se o usuário foi deletado
    }

    return false; // Retorna false se o usuário não foi encontrado
  }

  // Função estática para verificar o token de autorização (middleware)
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization']; // Obtém o token de autorização do cabeçalho

    if (token) {
      token = token.substring(7, token.length); // Extrai o token propriamente dito (sem 'Bearer ')

      try {
        verify(token, SECRET); // Verifica o token usando a chave secreta
        next(); // Avança para o próximo middleware se a verificação for bem-sucedida
      } catch (error) {
        // Ignora o erro (melhorar a tratativa de erro real)
      }
    }

    res.status(401).json({ message: 'User not authorized' }); // Envia erro 401 se o token for inválido
  }
}
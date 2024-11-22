import * as EmailValidator from 'email-validator'; // Validador de e-mail
import { sign } from 'jsonwebtoken'; // Geração de tokens JWT
import { Request, Response, Router } from 'express'; // Tipos para requisições e respostas Express

import { UserController } from '../controllers/UserController'; // Importa controlador de Usuário
import { User } from '../entities/User'; // Importa modelo de Usuário
import { SECRET } from '../config/secret'; // Importa chave secreta da aplicação
import { validateEntity } from '../utils/validation'; // Função de validação de entidade

export const userRouter = Router(); // Cria um roteador Express
const userCtrl = new UserController(); // Instancia o controlador de Usuário

// Rota para cadastro de usuário
userRouter.post('/', async (req: Request, res: Response) => {
  const { email, name, password } = req.body; // Extrai dados da requisição

  let messages: string[] = []; // Array para armazenar mensagens de erro

  // Verifica se o email já existe
  if (await userCtrl.userAlreadyExists(email)) {
    messages.push('A user with this email already exists');
  }

  const user: User = User.createUser(name, email, password); 1  // Cria uma nova instância de Usuário
  const errorMessages = await validateEntity(user); // Valida a entidade do usuário
  messages = [...messages, ...errorMessages]; // Adiciona mensagens de validação

  if (messages.length > 0) { // Se houver erros de validação
    return res.status(400).json({ messages }); // Retorna erro 400 com mensagens
  }

  const savedUser = await userCtrl.registerUser(user); // Salva o usuário
  return res.status(201).json({ user: savedUser.clear() }); // Retorna usuário salvo (sem dados sensíveis)
});

// Rota para login de usuário
userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body; // Extrai dados da requisição

  const user = await userCtrl.findUserByEmail(email); // Busca usuário por email

  if (user && user.isPasswordCorrect(password)) { // Se usuário existe e senha confere
    const token = sign( // Gera token JWT
      { user: email, timestamp: new Date() }, // Dados do payload
      SECRET, // Chave secreta
      { expiresIn: '1h' } // Tempo de expiração
    );

    res.json({ // Retorna sucesso com token e usuário (sem dados sensíveis)
      authorized: true,
      user: user.clear(),
      token,
    });
  } else {
    return res.status(401).json({ // Retorna erro 401 (não autorizado)
      authorized: false,
      message: 'User not authorized',
    });
  }
});

// Rota para deletar usuário
userRouter.delete('/:email', async (req: Request, res: Response) => {
  const { email } = req.params; // Extrai email da rota

  if (EmailValidator.validate(email)) { // Valida o formato do email
    const userDeleted = await userCtrl.deleteUserByEmail(email); // Tenta deletar o usuário

    if (userDeleted) { // Se o usuário foi deletado
      return res.status(200).json({ message: 'User deleted' }); // Retorna sucesso
    }

    return res.status(404).json({ message: 'User not found' }); // Retorna erro 404 (não encontrado)
  }

  return res.status(400).json({ message: 'Invalid e-mail' }); // Retorna erro 400 (email inválido)
});
import { decode, verify } from 'jsonwebtoken'; // Importa funções de decodificação e verificação de JWT
import { SECRET } from '../config/secret'; // Importa a chave secreta
import { NextFunction, Request, Response } from 'express'; // Importa tipos de requisição, resposta e next function

// Middleware para verificar o token JWT
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers['authorization']; // Obtém o token do cabeçalho da requisição
  if (token) {
    token = token.substring(7, token.length); // Remove o prefixo 'Bearer ' do token

    try {
      verify(token, SECRET); // Verifica a assinatura do token
      return next(); // Se a verificação passar, chama a próxima função de middleware
    } catch (error) { } // Captura erros de verificação
  }

  return res.status(401).json({ message: 'User not authorized' }); // Retorna erro 401 se o token for inválido
};

// Função para decodificar o email do usuário a partir do token JWT
export const decodeUserEmailFromToken = (token: string) => {
  const tokenCode = token.substring(7, token.length); // Remove o prefixo 'Bearer ' do token
  const tokenPayload = decode(tokenCode); // Decodifica o payload do token
  const userEmail = tokenPayload['user']; // Extrai o email do payload
  return userEmail;
};
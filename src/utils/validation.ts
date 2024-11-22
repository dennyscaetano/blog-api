import { validate } from 'class-validator'; // Importa a função de validação do class-validator
import { BaseEntity } from '../entities/BaseEntity'; // Importa a classe base

// Função para validar uma entidade
export const validateEntity = async (entity: BaseEntity) => {
  const messages: string[] = []; // Array para armazenar mensagens de erro

  const errors = await validate(entity); // Valida a entidade usando o class-validator
  if (errors.length > 0) {
    errors.forEach((err) => messages.push(Object.values(err.constraints)[0])); // Extrai a primeira mensagem de erro de cada violação de validação
  }

  return messages; // Retorna um array de mensagens de erro
};
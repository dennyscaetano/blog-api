import { ValidatorConstraintInterface } from 'class-validator'; // Importa interface de validação
import { ValidationArguments, ValidatorConstraint } from 'class-validator'; // Importa decorador e argumentos de validação

// Define um validador de senha personalizado
@ValidatorConstraint({ name: 'passwordValidator' })
export class PasswordValidator implements ValidatorConstraintInterface {
  // Método de validação
  validate(password: string, args?: ValidationArguments): boolean | Promise<boolean> {
    // Verifica se a senha atende aos critérios:
    // - Tem pelo menos 8 caracteres
    // - Contém pelo menos uma letra maiúscula
    // - Contém pelo menos um dígito
    return (
      password &&
      password.length >= 8 &&
      /[A-Z]/g.test(password) &&
      /[0-9]/g.test(password)
    );
  }

  // Mensagem de erro padrão
  defaultMessage?(args?: ValidationArguments): string {
    return 'Password must contain at least 8 characters, 1 uppercase character, and 1 digit';
  }
}
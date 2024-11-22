import { PasswordValidator } from './../validators/PasswordValidator'; // Importa validador de senha
import { IsEmail, Length, Validate } from 'class-validator'; // Importa validações do class-validator
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // Importa decorações do TypeORM
import { Post } from './Post'; // Importa modelo de Post
import { pbkdf2Sync, randomBytes } from 'crypto'; // Importa funções de criptografia
import { BaseEntity } from './BaseEntity'; // Herda propriedades de BaseEntity

@Entity() // Define a classe como uma entidade do TypeORM
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() // Define o ID como chave primária gerada automaticamente
  id: number;

  @Column() // Define a coluna "name"
  @Length(5, 50, { // Valida o tamanho do nome entre 5 e 50 caracteres
    message: 'User name must have between 5 and 50 characters',
  })
  name: string;

  @Column({ unique: true }) // Define a coluna "email" como única
  @IsEmail({}, { message: 'Invalid email' }) // Valida o formato do email
  email: string;

  @Column() // Define a coluna "hash" para armazenar a senha criptografada
  hash: string;

  @Column() // Define a coluna "salt" para armazenar o salt usado na criptografia
  salt: string;

  @OneToMany(() => Post, (post) => post.user) // Define a relação OneToMany com o modelo Post
  posts: Post[];

  @Validate(PasswordValidator) // Valida a senha usando o PasswordValidator
  password: string;

  static createUser(name: string, email: string, password: string) {
    const user = new User(); // Cria uma nova instância de User
    user.name = name; // Define o nome do usuário
    user.email = email; // Define o email do usuário
    user.password = password; // Define a senha do usuário (não criptografada)
    user._generatePassword(); // Gera o hash e salt da senha
    return user; // Retorna a nova instância de User
  }

  isPasswordCorrect(password: string): boolean {
    const hash = pbkdf2Sync( // Gera o hash da senha informada
      password,
      this.salt,
      1000,
      64,
      'sha512'
    ).toString('hex');
    return hash === this.hash; // Compara o hash gerado com o hash armazenado
  }

  clear(): User { // Retorna uma cópia do usuário sem informações sensíveis
    const user = this;
    delete user.hash;
    delete user.salt;
    return user;
  }

  private _generatePassword() { // Gera o hash e salt da senha
    const salt = randomBytes(16).toString('hex'); // Gera um salt aleatório
    const hash = pbkdf2Sync( // Gera o hash da senha usando PBKDF2
      this.password,
      salt,
      1000,
      64,
      'sha512'
    ).toString('hex');
    this.salt = salt;
    this.hash = hash;
  }
}
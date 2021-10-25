import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../modules/users/useCases/createUser/ICreateUserDTO";

let authenticationUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticationUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able a create authentication', async () => {
    const user: ICreateUserDTO = {
      email: 'user@example.com',
      password: '1234',
      name: 'John Doe'
    };

    await createUserUseCase.execute(user);

    const auth = await authenticationUserUseCase.execute({
      email: 'user@example.com',
      password: '1234'
    });

    expect(auth).toHaveProperty('token');
  });

  it('should not be able to authentication noneexisting user', async () => {
    expect(async () => {
      await authenticationUserUseCase.execute({
        email: 'user1@example.com',
        password: '1234'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate if password is incorrect', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: 'leogs@gmail.com',
        password: '1234',
        name: 'Jhon Doe',
      };
      await createUserUseCase.execute(user);

      await authenticationUserUseCase.execute({
        email: user.email,
        password: '12345',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create a new user', async () => {
    const user = {
      name: 'Leonardo',
      email: 'leonardo@gmail.com',
      password: '1234'
    }

    const userCreated = await createUserUseCase.execute(user);
    expect(userCreated).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', () => {
    expect(async () => {
      const user = {
        name: 'Leonardo',
        email: 'leonardo@gmail.com',
        password: '1234'
      }
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError)
  });
})

import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../modules/users/useCases/createUser/ICreateUserDTO";
import { ShowUserProfileError } from "../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should to be able to show info user', async () => {
    const user: ICreateUserDTO = {
      email: 'user@example.com',
      password: '1234',
      name: 'John Doe'
    };

    const userCreated = await createUserUseCase.execute(user);
    const { id } = userCreated;
    const profile = await showUserProfileUseCase.execute(id as string);
    expect(profile.id).toBe(id);
  });

  it('should not be able to show info user noneexisting', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('123456789');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});

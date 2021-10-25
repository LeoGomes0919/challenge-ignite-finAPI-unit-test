import { OperationType } from "../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../../modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance from User', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository);
  });

  it('should to be able return balance from user', async () => {
    const user = {
      name: 'Leonardo',
      email: 'leonardo@gmail.com',
      password: '1234'
    }

    const userCreated = await createUserUseCase.execute(user);
    await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      amount: 100,
      description: 'Firs deposit',
      type: OperationType.DEPOSIT
    });

    const balance = await getBalanceUseCase.execute({
      user_id: userCreated.id as string
    });

    expect(balance.balance).toEqual(100);
  });

  it('should not be able return balance from noneexisting user', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: '12345'
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
});

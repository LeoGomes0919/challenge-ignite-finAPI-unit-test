import { OperationType } from '../../../modules/statements/entities/Statement';
import { CreateStatementError } from '../../../modules/statements/useCases/createStatement/CreateStatementError';
import { CreateStatementUseCase } from '../../../modules/statements/useCases/createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../../../modules/statements/useCases/createStatement/ICreateStatementDTO';
import { InMemoryUsersRepository } from '../../../modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository';

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Create Statements', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('should be able to create a statement to user', async () => {
    const user = {
      name: 'Leonardo',
      email: 'leonardo@gmail.com',
      password: '1234'
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      amount: 100,
      description: 'Firs deposit',
      type: OperationType.DEPOSIT,
      sender_id: userCreated.id as string
    });

    expect(statement.amount).toBe(100);
  });

  it('should not be able to create a statement noneexisting user', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '12345',
        amount: 100,
        description: 'Firs deposit',
        type: OperationType.DEPOSIT,
        sender_id: '12345'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to make a withdrawal if balance is insufficient', () => {
    expect(async () => {
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
        type: OperationType.WITHDRAW,
        sender_id: userCreated.id as string
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});

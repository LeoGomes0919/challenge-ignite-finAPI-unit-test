import { OperationType } from "../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../modules/users/useCases/createUser/CreateUserUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get transaction information', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('should be able to get transaction a information', async () => {
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

    const informationStatement = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: userCreated.id as string
    });
    expect(informationStatement).toHaveProperty('id');
  });

  it('should not be able to get transaction a information noneexisting user', () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: '12234'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('Should not be able to list a non-existing transaction', () => {
    expect(async () => {
      const user = {
        name: 'Leonardo',
        email: 'leonardo@gmail.com',
        password: '1234'
      }

      const userCreated = await createUserUseCase.execute(user);

      await getStatementOperationUseCase.execute({
        statement_id: '12334',
        user_id: userCreated.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});

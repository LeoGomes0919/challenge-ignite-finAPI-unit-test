import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { CreateStatementUseCase } from './CreateStatementUseCase';

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id } = request.user;
    const { user_id: recipient } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    let position = 1;
    if (splittedPath.includes(OperationType.TRANSFER)) {
      position = 2;
    }
    const type = splittedPath[splittedPath.length - position] as OperationType;
    const createStatement = container.resolve(CreateStatementUseCase);

    let user_id = id;
    let sender_id = user_id;
    if (type === OperationType.TRANSFER) {
      user_id = recipient as string;
      sender_id = id;
    }

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });
    console.log(statement)
    return response.status(201).json(statement);
  }
}

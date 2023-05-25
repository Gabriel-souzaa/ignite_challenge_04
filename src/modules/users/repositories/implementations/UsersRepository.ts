import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id: user_id,
      },
      relations: [
        'games'
      ]
    })

    if (!user) {
      throw new Error("User not exists");
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query('select first_name from users u order by u.first_name asc'); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      select first_name,last_name,email from users u where LOWER(u.first_name)=LOWER('${first_name}') and LOWER(u.last_name)=LOWER('${last_name}')
    `); // Complete usando raw query
  }
}

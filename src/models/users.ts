import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export type BaseUser = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
};

export type User = BaseUser & {
  password: string;
  date_registered?: Date;
};

export class UserStore {
  private pepper: string = process.env.BCRYPT_PASSWORD as unknown as string;
  private saltRounds: string = process.env.SALT_ROUNDS as unknown as string;

  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (firstname, lastname, email, password_digest, date_registered) \
                    VALUES($1, $2, $3, $4, NOW()) RETURNING *';

      const hash = bcrypt.hashSync(
        u.password + this.pepper,
        parseInt(this.saltRounds)
      );

      const result = await conn.query(sql, [
        u.firstname,
        u.lastname,
        u.email,
        hash
      ]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`unable create user (${u.email}): ${err}`);
    }
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<BaseUser | null> {
    const conn = await Client.connect();
    const sql =
      'SELECT id, lastname, firstname, email, password_digest FROM users WHERE email=($1)';

    const result = await conn.query(sql, [email]);

    if (result.rows.length) {
      const user = result.rows[0];
      conn.release();
      if (bcrypt.compareSync(password + this.pepper, user.password_digest)) {
        return {
          id: user.id,
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email
        };
      }
    }

    return null;
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE email=$1';
      const result = await conn.query(sql, [email]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async updateUser(
    userid: number,
    lastname: string,
    firstname: string,
    email: string
  ): Promise<string> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE users \
                SET lastname=$1,firstname=$2,email=$3 \
                WHERE id=$4';
      const results = await conn.query(sql, [
        lastname,
        firstname,
        email,
        userid
      ]);
      conn.release();
      return `User with ID: ${results.rows[0].id} updated`;
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async changePassword(
    email: string,
    oldpassword: string,
    newpassword: string
  ): Promise<string> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT password_digest FROM users WHERE email=($1)';

      let result = await conn.query(sql, [email]);

      if (result.rows.length) {
        const user = result.rows[0];

        if (
          bcrypt.compareSync(oldpassword + this.pepper, user.password_digest)
        ) {
          const hash = bcrypt.hashSync(
            newpassword + this.pepper,
            parseInt(this.saltRounds)
          );
          sql =
            'UPDATE users \
                        SET password_digest=$1 \
                        WHERE email=$2';
          result = await conn.query(sql, [hash, email]);
          conn.release();
          return `User with Email: ${result.rows[0].email} updated`;
        }
      }

      throw `Invalid user and/or password combination for User with Email: ${result.rows[0].email}`;
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }

  async deleteUser(userid: number): Promise<string> {
    try {
      const conn = await Client.connect();
      const sql =
        'DELETE FROM users \
                WHERE id=$1 RETURNING *';
      const results = await conn.query(sql, [userid]);
      conn.release();
      return `User with ID ${results.rows[0].id} deleted`;
    } catch (err) {
      throw `An error occured ${err}`;
    }
  }
}

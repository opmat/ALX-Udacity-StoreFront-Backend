import { User, UserStore } from '../../models/users';

const userStore = new UserStore();
const testUsers: User[] = [
  {
    firstname: 'TestUser-1',
    lastname: 'Surname1',
    email: 'testuser-1@test.com',
    password: 't3st1'
  },
  {
    firstname: 'TestUser-2',
    lastname: 'Surname2',
    email: 'testuser-2@test.com',
    password: 't3st2'
  }
];

const conflictingUser: User = {
  firstname: 'TestUser-11',
  lastname: 'Surname11',
  email: 'testuser-1@test.com',
  password: 't3st11'
};

const extraUser: User = {
  firstname: 'TestUser12',
  lastname: 'Surname12',
  email: 'testuser12@test.com',
  password: 't3st11'
};

let userId: number;

describe('/users MODEL :: ', () => {
  beforeAll(() => {
    testUsers.forEach(async (user) => {
      userStore.create(user);
    });
  });

  it('Expects index method call to return Users', async () => {
    const users = await userStore.index();
    expect(users.length).toBeGreaterThanOrEqual(1);
  });

  it('Expects create method to return created user', async () => {
    const user = await userStore.create(extraUser);
    userId = Number(user.id);
    expect(user).toBeTruthy();
  });

  it('Expects create method with conflicting unique value to be rejected with error', async () => {
    await expectAsync(
      userStore.create(conflictingUser)
    ).toBeRejectedWithError();
  });

  it('Expects authenticate() method with correct details to return created user', async () => {
    const user = await userStore.authenticate(
      extraUser.email,
      extraUser.password
    );
    expect(user).toBeTruthy();
  });

  it('Expects authenticate() method with incorrect details to return null', async () => {
    const user = await userStore.authenticate(extraUser.email, 'incorrect');
    expect(user).toBeNull();
  });

  it('Expects show(id) method with correct id should return user with the id', async () => {
    const user = await userStore.show(userId);
    expect(user).toBeTruthy();
  });

  it('Expects show(id) method with incorrect id should return falsy', async () => {
    const user = await userStore.show(1000);
    expect(user).toBeFalsy();
  });

  it('Expects getUserByEmail(email) method with correct email should return user', async () => {
    const user = await userStore.getUserByEmail(extraUser.email);
    expect(user).toBeTruthy();
  });
});

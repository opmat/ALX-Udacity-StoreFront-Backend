import { Product } from '../../models/products';
import { User } from '../../models/users';
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

const testProduct: Product[] = [
  {
    product_name: 'Cooking Pot',
    price: 1500,
    category: 'Home Items'
  },
  {
    product_name: 'Knorr Chicken',
    price: 750,
    category: 'Spice'
  },
  {
    product_name: 'Curry',
    price: 600,
    category: 'Spice'
  },
  {
    product_name: 'Thyme',
    price: 600,
    category: 'Spices'
  },
  {
    product_name: 'The Lion King',
    price: 2500,
    category: 'Books'
  },
  {
    product_name: 'Sauce Pan',
    price: 1250,
    category: 'Home Items'
  }
];

const conflictingProduct: Product = {
  product_name: 'Cooking Pot',
  price: 1750,
  category: 'Home Items'
};

const testUser: User = {
  firstname: 'TestUser1',
  lastname: 'Surname1',
  email: 'testuser1@test.com',
  password: 't3st1'
};

let token: string;

describe('/products ROUTE :: ', () => {
  beforeAll(() => {
    const auth = async () => {
      const response = await request.post('/users/login').send({
        email: testUser.email,
        password: testUser.password
      });
      token = response.body.token;
    };
    auth();
  });

  it('Expects GET / (index) endpoint call should return status 200 and zero products info', async () => {
    const result = await request.get('/products');

    expect(result.status).toEqual(200);
    expect(Object.keys(result.body).length).toEqual(0);
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[0])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[1])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects GET / (index) endpoint call should return status 200 and two products info', async () => {
    const result = await request.get('/products');

    expect(result.status).toEqual(200);
    expect(Object.keys(result.body).length).toEqual(2);
  });

  it('Expects POST / (index) endpoint call will duplicate product name should return status 400', async () => {
    const response = await request
      .post('/products')
      .send(conflictingProduct)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(400);
  });

  it('Expects GET /products/:id endpoint call with valid token should return status 200 and product info', async () => {
    const result = await request.get('/products/1');

    expect(result.status).toEqual(200);
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[2])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[3])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[4])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects POST / (index) endpoint call to return status 200 and product info', async () => {
    const response = await request
      .post('/products')
      .send(testProduct[5])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects GET /products/category/:category endpoint call with valid token should return status 200 and product info', async () => {
    const result = await request.get(
      `/products/category/${testProduct[0].category}`
    );

    expect(result.status).toEqual(200);
  });
});

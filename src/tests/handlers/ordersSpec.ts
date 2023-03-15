import { Product } from '../../models/products';
import { User } from '../../models/users';
import { Order, OrderDetails } from '../../models/orders';
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

const testOrders: Order[] = [
  {
    user_id: 1,
    order_status: 'active'
  }
];

const testCartItems: OrderDetails[] = [
  {
    order_id: 1,
    product_id: 1,
    quantity: 1
  },
  {
    order_id: 1,
    product_id: 4,
    quantity: 1
  },
  {
    order_id: 1,
    product_id: 2,
    quantity: 2
  },
  {
    order_id: 1,
    product_id: 5,
    quantity: 5
  },
  {
    order_id: 1,
    product_id: 7,
    quantity: 1
  }
];

const testProducts: Product[] = [
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
  },
  {
    product_name: 'Alawiye',
    price: 2000,
    category: 'Books'
  },
  {
    product_name: 'Oxford Advanced Exnglish Dictionary',
    price: 2500,
    category: 'Books'
  }
];
const testUser: User = {
  firstname: 'TestUser1',
  lastname: 'Surname1',
  email: 'testuser1@test.com',
  password: 't3st1'
};

let token: string;

describe('/orders ROUTE :: ', () => {
  beforeAll(async () => {
    // const loadProducts = () => {
      testProducts.forEach(async (item) => {
        const response = await request
          .post('/products')
          .send(item)
          .set('Authorization', `Bearer ${token}`);
      });
    // }

    // const auth = async () => {
      const response = await request.post('/users/login').send({
        email: testUser.email,
        password: testUser.password
      });
      token = response.body.token;
    // };
    // await auth();

    //Load all Products for Test
    // loadProducts();
  });

  it('Expects GET / (index) endpoint call should return status 200 and zero order info', async () => {
    const result = await request.get('/orders');

    expect(result.status).toEqual(200);
    expect(Object.keys(result.body).length).toEqual(0);
  });

  it('Expects POST / (index) endpoint call to return status 200 and order info', async () => {
    const response = await request
      .post('/orders')
      .send(testOrders[0])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects GET / (index) endpoint call should return status 200 and 1 active order info', async () => {
    const result = await request.get('/orders');

    expect(result.status).toEqual(200);
    expect(Object.keys(result.body).length).toEqual(1);
  });

  it('Expects GET /:id endpoint call should return status 200 and order with ID=1', async () => {
    const result = await request.get('/orders/1');

    expect(result.status).toEqual(200);
    expect(result.body).toBeTruthy();
  });

  //Add Products to Order in Cart
  it('Expects POST /addproduct endpoint call to return status 200 and info of product added', async () => {
    const response = await request
      .post('/orders/addproduct')
      .send(testCartItems[0])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });
  it('Expects POST /addproduct endpoint call to return status 200 and info of product added', async () => {
    const response = await request
      .post('/orders/addproduct')
      .send(testCartItems[1])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });
  it('Expects POST /addproduct endpoint call to return status 200 and info of product added', async () => {
    const response = await request
      .post('/orders/addproduct')
      .send(testCartItems[2])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });
  it('Expects POST /addproduct endpoint call to return status 200 and info of product added', async () => {
    const response = await request
      .post('/orders/addproduct')
      .send(testCartItems[3])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });
  it('Expects POST /addproduct endpoint call to return status 200 and info of product added', async () => {
    const response = await request
      .post('/orders/addproduct')
      .send(testCartItems[4])
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  });

  it('Expects GET /:id endpoint call should return status 200 and order with ID=1 along with products in the cart', async () => {
    const result = await request.get('/orders/1/cart');

    expect(result.status).toEqual(200);
    expect(result.body).toBeTruthy();
  });
});

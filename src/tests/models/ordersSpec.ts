import { Order, OrderDetails, OrderStore } from '../../models/orders';

const store = new OrderStore();
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

let orderId: number;

describe('/orders MODEL :: ', () => {
  it('Expects create() method to return created order', async () => {
    const order = await store.create({ user_id: 1, order_status: 'active' });
    orderId = Number(order.id);
    expect(order).toBeTruthy();
  });

  it('Expects index() method call to return Order List', async () => {
    const orders = await store.index();
    expect(orders.length).toBeGreaterThanOrEqual(1);
  });

  it('Expects addProductToOrder() method to return created order item', async () => {
    const order = await store.addProductToOrder(orderId, 1, 2);
    expect(order).toBeTruthy();
  });

  it('Expects show(id) method to return order with id', async () => {
    const order = await store.show(orderId);
    expect(order).toBeTruthy();
  });

  it('Expects show(id) method with incorrect id should return falsy', async () => {
    const order = await store.show(1000);
    expect(order).toBeFalsy();
  });

  it('Expects closeOrder(id) method to return order with status as complete', async () => {
    const order = await store.closeOrder(orderId);
    expect(order.order_status).toBe('complete');
  });

  it('Expects showUserOrders(userid) method call to return Order List for user with id', async () => {
    const orders = await store.showUserOrders(1);
    expect(orders.length).toBeGreaterThanOrEqual(1);
  });

  it("Expects showByStatus('complete') method call to return all active Order List ", async () => {
    const orders = await store.showByStatus('complete');
    expect(orders).toBeTruthy();
  });
});

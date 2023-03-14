import { Product, ProductStore } from '../../models/products';

const store = new ProductStore();

const testProduct: Product[] = [
  {
    product_name: 'Washing Machine',
    price: 15000,
    category: 'Home Items'
  },
  {
    product_name: 'Sugar Cubes',
    price: 750,
    category: 'Sweetner'
  },
  {
    product_name: 'Rosemary',
    price: 1000,
    category: 'Spice'
  },
  {
    product_name: 'Italian Spice',
    price: 1600,
    category: 'Spices'
  }
];
const conflictingProduct: Product = {
  product_name: 'Washing Machine',
  price: 15000,
  category: 'Home Items'
};
const extraProduct: Product = {
  product_name: 'Beauty and the Beast',
  price: 2500,
  category: 'Books'
};

let productId: number;

describe('/products MODEL :: ', () => {
  beforeAll(() => {
    testProduct.forEach(async (product) => {
      store.create(product);
    });
  });

  it('Expects index() method call to return Product List', async () => {
    const products = await store.index();
    expect(products.length).toBeGreaterThanOrEqual(1);
  });

  it('Expects create() method to return created product', async () => {
    const product = await store.create(extraProduct);
    productId = Number(product.id);
    expect(product).toBeTruthy();
  });

  it('Expects create() method with conflicting unique value to be rejected with error', async () => {
    await expectAsync(store.create(conflictingProduct)).toBeRejectedWithError();
  });

  it('Expects show(id) method with correct id should return user with the id', async () => {
    const product = await store.show(productId);
    expect(product).toBeTruthy();
  });

  it('Expects show(id) method with incorrect id should return falsy', async () => {
    const product = await store.show(1000);
    expect(product).toBeFalsy();
  });

  it('Expects showByCategory(category) method with correct category should return product list', async () => {
    const product = await store.showByCategory('Home Items');
    expect(product).toBeTruthy();
  });
});

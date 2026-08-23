// Seed script: populates the database with 1 Admin, 3 Customers,
// several Categories and several related Foods.
//
// Run:            npm run seed
// Destroy/reset:  npm run seed:destroy
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Food from '../models/Food.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

const users = [
  {
    name: 'Ahmed Admin',
    email: 'admin@foodapp.com',
    password: 'Admin@123',
    phone: '+201000000001',
    address: '1 Admin St, Cairo',
    role: 'Admin',
  },
  {
    name: 'Mona Customer',
    email: 'mona@foodapp.com',
    password: 'Customer@123',
    phone: '+201000000002',
    address: '10 Tahrir St, Cairo',
    role: 'Customer',
  },
  {
    name: 'Youssef Customer',
    email: 'youssef@foodapp.com',
    password: 'Customer@123',
    phone: '+201000000003',
    address: '25 Corniche St, Mansoura',
    role: 'Customer',
  },
  {
    name: 'Laila Customer',
    email: 'laila@foodapp.com',
    password: 'Customer@123',
    phone: '+201000000004',
    address: '7 Gomhoria St, Alexandria',
    role: 'Customer',
  },
];

const categoriesData = [
  { name: 'Pizza', image: 'https://images.example.com/categories/pizza.jpg' },
  { name: 'Burgers', image: 'https://images.example.com/categories/burgers.jpg' },
  { name: 'Beverages', image: 'https://images.example.com/categories/beverages.jpg' },
  { name: 'Desserts', image: 'https://images.example.com/categories/desserts.jpg' },
];

const buildFoods = (categoryMap) => [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella and basil.',
    price: 149,
    image: 'https://images.example.com/foods/margherita.jpg',
    category: categoryMap.Pizza,
    available: true,
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Loaded with mozzarella and spicy pepperoni slices.',
    price: 179,
    image: 'https://images.example.com/foods/pepperoni.jpg',
    category: categoryMap.Pizza,
    available: true,
  },
  {
    name: 'Classic Cheeseburger',
    description: 'Beef patty, cheddar cheese, lettuce, tomato and special sauce.',
    price: 129,
    image: 'https://images.example.com/foods/cheeseburger.jpg',
    category: categoryMap.Burgers,
    available: true,
  },
  {
    name: 'Double Beef Burger',
    description: 'Two beef patties stacked with cheese and pickles.',
    price: 169,
    image: 'https://images.example.com/foods/double-beef.jpg',
    category: categoryMap.Burgers,
    available: true,
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice, no added sugar.',
    price: 39,
    image: 'https://images.example.com/foods/orange-juice.jpg',
    category: categoryMap.Beverages,
    available: true,
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice.',
    price: 45,
    image: 'https://images.example.com/foods/iced-coffee.jpg',
    category: categoryMap.Beverages,
    available: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with ice cream.',
    price: 69,
    image: 'https://images.example.com/foods/lava-cake.jpg',
    category: categoryMap.Desserts,
    available: true,
  },
  {
    name: 'Cheesecake Slice',
    description: 'Creamy New York style cheesecake with berry topping.',
    price: 59,
    image: 'https://images.example.com/foods/cheesecake.jpg',
    category: categoryMap.Desserts,
    available: false,
  },
];

const destroyData = async () => {
  await Order.deleteMany();
  await Cart.deleteMany();
  await Food.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();
  console.log('All existing data destroyed.');
};

const importData = async () => {
  await destroyData();

  // Users: create individually so the pre-save password-hashing hook runs
  const createdUsers = [];
  for (const u of users) {
    const created = await User.create(u);
    createdUsers.push(created);
  }
  console.log(`Seeded ${createdUsers.length} users.`);

  const createdCategories = await Category.insertMany(categoriesData);
  console.log(`Seeded ${createdCategories.length} categories.`);

  const categoryMap = createdCategories.reduce((acc, cat) => {
    acc[cat.name] = cat._id;
    return acc;
  }, {});

  const createdFoods = await Food.insertMany(buildFoods(categoryMap));
  console.log(`Seeded ${createdFoods.length} foods.`);

  console.log('\nSeed completed successfully.');
  console.log('\nDefault credentials (development only):');
  console.log('  Admin    -> email: admin@foodapp.com    password: Admin@123');
  console.log('  Customer -> email: mona@foodapp.com      password: Customer@123');
  console.log('  Customer -> email: youssef@foodapp.com   password: Customer@123');
  console.log('  Customer -> email: laila@foodapp.com     password: Customer@123');
};

const run = async () => {
  await connectDB();

  try {
    if (process.argv.includes('--destroy')) {
      await destroyData();
    } else {
      await importData();
    }
    process.exit(0);
  } catch (err) {
    console.error(`Seed error: ${err.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();

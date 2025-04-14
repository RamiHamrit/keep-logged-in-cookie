// utils/userUtils.js
const User = require('../models/User');

const initialUsers = [
  { username: 'emma', password: 'Starlight2023!' },
  { username: 'john', password: 'BlueR1ver$42' },
  { username: 'sarah', password: 'Term1nator99#' },
  { username: 'mike', password: 'Moonwalk$1987' },
  { username: 'lisa', password: 'Rainbow!2024' },
  { username: 'david', password: 'Thunder@456' },
  { username: 'amy', password: 'Sparkle#7890' },
  { username: 'chris', password: 'Captain$2022' },
  { username: 'jessica', password: 'HoneyBee!123' },
  { username: 'tom', password: 'Venom@2025' },
  { username: 'laura', password: 'Sunshine*678' },
  { username: 'peter', password: 'WebSlinger$99' },
  { username: 'kate', password: 'Titanic#1912' },
  { username: 'ryan', password: 'Deadpool!2024' },
  { username: 'natalie', password: 'BlackSwan$88' },
];

let targetUser = initialUsers[Math.floor(Math.random() * initialUsers.length)];

function getRandomLoginUser() {
  return initialUsers[Math.floor(Math.random() * initialUsers.length)];
}

async function initializeUsers() {
  try {
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      console.log('No users found, seeding MongoDB with initial users...');
      for (const userData of initialUsers) {
        const existingUser = await User.findOne({ username: userData.username });
        if (!existingUser) {
          const user = new User({ username: userData.username, password: userData.password });
          await user.save();
          console.log(`Added ${userData.username} to MongoDB`);
        }
      }
    } else {
      console.log('Users already exist in MongoDB, skipping seeding.');
    }
    const dbUsers = await User.find({}, 'username');
    targetUser = dbUsers[Math.floor(Math.random() * dbUsers.length)];
  } catch (err) {
    console.error('Error seeding users:', err.message);
    throw err;
  }
}

module.exports = {
  initialUsers,
  targetUser,
  getRandomLoginUser,
  initializeUsers,
};
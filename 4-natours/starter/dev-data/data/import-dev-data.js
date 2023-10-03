const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    createIndexes: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection established'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/tours.json'), 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/users.json'), 'utf8')
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/reviews.json'), 'utf8')
);

// Import data to database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data succesfully loaded');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

// console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

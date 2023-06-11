const fs = require('fs');
const path = require('path');

const tours = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '/../dev-data/data/tours-simple.json'),
    'utf8'
  )
);

const findTourWithID = (id) => {
  const tour = tours.find((el) => el.id === id * 1);
  return tour;
};

exports.checkID = (req, res, next, val) => {
  if (!findTourWithID(val)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

// Create a checkbody middleware function
// Check if the body contains the name and price property
// If not, send back 400 (bad request)
// Add it to th epost handler stack
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  // if (Object.keys(req.body).length === 0) {
  //   return res.status(400).json({ error: 'Missing request body' });
  // }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestedTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const tour = findTourWithID(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, '/dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

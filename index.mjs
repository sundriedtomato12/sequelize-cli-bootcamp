import sequelizePackage from 'sequelize';
import allConfig from './config/config.js';
import initTripModel from './models/trip.mjs';
import initAttractionModel from './models/attraction.mjs';

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Trip = initTripModel(sequelize, Sequelize.DataTypes);
db.Attraction = initAttractionModel(sequelize, Sequelize.DataTypes);

db.Attraction.belongsTo(db.Trip);
db.Trip.hasMany(db.Attraction);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

if (process.argv[2] === 'create') {
  db.Trip.create({
    name: process.argv[3],
  })
    .then((trip) => {
      console.log('success!');
      console.log(trip);
    })
    .catch((error) => console.log(error));
}

if (process.argv[2] === 'add-attrac') {
  db.Trip.findOne({
    where: {
      name: [process.argv[3]],
    },
  }).then((returnedTrip) => db.Attraction.create({
    name: process.argv[4],
    tripId: returnedTrip.id,
  })).catch((error) => console.log(error));
}

if (process.argv[2] === 'trip') {
  db.Trip.findOne({
    where: {
      name: [process.argv[3]],
    },
  }).then((trip) => trip.getAttractions())
    .then((tripAttractions) => console.log(tripAttractions
      .map((tripAttraction) => tripAttraction.name)))
    .catch((error) => console.log(error));
}

const sqlite3 = require("sqlite3").verbose();
const faker = require("faker");
const db = new sqlite3.Database(":memory:");

const Ride = () => ({
  startLat: faker.random.number({
    min: -90,
    max: 90,
  }),
  startLong: faker.random.number({
    min: -180,
    max: 180,
  }),
  endLat: faker.random.number({
    min: -90,
    max: 90,
  }),
  endLong: faker.random.number({
    min: -180,
    max: 180,
  }),
  riderName: faker.lorem.word(),
  driverName: faker.lorem.word(),
  driverVehicle: faker.lorem.word(),
});

module.exports = {
  generateRides: (userContext, events, done) => {
    const {
      startLat,
      startLong,
      endLat,
      endLong,
      riderName,
      driverName,
      driverVehicle,
    } = Ride();
    db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        startLat,
        startLong,
        endLat,
        endLong,
        riderName,
        driverName,
        driverVehicle,
      ],
      done
    );
  },
};

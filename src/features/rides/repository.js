class RideRepository {
  constructor(db) {
    this.db = db;
  }

  async create(values) {
    const { lastID } = await new Promise((resolve, reject) =>
      this.db.run(
        "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
        values,
        function (err) {
          if (err) return reject(err);
          return resolve(this);
        }
      )
    );

    return new Promise((resolve, reject) =>
      this.db.all(
        "SELECT * FROM Rides WHERE rideID = ?",
        lastID,
        function (err, rows) {
          if (err) return reject(err);

          return resolve(rows[0]);
        }
      )
    );
  }

  async getAll() {
    return new Promise((resolve, reject) =>
      this.db.all("SELECT * FROM Rides", function (err, rows) {
        if (err) return reject(err);

        return resolve(rows);
      })
    );
  }

  async getById(id) {
    return new Promise((resolve, reject) =>
      this.db.all(
        `SELECT * FROM Rides WHERE rideID='${id}'`,
        function (err, rows) {
          if (err) return reject(err);

          if (err) return reject(err);

          return resolve(rows[0]);
        }
      )
    );
  }
}

module.exports = RideRepository;

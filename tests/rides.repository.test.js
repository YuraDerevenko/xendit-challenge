"use strict";

const { expect } = require("chai");

const RidesRepo = require("../src/features/rides/repository");

describe("Rides repository tests", () => {
  it("success create", async function () {
    const db = {
      run: function (sql, values, cb) {
        this.lastID = 1;
        expect(sql).eql(
          "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        expect(values).eql([1, 2, 3]);
        return cb.call(this, null);
      },
      all: function (sql, values, cb) {
        expect(sql).eql("SELECT * FROM Rides WHERE rideID = ?");
        cb(null, [{ rideID: 1 }]);
      },
    };
    const repo = new RidesRepo(db);

    const ride = await repo.create([1, 2, 3]);

    expect(ride).to.have.property("rideID").that.equal(1);
  });

  it("fail create, db.run", async function () {
    const db = {
      run: function (sql, values, cb) {
        this.lastID = 1;
        expect(sql).eql(
          "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        expect(values).eql([1, 2, 3]);

        return cb.call(this, "FATAL");
      },
    };
    const repo = new RidesRepo(db);

    try {
      await repo.create([1, 2, 3]);
    } catch (ex) {
      expect(ex).equal("FATAL");
    }
  });

  it("fail create, db.all", async function () {
    const db = {
      run: function (sql, values, cb) {
        this.lastID = 1;
        expect(sql).eql(
          "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        expect(values).eql([1, 2, 3]);
        return cb.call(this, null);
      },
      all: function (sql, values, cb) {
        expect(sql).eql("SELECT * FROM Rides WHERE rideID = ?");
        cb("FATAL");
      },
    };
    const repo = new RidesRepo(db);

    try {
      await repo.create([1, 2, 3]);
    } catch (ex) {
      expect(ex).equal("FATAL");
    }
  });

  it("success get all", async function () {
    const db = {
      all: function (sql, cb) {
        expect(sql).eql("SELECT * FROM Rides");
        cb(null, [{ rideID: 1 }]);
      },
    };
    const repo = new RidesRepo(db);

    const rides = await repo.getAll();

    expect(rides).to.have.lengthOf(1);
  });

  it("fails get all", async function () {
    const db = {
      all: function (sql, cb) {
        expect(sql).eql("SELECT * FROM Rides");
        cb("FATAL");
      },
    };
    const repo = new RidesRepo(db);

    try {
      await repo.getAll();
    } catch (ex) {
      expect(ex).equal("FATAL");
    }
  });

  it("success get by id", async function () {
    const id = 1;
    const db = {
      all: function (sql, values, cb) {
        expect(sql).not.eql(`SELECT * FROM Rides WHERE rideID='${id}'`);
        expect(sql).eql(`SELECT * FROM Rides WHERE rideID=?`);
        expect(values).eql([id]);
        cb(null, [{ rideID: 1 }]);
      },
    };
    const repo = new RidesRepo(db);

    const ride = await repo.getById(id);

    expect(ride).to.have.property("rideID").that.equal(1);
  });

  it("fails get by id", async function () {
    const id = 1;
    const db = {
      all: function (sql, values, cb) {
        expect(sql).eql(`SELECT * FROM Rides WHERE rideID=?`);
        expect(values).eql([id]);
        cb("FATAL");
      },
    };
    const repo = new RidesRepo(db);

    try {
      await repo.getById(id);
    } catch (ex) {
      expect(ex).equal("FATAL");
    }
  });
});

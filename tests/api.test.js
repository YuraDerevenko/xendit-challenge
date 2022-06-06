"use strict";

const request = require("supertest");
const faker = require("faker");
const { expect } = require("chai");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const app = require("../src/app")(db);
const buildSchemas = require("../src/schemas");

const runQueryAsPromise = (sql, params) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });

const generateRide = () => ({
  start_lat: faker.random.number({
    min: -90,
    max: 90,
  }),
  start_long: faker.random.number({
    min: -180,
    max: 180,
  }),
  end_lat: faker.random.number({
    min: -90,
    max: 90,
  }),
  end_long: faker.random.number({
    min: -180,
    max: 180,
  }),
  rider_name: faker.lorem.word(),
  driver_name: faker.lorem.word(),
  driver_vehicle: faker.lorem.word(),
});

describe("API tests", () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });

  describe("POST /rides", () => {
    const validationErrorCode = "VALIDATION_ERROR";

    it("should create ride", async () => {
      const rideInput = generateRide();

      const { body } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(200);

      expect(body).to.have.property("rideID").that.equal(1);
      expect(body).to.have.property("startLat");
      expect(body).to.have.property("startLong");
      expect(body).to.have.property("endLat");
      expect(body).to.have.property("startLong");
      expect(body).to.have.property("riderName");
      expect(body).to.have.property("driverName");
      expect(body).to.have.property("driverVehicle");
      expect(body).to.have.property("created");
    });

    it("fail create ride with wrong start_lat", async () => {
      const message =
        "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively";
      let rideInput = generateRide();
      rideInput.start_lat = -91;

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);

      rideInput = generateRide();
      rideInput.start_lat = 91;

      const { body: secondResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(secondResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(secondResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong start_long", async () => {
      const message =
        "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively";
      let rideInput = generateRide();
      rideInput.start_long = -181;

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);

      rideInput = generateRide();
      rideInput.start_long = 181;

      const { body: secondResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(secondResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(secondResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong end_lat", async () => {
      const message =
        "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively";
      let rideInput = generateRide();
      rideInput.end_lat = -91;

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);

      rideInput = generateRide();
      rideInput.end_lat = 91;

      const { body: secondResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(secondResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(secondResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong end_long", async () => {
      const message =
        "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively";
      let rideInput = generateRide();
      rideInput.end_long = -181;

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);

      rideInput = generateRide();
      rideInput.end_long = 181;

      const { body: secondResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(secondResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(secondResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong rider_name", async () => {
      const message = "Rider name must be a non empty string";
      let rideInput = generateRide();
      rideInput.rider_name = "";

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong driver_name", async () => {
      const message = "Driver name must be a non empty string";
      let rideInput = generateRide();
      rideInput.driver_name = "";

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);
    });

    it("fail create ride with wrong driver_vehicle", async () => {
      const message = "Driver vehicle must be a non empty string";
      let rideInput = generateRide();
      rideInput.driver_vehicle = "";

      const { body: firstResponse } = await request(app)
        .post("/rides")
        .send(rideInput)
        .expect(400);

      expect(firstResponse)
        .to.have.property("error_code")
        .that.equal(validationErrorCode);
      expect(firstResponse).to.have.property("message").that.equal(message);
    });
  });

  describe("GET /rides", () => {
    before(async () => {
      await runQueryAsPromise("DELETE FROM Rides");
    });

    it("fail fetch rides on empty db", async () => {
      const message = "Could not find any rides";

      const { body } = await request(app).get("/rides").expect(400);

      expect(body)
        .to.have.property("error_code")
        .that.equal("RIDES_NOT_FOUND_ERROR");
      expect(body).to.have.property("message").that.equal(message);
    });

    it("should fetch rides", async () => {
      const {
        start_lat,
        start_long,
        end_lat,
        end_long,
        rider_name,
        driver_name,
        driver_vehicle,
      } = generateRide();
      const sql =
        "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)";

      await runQueryAsPromise(sql, [
        start_lat,
        start_long,
        end_lat,
        end_long,
        rider_name,
        driver_name,
        driver_vehicle,
      ]);
      const { body } = await request(app).get("/rides").expect(200);

      expect(body).to.have.lengthOf(1)
      expect(body[0]).to.have.property("rideID");
      expect(body[0]).to.have.property("startLat");
      expect(body[0]).to.have.property("startLong");
      expect(body[0]).to.have.property("endLat");
      expect(body[0]).to.have.property("startLong");
      expect(body[0]).to.have.property("riderName");
      expect(body[0]).to.have.property("driverName");
      expect(body[0]).to.have.property("driverVehicle");
      expect(body[0]).to.have.property("created");
    });
  });

  describe("GET /rides/:id", () => {
    before(async () => {
      await runQueryAsPromise("DELETE FROM Rides");
      const {
        start_lat,
        start_long,
        end_lat,
        end_long,
        rider_name,
        driver_name,
        driver_vehicle,
      } = generateRide();
      const sql =
        "INSERT INTO Rides(rideID, startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      await runQueryAsPromise(sql, [
        1,
        start_lat,
        start_long,
        end_lat,
        end_long,
        rider_name,
        driver_name,
        driver_vehicle,
      ]);
    });

    it("fail fetch ride which does not exits in db", async () => {
      const message = "Could not find any rides";

      const { body } = await request(app).get("/rides/5").expect(400);

      expect(body)
        .to.have.property("error_code")
        .that.equal("RIDES_NOT_FOUND_ERROR");
      expect(body).to.have.property("message").that.equal(message);
    });

    it("should fetch rides", async () => {
     
      const { body } = await request(app).get("/rides/1").expect(200);

      expect(body).to.have.property("rideID");
      expect(body).to.have.property("startLat");
      expect(body).to.have.property("startLong");
      expect(body).to.have.property("endLat");
      expect(body).to.have.property("startLong");
      expect(body).to.have.property("riderName");
      expect(body).to.have.property("driverName");
      expect(body).to.have.property("driverVehicle");
      expect(body).to.have.property("created");
    });
  });
});

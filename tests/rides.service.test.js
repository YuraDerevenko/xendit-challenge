"use strict";

const { expect } = require("chai");
const faker = require("faker");

const RidesService = require("../src/features/rides/service");

const generateRideInput = () => ({
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

const generateRide = (input) => ({
  rideID: faker.random.number({ min: 1 }),
  startLat: input.start_lat,
  startLong: input.start_long,
  endLat: input.end_lat,
  endLong: input.end_long,
  riderName: input.rider_name,
  driverName: input.driver_name,
  driverVehicle: input.driver_vehicle,
  created: faker.date.past(),
});

describe("Rides service tests", () => {
  it("success create", async function () {
    const data = generateRideInput();
    const result = generateRide(data);

    const repo = {
      create: async (params) => {
        expect(params.length).eql(Object.keys(data).length);
        return Promise.resolve(result);
      },
    };
    const service = new RidesService(repo);

    const ride = await service.createRide(data);

    expect(ride).eql(result);
  });

  it("fail create, repo failed", async function () {
    const data = generateRideInput();

    const repo = {
      create: async (params) => {
        expect(params.length).eql(Object.keys(data).length);
        return Promise.reject("FATAL");
      },
    };
    const service = new RidesService(repo);

    try {
      await service.createRide(data);
    } catch (ex) {
      expect(ex).equal("FATAL");
    }
  });

  it("fail create, validation failed", async function () {
    const data = generateRideInput();
    data.start_lat = 91;

    const repo = {
      create: async () => {},
    };
    const service = new RidesService(repo);

    try {
      await service.createRide(data);
    } catch (ex) {
      expect(ex).to.have.property("error_code").that.eql("VALIDATION_ERROR");
    }
  });

  it("success get rides", async function () {
    const result = generateRide(generateRideInput());

    const repo = {
      getAll: async () => Promise.resolve([result]),
    };
    const service = new RidesService(repo);

    const rides = await service.getRides();

    expect(rides).to.have.lengthOf(1);
  });

  it("fail get rides, not found", async function () {
    const repo = {
      getAll: async () => Promise.resolve([]),
    };
    const service = new RidesService(repo);

    try {
      await service.getRides();
    } catch (ex) {
      expect(ex)
        .to.have.property("error_code")
        .that.eql("RIDES_NOT_FOUND_ERROR");
    }
  });

  it("success get ride by id", async function () {
    const result = generateRide(generateRideInput());

    const repo = {
      getById: async () => Promise.resolve(result),
    };
    const service = new RidesService(repo);

    const ride = await service.getRideById(result.rideID);

    expect(ride).to.eql(result);
  });

  it("fail get ride by id, not found", async function () {
    const repo = {
      getById: async () => Promise.resolve({}),
    };
    const service = new RidesService(repo);

    try {
      await service.getRideById();
    } catch (ex) {
      expect(ex)
        .to.have.property("error_code")
        .that.eql("RIDES_NOT_FOUND_ERROR");
    }
  });
});

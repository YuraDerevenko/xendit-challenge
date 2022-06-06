class RideRequestHandler {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    const { body } = req;
    const ride = await this.service.createRide(body);

    return res.send(ride);
  }

  async getAll(req, res) {
    const rides = await this.service.getRides();

    return res.send(rides);
  }

  async getById(req, res) {
    const { id } = req.params;
    const ride = await this.service.getRideById(id);

    return res.send(ride);
  }
}

module.exports = RideRequestHandler;

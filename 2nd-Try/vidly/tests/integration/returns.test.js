// POST /api/returns {customerId, movieId}

const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');
const request = require('supertest'); // This helps to mock HTTP reqs

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = ()  => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId: customerId, movieId: movieId });
  };

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '01234'},
      numberInStock: 10
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '01234',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  })

  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  // NEGATIVE

  // Return 401 if client is not logged in
  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  // Return 400 if customerId is not provided
  it('should return 400 if customerId is not provided', async() => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 400 if movieId is not provided
  it('should return 400 if movieId is not provided', async() => {
    movieId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  // Return 400 if movieId is not provided
  it('should return 404 if no rental found for this customer/movie combo', async() => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  // Return 400 if rental already processed
  it('should return 400 if rental is already processed', async() => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  // POSITIVE

  // Return 200 if valid request
  it('should return 200 if we have a valid request', async() => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  // Set the return date
  it('should return set the returnDate if input is valid', async() => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  // Calculate the rental fee
  it('should set the rentalFee if input is valid', async() => {
    // Gives us a moment object that is 7 days before
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  // Increase inventory
  it('should increase the movie inventory', async() => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if input is valid', async() => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(res.body).toHaveProperty('dateOut');
    expect(res.body).toHaveProperty('dateReturned');
    expect(res.body).toHaveProperty('rentalFee');
    expect(res.body).toHaveProperty('customer');
    expect(res.body).toHaveProperty('movie');

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie'
      ]));
  });
});
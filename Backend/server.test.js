const assert = require('assert'); // Default assertion available in node https://nodejs.org/api/assert.html#assert_assert
const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
// const { Sequelize, Op } = require('sequelize');
// const { getMaxListeners } = require('./server');
const app = require('./server');
const agent = require('chai').request.agent(app);

describe('POST user login API call', () => {
  it('should return status 200', async () => {
    const res = await agent.post('/user/login').send({ email: 'user1@gmail.com', password: 'user1' });
    expect(res).to.have.status(200);
  });
});

describe('PUT accept group invite API call', () => {
  it('should return status 200', async () => {
    const res = await agent.put('/group/accept').send({ group: '608529762c88142ec9962736', user: '608517fa2c88142ec99626e6' });
    expect(res).to.have.status(200);
  });
});


describe('GET group list API call', () => {
  it('should return group list with status 200', async () => {
    const res = await agent.get('/group/all').query({ user: '608517fa2c88142ec99626e6' });;
    expect(res).to.have.status(200);
  });
});

describe('POST add expense API call', () => {
  it('should return status 200', async () => {
    const res = await agent.post('/group/expense/add')
      .send({
        group: '608529762c88142ec9962736',
        description: 'chai test',
        amount: 30,
        payor: '608517fa2c88142ec99626e6',
      });
    expect(res).to.have.status(200);
  });
});

describe('GET user activity API call', () => {
  it('should return activities with status 200', async () => {
    const res = await agent.get('/activity').query({ user: '608517fa2c88142ec99626e6' });
    expect(res).to.have.status(200);
  });
});



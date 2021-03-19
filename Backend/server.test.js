const assert = require('assert'); // Default assertion available in node https://nodejs.org/api/assert.html#assert_assert
const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');
const { Sequelize, Op } = require('sequelize');
const { getMaxListeners } = require('./server');
const app = require('./server');
const agent = require('chai').request.agent(app);

describe('POST user login API call', () => {
  it('should return status 200', async () => {
    const res = await agent.post('/user/login').send({ email: 'admin@gmail.com', password: 'admin' });
    expect(res).to.have.status(200);
  });
});

describe('PUT accept group invite API call', () => {
  it('should return status 200', async () => {
    const res = await agent.put('/group/accept').send({ groupName: 'test1', userEmail: 'admin2@gmail.com' });
    expect(res).to.have.status(200);
  });
});

describe('GET user profile API call', () => {
  it('should return user profile with specific email', async () => {
    const res = await agent.get('/user/profile/test@gmail.com');
    expect(res.body.email).to.equal('test@gmail.com');
  });
});

describe('GET group expenses API call', () => {
  it('should return expenses with status 200', async () => {
    const res = await agent.get('/group/expense/test2');
    expect(res).to.have.status(200);
  });
});

describe('POST add expense API call', () => {
  it('should return status 200', async () => {
    const res = await agent.post('/group/expense/add')
      .send({
        group: 'test2',
        description: 'grocery',
        amount: 30,
        email: 'admin@gmail.com',
      });
    expect(res).to.have.status(200);
  });
});

// describe('GET user activity API call', () => {
//   it('should return activities with status 200', async () => {
//     const res = await agent.get('/activity').query({ user: 'admin@gmail.com' });
//     expect(res).to.have.status(200);
//   });
// });



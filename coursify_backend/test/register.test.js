const chai = require('chai');
const sinon = require('sinon');
const { registerUser } = require('../controllers/authController'); // adjust path
const pool = require('../config/db'); // adjust path
const bcrypt = require('bcrypt');
const validator = require('validator');

const expect = chai.expect;

describe('registerUser Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'TestUser',
        email: 'test@example.com',
        password: 'Password@1',
        confirmPassword: 'Password@1',
        role: 'Student'
      }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    sinon.stub(pool, 'query');
    sinon.stub(bcrypt, 'genSalt').resolves('salt');
    sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 400 if password is less than 8 letters', async () => {
    req.body.password = 'P@1';
    req.body.confirmPassword = 'P@1';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 if password lacks uppercase letter', async () => {
    req.body.password = 'password@1';
    req.body.confirmPassword = 'password@1';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 if password lacks number', async () => {
    req.body.password = 'Password@';
    req.body.confirmPassword = 'Password@';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 if password lacks symbol', async () => {
    req.body.password = 'Password1';
    req.body.confirmPassword = 'Password1';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 for invalid email format', async () => {
    req.body.email = 'invalidemail';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 400 if role is invalid', async () => {
    req.body.role = 'Hacker';

    pool.query.resolves({ rows: [] });

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });


  it('should return 400 if email already exists', async () => {
    pool.query.onCall(0).resolves({ rows: [] }); // students
    pool.query.onCall(1).resolves({ rows: [{ id: 1 }] }); // instructors
    pool.query.onCall(2).resolves({ rows: [] }); // admins

    await registerUser(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Email already in use.' })).to.be.true;
  });

  it('should register user successfully if valid', async () => {
    pool.query.onCall(0).resolves({ rows: [] }); // students
    pool.query.onCall(1).resolves({ rows: [] }); // instructors
    pool.query.onCall(2).resolves({ rows: [] }); // admins
    pool.query.onCall(3).resolves({ rows: [{ id: 1, username: 'TestUser', email: 'test@example.com' }] }); // insert user

    await registerUser(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
  });
});

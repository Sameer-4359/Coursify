const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authenticateStudent = require('../middleware/authenticateStudent');
const expect = chai.expect;

describe('authenticateStudent Middleware', () => {
    let req, res, next;
    let consoleErrorStub, consoleLogStub;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer validToken'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();

        // Stub console methods to suppress logs during test runs
        consoleErrorStub = sinon.stub(console, 'error');
        consoleLogStub = sinon.stub(console, 'log');
    });

    afterEach(() => {
        sinon.restore(); // Restores all stubbed methods
    });

    it('should call next() if the token is valid', () => {
        const decodedToken = { id: 'student123' };
        sinon.stub(jwt, 'verify').returns(decodedToken);

        authenticateStudent(req, res, next);

        expect(jwt.verify.calledOnce).to.be.true;
        expect(req.studentId).to.equal(decodedToken.id);
        expect(next.calledOnce).to.be.true;
    });

    it('should return 401 if no token is provided', () => {
        req.headers.authorization = null;

        authenticateStudent(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ error: 'Unauthorized access: No token provided' })).to.be.true;
        expect(next.notCalled).to.be.true;
    });

    it('should return 403 if the token is invalid', () => {
        sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

        authenticateStudent(req, res, next);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ error: 'Forbidden: Invalid or expired token' })).to.be.true;
        expect(next.notCalled).to.be.true;
    });
});

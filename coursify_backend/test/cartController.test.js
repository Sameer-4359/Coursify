const chai = require('chai');
const sinon = require('sinon');
const pool = require('../config/db');
const { addToCart, getCartItems, removeFromCart } = require('../controllers/cartController');
const expect = chai.expect;

describe('Cart Controller', () => {
    let req, res;
    let consoleErrorStub, consoleLogStub;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            studentId: 'student123' // Mocked student ID from token
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        // Suppress console output during tests
        consoleErrorStub = sinon.stub(console, 'error');
        consoleLogStub = sinon.stub(console, 'log');
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubbed methods, including pool.query
    });

    describe('addToCart', () => {
        it('should add a course to the cart successfully', async () => {
            req.body.courseId = 1;

            sinon.stub(pool, 'query')
                .onFirstCall().resolves({ rowCount: 1, rows: [{ is_locked: false }] }) // Check if course is locked
                .onSecondCall().resolves({ rows: [] }) // Course not in the cart
                .onThirdCall().resolves(); // Insert course

            await addToCart(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Course added to cart successfully!' })).to.be.true;
        });

        it('should return 400 if courseId is not provided', async () => {
            await addToCart(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Course ID is required.' })).to.be.true;
        });

        it('should return 404 if the course does not exist', async () => {
            req.body.courseId = 999;

            sinon.stub(pool, 'query').onFirstCall().resolves({ rowCount: 0 });

            await addToCart(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Course not found.' })).to.be.true;
        });

        it('should return 423 if the course is locked', async () => {
            req.body.courseId = 1;

            sinon.stub(pool, 'query').onFirstCall().resolves({ rowCount: 1, rows: [{ is_locked: true }] });

            await addToCart(req, res);

            expect(res.status.calledWith(423)).to.be.true;
            expect(res.json.calledWith({ message: 'Course is currently locked. Try again later.' })).to.be.true;
        });

        it('should return 400 if the course is already in the cart', async () => {
            req.body.courseId = 1;

            sinon.stub(pool, 'query')
                .onFirstCall().resolves({ rowCount: 1, rows: [{ is_locked: false }] })
                .onSecondCall().resolves({ rows: [{ course_id: 1 }] });

            await addToCart(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'This course is already in your cart.' })).to.be.true;
        });

        it('should return 500 if there is a server error', async () => {
            req.body.courseId = 1;

            sinon.stub(pool, 'query').throws(new Error('Database error'));

            await addToCart(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });

    describe('getCartItems', () => {
        it('should return all cart items for a student', async () => {
            req.params.studentId = 'student123';

            const mockCartItems = [
                { course_id: 'course123', title: 'Course 1', price: 100, image_url: 'image1.jpg', instructor_name: 'Instructor 1' },
                { course_id: 'course456', title: 'Course 2', price: 200, image_url: 'image2.jpg', instructor_name: 'Instructor 2' }
            ];

            sinon.stub(pool, 'query').resolves({ rows: mockCartItems });

            await getCartItems(req, res);

            expect(res.json.calledWith(mockCartItems)).to.be.true;
        });

        it('should return 500 if there is a server error', async () => {
            req.params.studentId = 'student123';

            sinon.stub(pool, 'query').throws(new Error('Database error'));

            await getCartItems(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });

    describe('removeFromCart', () => {
        it('should remove a course from the cart successfully', async () => {
            req.params.courseId = 'course123';
            req.studentId = 'student123';

            sinon.stub(pool, 'query').resolves({ rowCount: 1 });

            await removeFromCart(req, res);

            expect(res.json.calledWith({ message: 'Course removed from cart' })).to.be.true;
        });

        it('should return 404 if the course is not in the cart', async () => {
            req.params.courseId = 'course123';
            req.studentId = 'student123';

            sinon.stub(pool, 'query').resolves({ rowCount: 0 });

            await removeFromCart(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Course not found in cart.' })).to.be.true;
        });

        it('should return 500 if there is a server error', async () => {
            req.params.courseId = 'course123';
            req.studentId = 'student123';

            sinon.stub(pool, 'query').throws(new Error('Database error'));

            await removeFromCart(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Server error' })).to.be.true;
        });
    });
});

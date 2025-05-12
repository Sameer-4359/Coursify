const chai = require('chai');
const sinon = require('sinon');
const pool = require('../config/db');
const {
  getAllCourses,
  searchCourses,
  deleteCourse,
  addReview,
  getCourseReviews,
} = require('../controllers/courseController');

const expect = chai.expect;

describe('Course Controller', () => {
  let req, res, consoleErrorStub, consoleLogStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      studentId: 'student123', // Mocked student ID
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Silence console logs and errors
    consoleErrorStub = sinon.stub(console, 'error');
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    // Restore all stubs
    sinon.restore();
  });

  describe('getAllCourses', () => {
    it('should fetch all courses successfully', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', price: 100, img: 'image1.jpg', instructor: 'Instructor 1' },
        { id: 2, title: 'Course 2', price: 200, img: 'image2.jpg', instructor: 'Instructor 2' },
      ];

      sinon.stub(pool, 'query').resolves({ rows: mockCourses });

      await getAllCourses(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockCourses)).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await getAllCourses(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('searchCourses', () => {
    it('should return courses matching the search query', async () => {
      req.query.query = 'course';

      const mockCourses = [
        { id: 1, name: 'Course 1' },
        { id: 2, name: 'Course 2' },
      ];

      sinon.stub(pool, 'query').resolves({ rows: mockCourses });

      await searchCourses(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockCourses)).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.query.query = 'course';

      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await searchCourses(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course successfully', async () => {
      req.params.id = 1;

      sinon.stub(pool, 'query').resolves();

      await deleteCourse(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Course deleted successfully' })).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.params.id = 1;

      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await deleteCourse(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Internal Server Error' })).to.be.true;
    });
  });

  describe('addReview', () => {
    it('should add a review successfully', async () => {
      req.params.courseId = 1;
      req.body = { rating: 5, reviewText: 'Great course!' };

      const mockReview = {
        id: 1,
        course_id: 1,
        student_id: 'student123',
        review_text: 'Great course!',
        rating: 5,
      };

      sinon.stub(pool, 'query').resolves({ rows: [mockReview] });

      await addReview(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'Review submitted successfully!',
        review: mockReview,
      })).to.be.true;
    });

    it('should return 400 if rating or review text is missing', async () => {
      req.params.courseId = 1;
      req.body = { rating: null, reviewText: '' };

      await addReview(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Rating and review text are required.' })).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.params.courseId = 1;
      req.body = { rating: 5, reviewText: 'Great course!' };

      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await addReview(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to submit review', error: 'Database error' })).to.be.true;
    });
  });

  describe('getCourseReviews', () => {
    it('should fetch course reviews successfully', async () => {
      req.params.courseId = 1;

      const mockReviews = [
        { id: 1, review_text: 'Great course!', studentName: 'Student 1' },
        { id: 2, review_text: 'Very informative.', studentName: 'Student 2' },
      ];

      sinon.stub(pool, 'query').resolves({ rows: mockReviews });

      await getCourseReviews(req, res);

      expect(res.json.calledWith(mockReviews)).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.params.courseId = 1;

      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await getCourseReviews(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'Server error', error: 'Database error' })).to.be.true;
    });
  });
});

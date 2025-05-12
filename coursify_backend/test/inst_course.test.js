const chai = require('chai');
const sinon = require('sinon');
const db = require('../config/db');
const {
  getCourses,
  addCourse,
  updateCourse,
  getCourseDetails,
  deleteCourse,
} = require('../controllers/instructorCourseController');
const expect = chai.expect;

describe('Instructor Course Controller', () => {
  let req, res;
  let consoleErrorStub, consoleLogStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: {},
      instructorId: 'instructor123', // Mocked instructor ID
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

  describe('getCourses', () => {
    it('should fetch all courses for the instructor', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', price: 100 },
        { id: 2, title: 'Course 2', price: 200 },
      ];

      sinon.stub(db, 'query').resolves({ rows: mockCourses });

      await getCourses(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockCourses)).to.be.true;
      expect(consoleErrorStub.notCalled).to.be.true; // Ensure no errors were logged
    });

    it('should return 500 if there is a server error', async () => {
      sinon.stub(db, 'query').throws(new Error('Database error'));

      await getCourses(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to fetch courses' })).to.be.true;
      expect(consoleErrorStub.called).to.be.true; // Error is logged, but stubbed
    });
  });

  describe('addCourse', () => {
    it('should add a new course successfully', async () => {
      req.body = {
        title: 'New Course',
        price: 100,
        description: 'Course description',
        imageUrl: 'image.jpg',
        modules: [
          {
            title: 'Module 1',
            lessons: [
              { title: 'Lesson 1', video_url: 'video1.mp4', assignment_url: 'assignment1.pdf' },
            ],
          },
        ],
      };

      sinon.stub(db, 'query')
        .onFirstCall().resolves({ rows: [{ id: 1 }] }) // Insert course
        .onSecondCall().resolves({ rows: [{ id: 1 }] }) // Insert module
        .onThirdCall().resolves(); // Insert lesson

      await addCourse(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: 'Course added successfully', courseId: 1 })).to.be.true;
      expect(consoleErrorStub.notCalled).to.be.true; // Ensure no errors were logged
    });

    it('should return 500 if there is a server error', async () => {
      sinon.stub(db, 'query').throws(new Error('Database error'));

      await addCourse(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to add course' })).to.be.true;
      expect(consoleErrorStub.called).to.be.true; // Error is logged, but stubbed
    });
  });

  describe('getCourseDetails', () => {
    it('should fetch course details successfully', async () => {
      req.params.courseId = 1;

      const mockCourseDetails = {
        title: 'Course 1',
        price: 100,
        description: 'Course description',
        image_url: 'image.jpg',
        instructorName: 'Instructor 1',
        modules: [
          {
            id: 1,
            title: 'Module 1',
            lessons: [
              { id: 1, title: 'Lesson 1', video_url: 'video1.mp4', assignment_url: 'assignment1.pdf' },
            ],
          },
        ],
      };

      sinon.stub(db, 'query').resolves({ rows: [mockCourseDetails], rowCount: 1 });

      await getCourseDetails(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(mockCourseDetails)).to.be.true;
      expect(consoleErrorStub.notCalled).to.be.true; // Ensure no errors were logged
    });

    it('should return 404 if the course is not found', async () => {
      req.params.courseId = 1;

      sinon.stub(db, 'query').resolves({ rowCount: 0 });

      await getCourseDetails(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Course not found' })).to.be.true;
      expect(consoleErrorStub.notCalled).to.be.true; // Ensure no errors were logged
    });

    it('should return 500 if there is a server error', async () => {
      sinon.stub(db, 'query').throws(new Error('Database error'));

      await getCourseDetails(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to fetch course details' })).to.be.true;
      expect(consoleErrorStub.called).to.be.true; // Error is logged, but stubbed
    });
  });
});
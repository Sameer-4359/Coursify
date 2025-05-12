const chai = require('chai');
const sinon = require('sinon');
const { cloudinary } = require('../config/cloudinary');
const pool = require('../config/db');
const streamifier = require('streamifier');
const {
  uploadVideo,
  uploadAssignment,
} = require('../controllers/uploadController');
const expect = chai.expect;

describe('Upload Controller', () => {
  let req, res;
  let consoleErrorStub, consoleLogStub;

  beforeEach(() => {
    req = {
      body: {},
      file: {},
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

  describe('uploadVideo', () => {
    it('should return 400 if no video file is uploaded', async () => {
      req.file = null;

      await uploadVideo(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'No video file uploaded' })).to.be.true;
    });

    it('should return 404 if the lesson does not exist', async () => {
      req.file = { path: 'test/video.mp4' };
      req.body.lessonId = 1;

      // Mock database query for lesson existence
      sinon.stub(pool, 'query').resolves({ rows: [] });

      await uploadVideo(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Lesson not found' })).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.file = { path: 'test/video.mp4' };
      req.body.lessonId = 1;

      // Mock database query for lesson existence to throw an error
      sinon.stub(pool, 'query').throws(new Error('Database error'));

      await uploadVideo(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        error: 'Failed to upload video',
        details: 'Database error',
      })).to.be.true;
    });
  });

  describe('uploadAssignment', () => {
    it('should return 400 if no PDF file is uploaded', async () => {
      req.file = null;

      await uploadAssignment(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'No PDF file uploaded' })).to.be.true;
    });

    it('should return 500 if there is a server error', async () => {
      req.file = {
        buffer: Buffer.from('test pdf content'),
        originalname: 'test.pdf',
      };
      req.body = { lessonId: 1, description: 'Test assignment' };

      // Mock Cloudinary upload to throw an error
      const uploadStreamStub = sinon.stub(cloudinary.uploader, 'upload_stream');
      uploadStreamStub.callsFake((options, callback) => {
        callback(new Error('Cloudinary error'), null);
      });

      await uploadAssignment(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Failed to upload assignment' })).to.be.true;
    });
  });
});

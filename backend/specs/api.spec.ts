/**
 *  Hier definieren wir verschiedene Unittests.
 *  Jeder Unittest muss in dem "specs" Ordner liegen und mit ".spec.ts" enden.
 *  Weitere Information im "Unit Testing" Video in Sprint 4.
 */
import { Database } from '../src/database';
import request from 'supertest';
import app from '../src/app';
import sinon from 'sinon';

describe('GET /api', () => {

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(Database.prototype, 'initDB').callsFake(async () => { return; });    // Mock the database connection
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 200 OK', () => {

    

    return request(app)
      .get('/api')
      .expect(200);
  });
});

import test from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import { UserBook } from '../../models/index.js';
import { addBookToLibrary } from '../../app/controllers/library-controller.js';

test('addBookToLibrary > adds book if not exists', async () => {
  const req = {
    session: { user: { id: 1 } },
    body: { bookId: 42, status: 'to_read' }
  };
  const res = {
    statusCode: null,
    jsonBody: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.jsonBody = obj; return this; }
  };

  /* fake (stub) findorcreate */
  const findOrCreateStub = sinon.stub(UserBook, 'findOrCreate').resolves([{ id: 1, status: 'to_read' }, true]);

  await addBookToLibrary(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.jsonBody, { success: true });

  findOrCreateStub.restore();
});

test('addBookToLibrary > updates book if already exists', async () => {
  const userBookStub = { status: 'read', save: sinon.fake.resolves() };

  const req = {
    session: { user: { id: 1 } },
    body: { bookId: 42, status: 'to_read' }
  };
  const res = {
    statusCode: null,
    jsonBody: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.jsonBody = obj; return this; }
  };

  /*fake "exists"*/
  const findOrCreateStub = sinon.stub(UserBook, 'findOrCreate').resolves([userBookStub, false]);

  await addBookToLibrary(req, res);

  assert.strictEqual(userBookStub.status, 'to_read');
  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.jsonBody, { success: true });

  findOrCreateStub.restore();
});

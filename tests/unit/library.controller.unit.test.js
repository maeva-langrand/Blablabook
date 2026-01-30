import test from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import  * as libraryController from '../../app/controllers/library-controller.js';
import { UserBook } from '../../models/index.js';

test('removeBookFromLibrary > book not found returns 404', async () => {
  const req = { session: { user: { id: 1 } }, body: { bookId: 42 } };
  let statusCode, body;
  const res = {
    status: code => { statusCode = code; return res; },
    json: obj => { body = obj; return res; }
  };

  const findOneStub = sinon.stub(UserBook, "findOne").resolves(null);

  await libraryController.removeBookFromLibrary(req, res);

  assert.strictEqual(statusCode, 404);
  assert.deepStrictEqual(body, { error: "Livre non trouvé dans votre bibliothèque" });

  findOneStub.restore();
});

test('addBookToLibrary > existing userBook updates status', async () => {
  const req = { session: { user: { id: 1 } }, body: { bookId: 1, status: "read" } };
  let statusCode, body;
  const res = {
    status: code => { statusCode = code; return res; },
    json: obj => { body = obj; return res; }
  };

  const fakeUserBook = { save: sinon.fake(), status: "to_read" };
  const findOrCreateStub = sinon.stub(UserBook, "findOrCreate").resolves([fakeUserBook, false]);

  await libraryController.addBookToLibrary(req, res);

  assert.strictEqual(fakeUserBook.status, "read");
  assert.strictEqual(statusCode, 200);
  assert.strictEqual(body.success, true);

  findOrCreateStub.restore();
});
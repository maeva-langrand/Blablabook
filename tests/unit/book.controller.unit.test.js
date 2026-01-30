import test from "node:test";
import assert from "node:assert";
import sinon from "sinon";
import * as bookController from "../../app/controllers/book-controller.js";
import { Book } from "../../models/index.js";

test('showBookDetailsPage > non-existing book = next + error', async () => {
  const req = { params: { id: 99 }, session: { user: { id: 1 } } };
  let nextError;
  const res = { render: sinon.fake() };
  const next = err => { nextError = err; };

  const findByPkStub = sinon.stub(Book, "findByPk").resolves(null);

  await bookController.showBookDetailsPage(req, res, next);

  assert.strictEqual(nextError.statusCode, 404);
  assert.strictEqual(nextError.type, "BOOK_NOT_FOUND");

  findByPkStub.restore();
});

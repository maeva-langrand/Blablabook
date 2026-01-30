// tests/integration/auth-library.integration.test.js
import test from "node:test";
import assert from "node:assert";
import sinon from "sinon";
import argon2 from "argon2";
import * as authController from "../../app/controllers/auth-controller.js";
import * as libraryController from "../../app/controllers/library-controller.js";
import { User } from "../../models/user.model.js";
import { UserBook } from "../../models/index.js";

test("registerUser > crée un utilisateur dans la <<fausse>> base", async () => {
  const req = {
    validatedData: { username: "alice", email: "alice@test.com", password: "secret" },
    body: { username: "alice", email: "alice@test.com" },
    session: {}
  };

  const res = {
    status: function(code) { this.statusCode = code; return this; },
    redirect: function(url) { this.url = url; return this; },
    render: function() {}
  };

  /* stub user doesnt already exist*/
  const findOneStub = sinon.stub(User, "findOne").resolves(null);

  
  const fakeUser = { id: 1, username: "alice", email: "alice@test.com" };
  const createStub = sinon.stub(User, "create").resolves(fakeUser);

  await authController.registerUser(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.url, "/");
  assert.deepStrictEqual(req.session.user.username, "alice");

  findOneStub.restore();
  createStub.restore();
});

test("addBookToLibrary > ajoute un livre via le datamapper", async () => {
  const req = { 
    session: { user: { id: 1 } }, 
    body: { bookId: 42, status: "to_read" } 
  };
  const res = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(obj) { this.body = obj; return this; }
  };

  const userBookStub = {
    save: sinon.fake.resolves()
  };
  const findOrCreateStub = sinon.stub(UserBook, "findOrCreate").resolves([userBookStub, true]);

  await libraryController.addBookToLibrary(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.deepStrictEqual(res.body, { success: true });

  findOrCreateStub.restore();
});

test("login > crée  la session utilisateur", async () => {
  const req = { 
    validatedData: { username: "alice", password: "secret" },
    body: { username: "alice" },
    session: {}
  };
  const res = {
    status: function(code) { this.statusCode = code; return this; },
    redirect: function(url) { this.url = url; return this; },
    render: function() {}
  };

  const fakeUser = { 
    id: 1, 
    username: "alice", 
    email: "alice@test.com", 
    password: "$argon2hash$" /*fake*/
  };
  const findOneStub = sinon.stub(User, "findOne").resolves(fakeUser);

  const verifyStub = sinon.stub(argon2, "verify").resolves(true);

  await authController.login(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.url, "/");
  assert.deepStrictEqual(req.session.user.username, "alice");

  findOneStub.restore();
  verifyStub.restore();
});

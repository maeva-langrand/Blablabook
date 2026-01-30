import test from "node:test";
import assert from "node:assert";
import sinon from "sinon";
import * as authController from "../../app/controllers/auth-controller.js";
import { User } from "../../models/user.model.js";


test('showLoginPage > renders login page with optional success message', () => {
  const req = { query: { success: "password-reset" } };
  let rendered;
  const res = { render: (view, data) => { rendered = { view, data }; } };

  authController.showLoginPage(req, res);

  assert.strictEqual(rendered.view, "login.ejs");
  assert.strictEqual(rendered.data.success, "Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.");
});

test('registerUser > existing username returns conflict', async () => {
  const req = {
    validatedData: { username: "Alice", email: "a@b.com", password: "pwd" },
    body: { username: "Alice", email: "a@b.com" },
    session: {}
  };
  let statusCode, rendered;
  const res = {
    status: code => { statusCode = code; return res; },
    render: (view, data) => { rendered = data; return res; }
  };

  const findOneStub = sinon.stub(User, "findOne").resolves({ username: "Alice" });

  await authController.registerUser(req, res);

  assert.strictEqual(statusCode, 409);
  assert.strictEqual(rendered.error.includes("nom d'utilisateur"), true);

  findOneStub.restore();
});

test('login >wrong username returns 401', async () => {
  const req = { validatedData: { username: "bob", password: "pwd" }, body: { username: "bob" }, session: {} };
  let statusCode, rendered;
  const res = {
    status: code => { statusCode = code; return res; },
    render: (view, data) => { rendered = data; return res; }
  };

  const findOneStub = sinon.stub(User, "findOne").resolves(null);

  await authController.login(req, res);

  assert.strictEqual(statusCode, 401);
  assert.strictEqual(rendered.error.includes("incorrect"), true);

  findOneStub.restore();
});

test('forgotPassword > email not found still returns generic success', async () => {
  const req = { validatedData: { email: "nonexist@b.com" }, protocol: "http", get: () => "localhost" };
  let rendered;
  const res = {
    status: () => res,
    render: (view, data) => { rendered = data; return res; }
  };

  const findOneStub = sinon.stub(User, "findOne").resolves(null);

  await authController.forgotPassword(req, res);

  assert.strictEqual(rendered.success.includes("Si un compte existe"), true);

  findOneStub.restore();
});

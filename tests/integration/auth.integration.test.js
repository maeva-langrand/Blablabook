import test from 'node:test';
import assert from 'node:assert';
import sinon from 'sinon';
import argon2 from 'argon2';

import { User } from '../../models/user.model.js';
import { registerUser, login } from '../../app/controllers/auth-controller.js';

test('registerUser > creates a new user and opens session', async () => {
  const req = {
    validatedData: { username: 'john', email: 'john@example.com', password: 'secret' },
    body: { username: 'john', email: 'john@example.com' },
    session: {}
  };
  const res = {
    statusCode: null,
    redirectUrl: null,
    status(code) { this.statusCode = code; return this; },
    redirect(url) { this.redirectUrl = url; return this; },
    render() { return this; }
  };

  /* SImulation = user doesnt exists */
  const findOneStub = sinon.stub(User, 'findOne').resolves(null);

  const hashStub = sinon.stub(argon2, 'hash').resolves('hashedpassword');

  const createStub = sinon.stub(User, 'create').resolves({
    id: 1,
    username: 'john',
    email: 'john@example.com'
  });

  await registerUser(req, res);

  assert.strictEqual(res.statusCode, 201);
  assert.strictEqual(res.redirectUrl, '/');
  assert.deepStrictEqual(req.session.user, {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    isNew: true
  });

  findOneStub.restore();
  hashStub.restore();
  createStub.restore();
});

test('login> successful login sets session', async () => {
  const req = {
    validatedData: { username: 'john', password: 'secret' },
    body: { username: 'john' },
    session: {}
  };
  const res = {
    statusCode: null,
    redirectUrl: null,
    status(code) { this.statusCode = code; return this; },
    redirect(url) { this.redirectUrl = url; return this; },
    render() { return this; }
  };

  /* Fake user exists */
  const findOneStub = sinon.stub(User, 'findOne').resolves({
    id: 1,
    username: 'john',
    email: 'john@example.com',
    password: 'hashedpassword'
  });

  /* fake correct password*/
  const verifyStub = sinon.stub(argon2, 'verify').resolves(true);

  await login(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.redirectUrl, '/');
  assert.deepStrictEqual(req.session.user, {
    id: 1,
    username: 'john',
    email: 'john@example.com'
  });

  findOneStub.restore();
  verifyStub.restore();
});

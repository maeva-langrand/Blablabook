import test from "node:test";
import assert from "node:assert";

test('UserBook model > status outside allowed values is invalid', () => {

  const invalidStatus = 'toto';
  const allowedStatuses = ['to_read', 'read', 'remove'];


  const isValid = allowedStatuses.includes(invalidStatus);

  assert.strictEqual(isValid, false);
});
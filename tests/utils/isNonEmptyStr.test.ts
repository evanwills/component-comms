import { assertEquals } from 'jsr:@std/assert';
import { isNonEmptyStr } from '../../src/utils.ts';

Deno.test(
  'isNonEmptyStr() returns FALSE when given a undefined.',
  () => { assertEquals(isNonEmptyStr(undefined), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given `number`.',
  () => { assertEquals(isNonEmptyStr(0), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given `string`.',
  () => { assertEquals(isNonEmptyStr(null), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given `boolean`.',
  () => { assertEquals(isNonEmptyStr(true), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given empty string.',
  () => { assertEquals(isNonEmptyStr(""), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given string only containing white space characters.',
  () => { assertEquals(isNonEmptyStr(" "), false); },
);

Deno.test(
  'isNonEmptyStr() returns FALSE when given `object`.',
  () => { assertEquals(isNonEmptyStr({}), false); },
);

Deno.test(
  'isNonEmptyStr() returns TRUE when given a non-empty string.',
  () => { assertEquals(isNonEmptyStr("string"), true); },
);

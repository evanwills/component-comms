import { assertEquals } from 'jsr:@std/assert';
import { isObj } from '../../src/utils.ts';

Deno.test(
  'isObj() returns FALSE when given a undefined.',
  () => { assertEquals(isObj(undefined), false); },
);

Deno.test(
  'isObj() returns FALSE when given `number`.',
  () => { assertEquals(isObj(0), false); },
);

Deno.test(
  'isObj() returns FALSE when given `string`.',
  () => { assertEquals(isObj(null), false); },
);

Deno.test(
  'isObj() returns FALSE when given `boolean`.',
  () => { assertEquals(isObj(true), false); },
);

Deno.test(
  'isObj() returns TRUE when given `object`.',
  () => { assertEquals(isObj({}), true); },
);

Deno.test(
  'isObj() returns FALSE when given an object created by calling a constructor.',
  () => { assertEquals(isObj(new Date()), false); },
);

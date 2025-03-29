import { assertEquals } from 'jsr:@std/assert';
import { propIsNonEmptyStr } from '../../src/utils.ts';

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is `undefined`.',
  () => { assertEquals(propIsNonEmptyStr(undefined, 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is a `number`.',
  () => { assertEquals(propIsNonEmptyStr(0, 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is `null`.',
  () => { assertEquals(propIsNonEmptyStr(null, 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is a `string`.',
  () => { assertEquals(propIsNonEmptyStr('foo', 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is `boolean`.',
  () => { assertEquals(propIsNonEmptyStr(true, 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is an empty string.',
  () => { assertEquals(propIsNonEmptyStr("", 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is string only containing white space characters.',
  () => { assertEquals(propIsNonEmptyStr(" ", 'prop'), false); },
);

Deno.test(
  'propIsNonEmptyStr() returns FALSE when first param is an `object` that does not have a "prop" property.',
  () => {
    assertEquals(
      propIsNonEmptyStr({ chicken: 'foo' }, 'prop'),
      false,
    );
  },
);

Deno.test(
  'propIsNonEmptyStr() returns TRUE when first param is an `object` with a "prop" property with a value of "foo".',
  () => {
    assertEquals(
      propIsNonEmptyStr({ prop: 'foo' }, 'prop'),
      true,
    );
  },
);

Deno.test(
  'propIsNonEmptyStr() returns TRUE when first param is an `object` with a "prop" property that is an empty string.',
  () => {
    assertEquals(
      propIsNonEmptyStr({ prop: '' }, 'prop'),
      false,
    );
  },
);

Deno.test(
  'propIsNonEmptyStr() returns TRUE when when first param is an `object` with a "prop" property that is a string containing only white space characters.',
  () => {
    assertEquals(
      propIsNonEmptyStr({ prop: '\n\t' }, 'prop'),
      false,
    );
  },
);

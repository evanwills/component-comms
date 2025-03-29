import { assertEquals } from 'jsr:@std/assert';
import { getLogBits } from '../../src/utils.ts';
import type { TLogBits } from '../../src/comms.d.ts';

Deno.test(
  'getLogBits() returns an object when empty string is supplied',
  () => {
    const bits : TLogBits = getLogBits('');
    assertEquals(Object.prototype.toString.call(bits), '[object Object]');
  },
);

Deno.test(
  'getLogBits() returns an object with string properties: `ext` and `src` when empty string is supplied',
  () => {
    const bits : TLogBits = getLogBits('');
    assertEquals(typeof bits.ext, 'string');
    assertEquals(typeof bits.src, 'string');
  },
);

Deno.test(
  'getLogBits() returns an object with string properties: `ext` and `src` that are both empty when empty string is supplied',
  () => {
    const bits : TLogBits = getLogBits('');
    assertEquals(bits.ext, '');
    assertEquals(bits.src, '');
  },
);

Deno.test(
  'getLogBits() returns an object when "componentName" string is supplied',
  () => {
    const bits : TLogBits = getLogBits('componentName');
    assertEquals(Object.prototype.toString.call(bits), '[object Object]');
  },
);

Deno.test(
  'getLogBits() returns an object with string properties: `ext` and `src` when "componentName" string is supplied',
  () => {
    const bits : TLogBits = getLogBits('componentName');
    assertEquals(typeof bits.ext, 'string');
    assertEquals(typeof bits.src, 'string');
  },
);

Deno.test(
  'getLogBits() returns an object with string properties: `ext` and `src` that are both empty when "componentName" string is supplied',
  () => {
    const bits : TLogBits = getLogBits('componentName');
    assertEquals(bits.ext, ' - componentName');
    assertEquals(bits.src, 'componentName');
  },
);

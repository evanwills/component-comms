import { assertEquals } from 'jsr:@std/assert';
import { normaliseID } from '../../src/utils.ts';

Deno.test(
  'normaliseID() returns unchanged string when no unwanted characters are present',
  () => {
    const tmp = 'event-name-2';
    assertEquals(normaliseID(tmp), tmp);
  },
);

Deno.test(
  'normaliseID() returns lowercase version of input string',
  () => {
    const tmp = 'another_Event';
    assertEquals(normaliseID(tmp), tmp);
  },
);

Deno.test(
  'normaliseID() returns lowercase version of input string with unwanted characters removed',
  () => {
    const tmp = '{new Event 5}';
    assertEquals(normaliseID(tmp), 'newEvent5');
  },
);

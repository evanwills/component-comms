import { assertEquals } from 'jsr:@std/assert';
import { normalise } from '../../src/utils.ts';

Deno.test(
  'normalise() returns unchanged string when no unwanted characters are present',
  () => {
    const tmp = 'eventname2';
    assertEquals(normalise(tmp), tmp);
  },
);

Deno.test(
  'normalise() returns lowercase version of input string',
  () => {
    const tmp = 'anotherEvent';
    assertEquals(normalise(tmp), 'anotherevent');
  },
);

Deno.test(
  'normalise() returns lowercase version of input string with unwanted characters removed',
  () => {
    const tmp = '{new Event 5}';
    assertEquals(normalise(tmp), 'eventname2');
  },
);

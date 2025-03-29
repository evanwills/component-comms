/** globals: Deno */
import { assertEquals } from 'jsr:@std/assert';
import { filterLogs } from '../../src/utils.ts';
import type { TLog } from '../../types/comms.js';

const getLogs = () : TLog[] => ([
  { time: 1, event: 'set', data: null, ids: [] },
  { time: 2, event: 'delete', data: null, ids: [] },
  { time: 3, event: 'set', data: null, ids: [] },
  { time: 4, event: 'set', data: null, ids: [] },
  { time: 5, event: 'read', data: null, ids: [] },
  { time: 6, event: 'update', data: null, ids: [] },
  { time: 7, event: 'read', data: null, ids: [] },
  { time: 8, event: 'update', data: null, ids: [] },
  { time: 9, event: 'delete', data: null, ids: [] },
  { time: 10, event: 'set', data: null, ids: [] },
  { time: 11, event: 'reset', data: null, ids: [] },
  { time: 11, event: 'set', data: null, ids: [] },
]);

Deno.test(
  'filterLogs() returns unchanged log list when event is empty',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), '');
    assertEquals(logs.length, 12);
  }
);

Deno.test(
  'filterLogs() returns log list with 5 items when event is "set"',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'set');
    assertEquals(logs.length, 5);
  }
);

Deno.test(
  'filterLogs() returns log list with 0 items when event is not present in list of logs',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'unknown');
    assertEquals(logs.length, 0);
  }
);

Deno.test(
  'filterLogs() returns log list with 1 items when event is "reset"',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'reset');
    assertEquals(logs.length, 1);
  }
);

Deno.test(
  'filterLogs() returns log list with 2 items when event is "read"',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'read');
    assertEquals(logs.length, 2);
  }
);

Deno.test(
  'filterLogs() returns log list with 1 items when event is "update"',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'update');
    assertEquals(logs.length, 2);
  }
);

Deno.test(
  'filterLogs() returns log list with 2 items when event is "delete"',
  () => {
    const logs : TLog[] = filterLogs(getLogs(), 'delete');
    assertEquals(logs.length, 2);
  }
);

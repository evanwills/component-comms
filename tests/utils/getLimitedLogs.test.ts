/** globals: Deno */
import { assertEquals } from 'jsr:@std/assert';
import { getLimitedLogs } from '../../src/utils.ts';
import type { TLog } from '../../src/comms.d.ts';

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
  { time: 12, event: 'set', data: null, ids: [] },
]);

Deno.test(
  'getLimitedLogs() returns last 10 log list when event is empty',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '');
    assertEquals(logs.length, 10);
  }
);

Deno.test(
  "getLimitedLogs() returns log list with the first item's `time` value is `12`",
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '');
    assertEquals(logs[0].time, 12);
  }
);

Deno.test(
  'getLimitedLogs() returns first 10 log list when event is empty and lastFirst is false',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '', 10, false);
    assertEquals(logs.length, 10);
  }
);

Deno.test(
  "getLimitedLogs() returns log list with the first item's `time` value is 1 when event is empty and lastFirst is false",
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '', 10, false);
    assertEquals(logs[0].time, 1);
  }
);

Deno.test(
  'getLimitedLogs() returns last 5 log list when event is empty and limit is set to 5',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '', 5);
    assertEquals(logs.length, 5);
  }
);

Deno.test(
  "getLimitedLogs() returns log list with the first item's `time` value is 12 when event is empty and limit is set to 5",
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), '', 5);
    assertEquals(logs[0].time, 12);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 5 items when event is "set"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'set');
    assertEquals(logs.length, 5);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with the first item\'s `time` value is 12 when event is "set"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'set');
    assertEquals(logs[0].time, 12);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 5 items when event is "set" and `lastFirst` is FALSE',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'set', 10, false);
    assertEquals(logs.length, 5);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with the first item\'s `time` value is 1 when event is "set" and `lastFirst` is FALSE',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'set', 10, false);
    assertEquals(logs[0].time, 1);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 0 items when event is not present in list of logs',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'unknown');
    assertEquals(logs.length, 0);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 1 item when event is "reset"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'reset');
    assertEquals(logs.length, 1);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with the first item\'s `time` value is 11 when event is "reset"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'reset');
    assertEquals(logs[0].time, 11);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 2 items when event is "read"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'read');
    assertEquals(logs.length, 2);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with the first item\'s `time` value is 7 when event is "read"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'read');
    assertEquals(logs[0].time, 7);
    assertEquals(logs[1].time, 5);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 2 items when event is "read"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'read', 1);
    assertEquals(logs.length, 1);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with only item\'s `time` value is 7 when event is "read"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'read', 1);
    assertEquals(logs[0].time, 7);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with the first item\'s `time` value is 5 when event is "read"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'read', 1, false);
    assertEquals(logs[0].time, 5);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 1 items when event is "update"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'update');
    assertEquals(logs.length, 2);
  }
);

Deno.test(
  'getLimitedLogs() returns log list with 2 items when event is "delete"',
  () => {
    const logs : TLog[] = getLimitedLogs(getLogs(), 'delete');
    assertEquals(logs.length, 2);
  }
);

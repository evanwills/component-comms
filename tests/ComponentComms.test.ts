import { assertEquals } from 'jsr:@std/assert';
import ComponentComms from '../src/ComponentComms.class.ts';

Deno.test(
  'ComponentComms dispatch() calls listener when listended for event is dispatched',
  async () => {
    let resolve : Function;
    let reject : Function;
    // const r = Promise.withResolvers();
    const r = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    const comms = new ComponentComms();
    const listener = (_data: any) => { resolve(_data); };

    const event = 'click'
    const id = 'test';

    comms.addListener(event, id, listener);
    comms.dispatch(event, 'test complete')

    await r;
  }
);

Deno.test(
  'ComponentComms (when in logging mode) dispatch() calls listener and logs event when listended for event is dispatched',
  async () => {
    let resolve : Function;
    let reject : Function;
    // const r = Promise.withResolvers();
    const r = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    const comms = new ComponentComms(true);
    const event = 'click'
    const id = 'test';
    const data = 'test complete';
    const listener = (_data: any) => { resolve(_data); };

    comms.addListener(event, id, listener);
    comms.dispatch(event, data);

    const log = comms.getLogs();
    assertEquals(log.length, 1);
    assertEquals(log[0].event, event);
    assertEquals(log[0].data, data);
    assertEquals(log[0].ids.length, 1);
    assertEquals(log[0].ids[0], id);

    await r;
  }
);

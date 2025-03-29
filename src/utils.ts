import type { TLog, TLogBits } from './comms.d.ts';

/**
 * Check whether the input is a plain JavaScript object.
 *
 * @param {unknown} input A value that may be an object
 *
 * @returns {boolean} TRUE if the input is an object (and not NULL
 *                    and not an array).
 *                    FALSE otherwise
 */
export const isObj = (input : any) : boolean => (
  Object.prototype.toString.call(input) === '[object Object]'
);

export const filterLogs = (logs: TLog[], event: string) : TLog[] => {
  if (event.trim() === '') {
      return [...logs];
  }

  return logs.filter((log: TLog) : boolean => (log.event === event));
}

export const getLimitedLogs = (
    logs: TLog[],
    event: string = '',
    limit : number = 10,
    lastFirst: boolean = true
) : TLog[] => {
    let output = filterLogs(logs, event);

    if (lastFirst === true) {
        output = output.reverse();
    }

    return (limit > 0)
        ? output.slice(0, limit)
        : output;
};

/**
 * Check whether object's string property is a non empty string
 *
 * @param {any} value value to be tested
 *
 * @returns {boolean} TRUE if property is string and non-empty.
 */
export const isNonEmptyStr = (value : any) : boolean => (
  typeof value === 'string' && value.trim() !== ''
);


export const propIsNonEmptyStr = (obj : any, prop: string) : boolean => (
  isObj(obj) && isNonEmptyStr(obj[prop])
);

/**
 *
 * @param {string} input
 * @returns {Object<{ext:string, src:string}>}
 */
export const getLogBits = (input: string) : TLogBits => {
  let src = '';
  let ext = '';

  if (typeof input === 'string') {
    src = input.trim();

    if (src !== '') {
      ext = ` - ${src}`;
    }
  }

  return { ext, src };
};

/**
 * normalise (and normalise) event name
 *
 * @param {string} input
 * @returns {string}
 */
export const normalise = (input : string) : string =>
  input.toLowerCase().replace(/[^a-z\d]+/ig, '');

/**
 * normalise (and normalise) event name
 *
 * @param {string} input
 * @returns {string}
 */
export const normaliseID = (input: string) : string =>
  input.replace(/[^a-z\d_-]+/ig, '');

const toSnake = (str: any) => str.replace(/[A-Z]/g, (letter: any) => `_${letter.toLowerCase()}`);

const isArray = function(a: any) {
  return Array.isArray(a);
};

const isObject = function(o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

export const keysToSnake = function(o: any) {
  if (isObject(o)) {
    const n: {[key: string]: any} = {};

    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToSnake(i);
    });
  }

  return o;
};

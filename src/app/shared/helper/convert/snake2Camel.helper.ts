const toCamel = (s: any) => {
    return s.replace(/([-_][a-z])/gi, ($1: any) => {
      return $1.toUpperCase().replace("-", "").replace("_", "");
    });
  };
  
  const isArray = function (a: any) {
    return Array.isArray(a);
  };
  
  const isObject = function (o: any) {
    return o === Object(o) && !isArray(o) && typeof o !== "function";
  };
  
  export const keysToCamelClient = function (o: any) {
    // if (!process.browser) {
    //   return o;
    // }
  
    if (isObject(o)) {
      const n: { [key: string]: any } = {};
  
      Object.keys(o).forEach((k) => {
        n[toCamel(k)] = keysToCamelClient(o[k]);
      });
  
      return n;
    } else if (isArray(o)) {
      return o.map((i: any) => {
        return keysToCamelClient(i);
      });
    }
  
    return o;
  };
  
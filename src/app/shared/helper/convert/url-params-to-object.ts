export function paramsString2Object(url: string) {
  const queryParam = JSON.parse(
    '{"' +
      decodeURIComponent(url.replace(/&/g, '","').replace(/=/g, '":"')) +
      '"}'
  );
  return queryParam;
}

export function currentUrlParams2Object() {
  const currentUrl = window.location.href.split("?")[1];
  if (!currentUrl) {
    return {};
  }
  const queryParamsObj = paramsString2Object(currentUrl);
  return queryParamsObj;
}

export function removeHeadingSpace(evt) {
  if (evt.which === 32 && evt.target.selectionStart === 0) {
    return false;
  }
}

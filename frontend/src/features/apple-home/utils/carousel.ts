export function wrapIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return (index + length) % length;
}

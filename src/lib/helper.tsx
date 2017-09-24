export function* range(a: number, b?: number): IterableIterator<number> {
  let n;
  let m;
  if (typeof b === 'undefined') {
    n = 0;
    m = a;
  } else {
    n = a;
    m = b;
  }
  for (let i = n; i < m; i += 1) {
    yield i;
  }
}

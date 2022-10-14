export const utf8_to_b64 = (str: string): string => {
  return decodeURIComponent(escape(Buffer.from(str).toString("base64")));
};

export const chunkArray = <T,>(arr: T[], size: number): T[][] =>
  arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    [] as T[][]
  );

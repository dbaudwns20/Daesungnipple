// @ts-ignore
BigInt.prototype.toJSON = function () {
  return Number(this);
};

export function bindFrom<T>(data: any): T {
  if (!data) return {} as T;
  if (Array.isArray(data)) {
    if (data.length === 0) return {} as T;
    data = data[0]
  }
  const transformedData = {};
  Object.keys(data).forEach(k => {
    const newK = k.replace(/(_\w)/g, (match) => match[1].toUpperCase());
    // @ts-ignore
    transformedData[newK] = data[k];
    // @ts-ignore
    if (typeof transformedData[newK] === 'bigint') {
      // @ts-ignore
      transformedData[newK] = Number(transformedData[newK]);
    }
  });
  return JSON.parse(JSON.stringify(transformedData)) as T;
}

export function bindFromArray<T>(data: any): T[] {
  if (!data) return [] as T[];
  if (!Array.isArray(data)) return [] as T[];
  if (data.length === 0) return [] as T[];
  return data.map((d: any) => bindFrom(d));
}
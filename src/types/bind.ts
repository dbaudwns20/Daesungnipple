// @ts-ignore
BigInt.prototype.toJSON = function() {
  return Number(this);
};

/**
 * DB 데이터를 제네릭 타입으로 변환
 * @param data
 * @returns T
 */
export function bindFrom<T>(data: any): T {
  if (!data) return {} as T;
  if (Array.isArray(data)) {
    if (data.length === 0) return {} as T;
    data = data[0];
  }
  const transformedData = {};
  Object.keys(data).forEach(k => {
    // prisma client 로 생성된 테이블 클라이언트를 사용하면 @map 선언해준대로 바꿔줘서 상관없는데
    // 혹시나 직접 raw query로 데이터를 읽을 때를 대비해서
    // 디비에서 raw query로 데이터 읽으면 snake_case로 읽히기 때문에 camelCase로 변환
    const newK = k.replace(/(_\w)/g, (match) => match[1].toUpperCase());
    // @ts-ignore
    transformedData[newK] = data[k];
    // @ts-ignore
    if (typeof transformedData[newK] === "bigint") {
      // bingint를 number로 변환
      // @ts-ignore
      transformedData[newK] = Number(transformedData[newK]);
    }
  });
  // 해당 타입으로 덮어씌움
  return JSON.parse(JSON.stringify(transformedData)) as T;
}

/**
 * DB 데이터 배열을 제네릭 타입 배열로 변환
 * @param data
 * @returns T[]
 */
export function bindFromArray<T>(data: any): T[] {
  if (!data) return [] as T[];
  if (!Array.isArray(data)) return [] as T[];
  if (data.length === 0) return [] as T[];
  return data.map((d: any) => bindFrom(d));
}
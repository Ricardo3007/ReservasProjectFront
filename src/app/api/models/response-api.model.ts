
export interface RequestApi<T> {
  [key: string]: unknown;
  message: string;
  data: T;
  success?: boolean;
  statusCode: number;
  isOk: boolean,
  result: any,
}

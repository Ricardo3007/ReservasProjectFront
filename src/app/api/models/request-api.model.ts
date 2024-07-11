export enum TypeRequest {
  POST,
  GET,
  DELETE,
  PUT
}
export interface PostRequest {
  type: TypeRequest.POST;
  body: object;
}
export interface DeleteRequest {
  type: TypeRequest.DELETE;
}
export interface GetRequest {
  type: TypeRequest.GET;
}
export interface PutRequest {
  type: TypeRequest.PUT;
  body?: object;
}
export enum TypeResponse {
  ARRAY_BUFFER,
  BLOB,
  JSON,
  TEXT
}
export interface RequestStructure {
  request: PostRequest | DeleteRequest | GetRequest | PutRequest;
  responseType?: TypeResponse;
  endpoint: string;
  externalApi?: boolean;
  params?: { [key: string]: string | number | boolean  | undefined | null };
  headers?: { [key: string]: string };
  skipInterceptor?: boolean;
  statusMessages?: StatusMessagesRequest;
}
export interface StatusMessagesRequest {
  loading?: string;
  success?: string;
  error?: string | null;
  showDefaultErrorMessage?: boolean;
}

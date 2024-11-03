/**
 * API Request Types
 */
export enum PostRequestType {
  POST_REQUEST_NONE = "REQUEST_NONE",
  POST_REQUEST_CREATE = "REQUEST_CREATE",
  POST_REQUEST_UPDATE = "REQUEST_UPDATE",
  POST_REQUEST_DELETE = "REQUEST_DELETE"
}

export type PostRequest = {
  requestType: PostRequestType;
  data: any;
  returnData: boolean; // 생성, 수정 이후 데이터 반환 여부
}
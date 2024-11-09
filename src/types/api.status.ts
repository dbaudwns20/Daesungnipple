/**
 * 상태 코드 OK 만들기
 * 조회의 경우 발생할 수 있음
 */
export function statusCodeOK(): any {
  return { status: 200 };
}

/**
 * 상태 코드 OK Created 만들기
 * @param uri
 * 생성의 경우 발생할 수 있음
 * 리소스 uri 반환 => if headers.location && headers.location !== '' ?
 *
 * 예를 들어 POST 요청을 통해 새로운 리소스를 생성하고자 할 때, returnData = true 로 지정해서 보내면
 * 서버에서는 요청을 처리하고 응답에 새로운 리소스 객체를 넣어서 리턴하기 떄문에 클라이언트에서는 새로운 리소스 객체를 바로 받을 수 있음
 * 하지만 새롭게 생성된 데이터 객체를 반환받지 않을거라면 그냥 uri 를 반환해서 처리된 리소스 위치를 알려줌
 */
export function statusCodeOKCreated(uri: string = ""): any {
  return { status: 201, headers: { location: uri } };
}

/**
 * 상태 코드 OK Reset Content 만들기
 * @param uri
 * 수정의 경우 발생할 수 있음
 * 리소스 uri 반환 => if headers.location && headers.location !== '' ?
 *
 * 예를 들어 POST 요청을 통해 리소스를 수정하고자 할 때, returnData = true 로 지정해서 보내면
 * 서버에서는 요청을 처리하고 응답에 수정된 리소스 객체를 넣어서 리턴하기 떄문에 클라이언트에서는 수정된 리소스 객체를 바로 받을 수 있음
 * 하지만 수정된 데이터 객체를 반환받지 않을거라면 그냥 uri 를 반환해서 변경된 리소스 위치를 알려줌
 */
export function statusCodeOKResetContent(uri: string = ""): any {
  return { status: 205, headers: { location: uri } };
}

/**
 * 상태 코드 OK No Content 만들기
 * 삭제의 경우 발생할 수 있음
 * 처리는 되었지만 응답값이 없을 경우
 */
export function statusCodeOKNoContent(): any {
  return { status: 204 };
}

/**
 * 상태 코드 Bad Request 만들기
 * 요청 파라미터가 잘못된 경우 발생할 수 있음
 */
export function statusCodeBadRequest(): any {
  return { status: 400 };
}

/**
 * 상태 코드 Not Found 만들기
 * 조회 결과가 없는 경우 발생할 수 있음
 */
export function statusCodeNotFound(): any {
  return { status: 404 };
}

/**
 * 상태 코드 Internal Server Error 만들기
 */
export function statusCodeInternalServerError(): any {
  return { status: 500 };
}
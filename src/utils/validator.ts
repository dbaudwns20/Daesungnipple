/**
 * form 데이터 validate 체크
 * @param form
 * @returns
 */
export function validateForm(form: HTMLFormElement): boolean {
  let invalidField: HTMLElement | null = null;
  for (const element of Object.assign(form)) {
    if (!element.checkValidity() && !invalidField)
      invalidField = element as HTMLElement;
    // break 를 하면 모든 필드를 체크할 수 없다.
  }
  // 맨 첫번째 invalid field 가 있으면 focus, 에러발생
  if (invalidField) {
    invalidField.scrollIntoView();
    invalidField.focus();
    return false;
  }
  return true;
}

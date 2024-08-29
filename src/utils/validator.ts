export const PASSWORD_RULE: RegExp = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[!"#$%&'()*+,\-.\/:;`₩\\<=>?@\[\]^_{|}~])(?=.*[0-9]).{8,20}$/,
);
export const EMAIL_RULE: RegExp = new RegExp(
  /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
);
export const PHONE_RULE: RegExp = new RegExp(/^\d{2,3}\d{3,4}\d{4}$/);

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

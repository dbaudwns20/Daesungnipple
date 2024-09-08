import bcrypt from "bcryptjs";

export function encryptPassword(password: string) {
  if (!password) return "";
  const salt: string = bcrypt.genSaltSync(10);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

export function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compareSync(password, hashedPassword);
}

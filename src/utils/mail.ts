import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  from: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // 아래 secure 옵션을 사용하려면 465 포트를 사용해야함
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    // 초기에 설정해둔 env 데이터
    user: process.env.AUTH_EMAIL_USER,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

function getFrom(): string {
  return process.env.AUTH_EMAIL_USER!;
}

async function sendEmail(mailOptions: MailOptions) {
  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetMail(to: string, value: string) {
  const mailData = {
    to: to,
    subject: `[대성닛블] 비밀번호 초기화`,
    from: getFrom(),
    html: `
    <h1>비밀번호 초기화</h1>
    <a href="http://localhost:3000/reset-password?value=${value}">
      비밀번호 초기화 링크
    </a>
    `, // TODO html 템플릿 관리 필요
  };

  return await sendEmail(mailData);
}

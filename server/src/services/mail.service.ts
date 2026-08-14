import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
try {
  await transporter.verify();
  console.log('Zoho SMTP is ready');
} catch (error) {
  console.error('Zoho SMTP authentication failed:', error);
}
export async function sendWelcomeEmail(email: string, username: string, tempPassword: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Account Details',
    text: `
Hello ${username},

Your account has been created.

Username: ${username}
Email: ${email}
Temporary Password: ${tempPassword}

Please change your password after logging in.

Thanks,
Admin
    `,
  });
}

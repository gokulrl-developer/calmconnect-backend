import { transporter } from "../infrastructure/config/nodeMailerConfig.js";


transporter.verify((error) => {
  if (error) {
    console.error('Error verifying mailer:', error);
  } else {
    console.log('Mailer is ready to send messages');
  }
});

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: `"CalmConnect" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  };
try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
   return result;
  } catch (err) {
    console.error('Failed to send email:', err);
    return err;
  }
};
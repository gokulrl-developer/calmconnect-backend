export const EMAIL_MESSAGES = {
  OTP_SUBJECT: "CalmConnect Otp Verification",
OTP_BODY: (otp: string) => `Your OTP code is: ${otp}`,
REJECTON_MAIL_SUBJECT: "CalmConnect Application Status",
REJECTION_MAIL_BODY: (name: string, reason: string) => `
    <p>Dear ${name},</p>

    <p>We appreciate the time and effort you took to apply to join <strong>CalmConnect</strong> as a psychologist. 
    After a thorough review of your application, we regret to inform you that it has not been approved at this time.</p>

    <p><strong>Reason for rejection:</strong> ${reason}</p>

    <p>Please note that you can use the same account up to apply for <strong>three times</strong>. 
    We encourage you to consider reapplying in the future, as circumstances and requirements may change, 
    and new opportunities may become available.</p>

    <p>Thank you once again for your interest in CalmConnect. 
    We value your dedication to providing mental health care and wish you success in your future endeavors.</p>

    <p>Sincerely,<br/>
    The CalmConnect Team</p>
  `,
}
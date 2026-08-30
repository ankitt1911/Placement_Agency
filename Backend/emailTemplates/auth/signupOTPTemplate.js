const signupOTPTemplate = ({ name, otp, validMinutes = 5, heading = "Verify your email address", intro = "use the OTP below to complete your student account registration" }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:28px 32px; text-align:center; background:#0a0a0a;">
                <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:32px;">Magnus Copo</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 12px;">
                <h2 style="margin:0 0 14px; color:#111827; font-size:22px; line-height:30px;">${heading}</h2>
                <p style="margin:0; color:#4b5563; font-size:15px; line-height:24px;">
                  Hi ${name || "there"}, ${intro}.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 32px;">
                <div style="display:inline-block; letter-spacing:10px; padding:18px 24px; background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; color:#be123c; font-size:32px; line-height:38px; font-weight:700;">
                  ${otp}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 34px;">
                <p style="margin:0 0 10px; color:#4b5563; font-size:14px; line-height:22px;">
                  This OTP is valid for ${validMinutes} minutes. If you request a new OTP, this code will stop working immediately.
                </p>
                <p style="margin:0; color:#6b7280; font-size:13px; line-height:20px;">
                  If you did not start this registration, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

module.exports = signupOTPTemplate;

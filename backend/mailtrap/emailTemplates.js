export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f5f5f5;">
  <div style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(to right,#1e3c72,#2a5298,#6a11cb); padding:25px; text-align:center;">
      <h1 style="color:white; margin:0; font-size:28px; letter-spacing:1px;">CarLink Verification</h1>
      <p style="color:#e0e0e0; margin-top:8px; font-size:14px;">Secure your account to explore premium car listings</p>
    </div>

    <!-- Content Box -->
    <div style="padding:25px;">
      <p>Hello,</p>

      <p>Thanks for signing up at <b>CarLink</b> — Pakistan’s premium online car marketplace.</p>

      <p>Your verification code is:</p>

      <!-- Code Box -->
      <div style="text-align:center; margin:35px 0;">
        <div style="font-size:36px; font-weight:bold; color:#1e3c72; letter-spacing:12px; padding:15px 0;">
          {verificationCode}
        </div>
      </div>

      <p>Enter this code in the app to continue. For security, the code expires in <b>15 minutes</b>.</p>

      <p>If you didn’t request this, simply ignore this message.</p>

      <p style="margin-top:35px;">Best regards,<br><b>CarLink Team</b></p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:15px; color:#888; font-size:11px;">
      This is an automated email — please do not reply.
    </div>

  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
</head>

<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f4f4f4;">
  <div style="max-width:600px; margin:25px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(to right,#6a11cb,#2575fc); padding:25px; text-align:center;">
      <h1 style="color:white; margin:0; font-size:26px;">Password Updated</h1>
      <p style="color:#e0e0e0; margin-top:5px; font-size:14px;">Your CarLink account is secure</p>
    </div>

    <!-- Content -->
    <div style="padding:25px;">
      <p>Hello,</p>

      <p>Your password has been successfully reset. You can now log in securely using your new password.</p>

      <!-- Checkmark -->
      <div style="text-align:center; margin:30px 0;">
        <div style="width:60px; height:60px; background:#28a745; color:white; border-radius:50%; line-height:60px; display:inline-block; font-size:34px;">
          ✓
        </div>
      </div>

      <p>If you did not perform this action, please contact our support immediately.</p>

      <p>Stay safe — always use strong passwords and avoid sharing them.</p>

      <p style="margin-top:35px;">Best regards,<br><b>CarLink Security Team</b></p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:15px; color:#888; font-size:11px;">
      This is an automated email — please do not reply.
    </div>

  </div>
</body>
</html>
`;


export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>

<body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#efefef;">
  <div style="max-width:600px; margin:25px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(to right,#1e3c72,#6a11cb,#2575fc); padding:25px; text-align:center;">
      <h1 style="color:white; margin:0; font-size:26px;">Password Reset</h1>
      <p style="color:#e0e0e0; margin-top:6px; font-size:14px;">Secure your CarLink account</p>
    </div>

    <!-- Content -->
    <div style="padding:25px;">
      <p>Hello,</p>

      <p>We received a request to reset your CarLink password.</p>
      <p>If this wasn’t you, please ignore this email.</p>

      <p>Click the button below to reset your password:</p>

      <!-- Reset Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="{resetURL}"
           style="background:#1e3c72; background:linear-gradient(to right,#1e3c72,#2575fc); color:white; padding:14px 22px; border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">
          Reset Password
        </a>
      </div>

      <p>The link expires in <b>1 hour</b>.</p>

      <p style="margin-top:35px;">Best regards,<br><b>CarLink Support</b></p>
    </div>

    <!-- Footer -->
    <div style="text-align:center; padding:15px; color:#777; font-size:11px;">
      This is an automated email — please do not reply.
    </div>

  </div>
</body>
</html>
`;

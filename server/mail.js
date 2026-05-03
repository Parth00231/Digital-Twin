const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(to, name, token) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyLink = `${frontendUrl}/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Digital Twin" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your Digital Twin Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; color: #0f172a;">
          <h2 style="color: #0f766e;">Welcome to Digital Twin, ${name} 🚀</h2>
          <p>Thanks for signing up. Please verify your email to activate your account.</p>

          <a 
            href="${verifyLink}" 
            style="
              display: inline-block;
              margin-top: 12px;
              padding: 12px 18px;
              background: #0f766e;
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
            "
          >
            Verify Email
          </a>

          <p style="margin-top: 20px; font-size: 14px; color: #475569;">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p style="font-size: 13px; word-break: break-all; color: #2563eb;">
            ${verifyLink}
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />

          <p style="font-size: 13px; color: #64748b;">
            If you did not create this account, you can safely ignore this email.
          </p>

          <p><strong>– Team Digital Twin</strong></p>
        </div>
      `,
    });

    console.log(`✅ Verification email sent to ${to}`);
  } catch (error) {
    console.error("❌ Verification email error:", error.message);
    throw error;
  }
}

async function sendLoginAlertEmail(to, name) {
  try {
    const loginTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Digital Twin" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Login Alert - Digital Twin",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; color: #0f172a;">
          <h2 style="color: #2563eb;">Hello ${name},</h2>

          <p>Your Digital Twin account was logged in successfully.</p>

          <div style="
            margin: 16px 0;
            padding: 14px;
            background: #f1f5f9;
            border-left: 4px solid #2563eb;
            border-radius: 8px;
          ">
            <p style="margin: 0;"><strong>Login Time:</strong> ${loginTime}</p>
          </div>

          <p>
            If this login was you, you can ignore this email.
            If not, please change your password immediately.
          </p>

          <p><strong>– Team Digital Twin</strong></p>
        </div>
      `,
    });

    console.log(`✅ Login alert email sent to ${to}`);
  } catch (error) {
    console.error("❌ Login alert email error:", error.message);
    throw error;
  }
}

module.exports = {
  sendVerificationEmail,
  sendLoginAlertEmail,
};
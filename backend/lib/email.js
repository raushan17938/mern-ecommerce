import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const createEmailTemplate = (title, content, footerText) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #10B981; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .content { padding: 30px 20px; }
        .otp-box { background-color: #f0fdf4; border: 1px solid #10B981; border-radius: 4px; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10B981; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background-color: #10B981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .button:hover { background-color: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SecureShop</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>${footerText}</p>
            <p>&copy; ${new Date().getFullYear()} SecureShop. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const content = `
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up for SecureShop! To complete your registration and access all features, please verify your email address by entering the code below:</p>
            <div class="otp-box">${verificationToken}</div>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        `;

        if (!resend) {
            console.log("Resend API Key not found. Skipping verification email to:", email);
            return;
        }

        await resend.emails.send({
            from: "SecureShop <onboarding@resend.dev>",
            to: [email],
            subject: "Verify your email - SecureShop",
            html: createEmailTemplate("Verify Email", content, "This is an automated message, please do not reply."),
        });
        console.log("Verification email sent to", email);
    } catch (error) {
        console.log("Error sending verification email", error);
        throw new Error("Error sending verification email");
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const content = `
            <h2>Welcome to SecureShop, ${name}!</h2>
            <p>We're thrilled to have you on board. Your account has been successfully verified.</p>
            <p>Start exploring our vast collection of products and enjoy a seamless shopping experience.</p>
            <a href="${process.env.CLIENT_URL}" class="button">Start Shopping</a>
        `;

        if (!resend) {
            console.log("Resend API Key not found. Skipping welcome email to:", email);
            return;
        }

        await resend.emails.send({
            from: "SecureShop <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to SecureShop!",
            html: createEmailTemplate("Welcome", content, "Happy Shopping!"),
        });
        console.log("Welcome email sent to", email);
    } catch (error) {
        console.log("Error sending welcome email", error);
        throw new Error("Error sending welcome email");
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const content = `
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your SecureShop account.</p>
            <p>Use the OTP below to reset your password:</p>
            <div class="otp-box">${resetURL}</div>
            <p>If you didn't request a password reset, please ignore this email.</p>
        `;

        if (!resend) {
            console.log("Resend API Key not found. Skipping password reset email to:", email);
            return;
        }

        await resend.emails.send({
            from: "SecureShop <onboarding@resend.dev>",
            to: [email],
            subject: "Reset your password - SecureShop",
            html: createEmailTemplate("Reset Password", content, "Security Alert"),
        });
        console.log("Password reset email sent to", email);
    } catch (error) {
        console.log("Error sending password reset email", error);
        throw new Error("Error sending password reset email");
    }
};

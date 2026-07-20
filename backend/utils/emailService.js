import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let transporter;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

/**
 * Generic send email function
 */
export async function sendEmail({ to, subject, html, text }) {
    const transporter = getTransporter();
    try {
        const info = await transporter.sendMail({
            from: `"EasyRentals" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (err) {
        console.error(`Failed to send email to ${to}:`, err);
        throw err;
    }
}

/**
 * Send OTP for Password Reset
 */
export async function sendOtpEmail(toEmail, otp) {
    const subject = "EasyRentals: Your OTP for password reset";
    const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
            <h2 style="color: #4F46E5; text-align: center;">EasyRentals Reset</h2>
            <p>Your OTP for password reset is:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px;">
                <strong style="font-size: 32px; color: #4F46E5; letter-spacing: 5px;">${otp}</strong>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
    `;
    return sendEmail({ to: toEmail, subject, html, text });
}

/**
 * Send New Listing Notification
 */
export async function sendListingNotification(toEmail, house) {
    const subject = `New Property Alert in ${house.location}!`;
    const text = `A new house matching your location preference has been added: ${house.title} at ₹${house.price}.`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden;">
            <div style="background: #4F46E5; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">New Property Alert! 🏠</h1>
            </div>
            <div style="padding: 30px; background: white;">
                <p style="font-size: 16px; color: #374151;">Hello,</p>
                <p style="font-size: 16px; color: #374151;">A new property has just been listed in <strong>${house.location}</strong> that matches your subscription!</p>
                
                <div style="margin: 30px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
                    <h2 style="margin-top: 0; color: #111827; font-size: 18px;">${house.title}</h2>
                    <p style="color: #4F46E5; font-weight: bold; font-size: 20px; margin: 10px 0;">₹${house.price.toLocaleString()}</p>
                    <p style="font-size: 14px; color: #6b7280;">${house.houseType} • ${house.bedrooms} BHK • ${house.area} sqft</p>
                </div>

                <a href="http://localhost:5173/house/${house._id}" style="display: block; text-align: center; background: #4F46E5; color: white; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">View Details</a>
                
                <div style="margin-top: 40px; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">You are receiving this because you subscribed to listing alerts for ${house.location}.</p>
                </div>
            </div>
        </div>
    `;
    return sendEmail({ to: toEmail, subject, html, text });
}

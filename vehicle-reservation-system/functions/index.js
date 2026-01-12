const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

// Helper to check if email vars are set (supports both env vars and functions:config)
const getEmailConfig = () => {
    const cfg = functions.config?.() || {};
    const apiKey = process.env.SENDGRID_API_KEY || cfg.sendgrid?.key;
    const fromEmail = process.env.FROM_EMAIL || cfg.sendgrid?.from;

    if (!apiKey || !fromEmail) {
        console.error("Missing SendGrid config. Set SENDGRID_API_KEY + FROM_EMAIL env vars or functions config sendgrid.key/sendgrid.from.");
        return null;
    }

    sgMail.setApiKey(apiKey);
    return { fromEmail };
};

const getRecipientEmail = (booking) => booking.customerEmail || booking.email;

const renderBookingDetailsHtml = (booking) => {
    const pickup = booking.pickupLocation || "N/A";
    const dropoff = booking.dropoffLocation || "N/A";
    const vehicle = booking.vehicleName || booking.vehicleType || "N/A";

    return `
        <ul>
            <li><strong>Vehicle:</strong> ${vehicle}</li>
            <li><strong>Dates:</strong> ${booking.startDate} to ${booking.endDate}</li>
            <li><strong>Pick-up:</strong> ${pickup}</li>
            <li><strong>Drop-off:</strong> ${dropoff}</li>
        </ul>
    `;
};

exports.onBookingCreated = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snap, context) => {
        const booking = snap.data();
        const config = getEmailConfig();
        if (!config) return null;

        const to = getRecipientEmail(booking);
        if (!to) {
            console.error("Booking created without customerEmail/email.");
            return null;
        }

        const bookingId = context.params.bookingId;
        const subject = `Booking Request Received - ${bookingId}`;

        const customerName = booking.customerName || booking.name || "Customer";
        const html = `
            <h2>Hi ${customerName},</h2>
            <p>We have received your booking request. Our team will review and confirm it shortly.</p>
            <p><strong>Status:</strong> PENDING</p>
            <hr/>
            <h3>Booking Details</h3>
            ${renderBookingDetailsHtml(booking)}
            <p>If you need to make changes, reply to this email with your booking ID: <strong>${bookingId}</strong>.</p>
        `;

        const msg = { to, from: config.fromEmail, subject, html };
        try {
            await sgMail.send(msg);
            console.log(`Pending email sent for booking ${bookingId} to ${to}`);
        } catch (error) {
            console.error("Error sending pending email:", error);
            if (error.response) console.error(error.response.body);
        }
        return null;
    });

exports.onBookingStatusChange = functions.firestore
    .document("bookings/{bookingId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        // Only trigger on status change to approved or rejected
        if (newData.status === oldData.status) return null;
        if (!["APPROVED", "REJECTED"].includes(newData.status)) return null;

        const config = getEmailConfig();
        if (!config) return null;

                const { bookingId } = context.params;
                const subject = `Booking Update: ${String(newData.status || '').toUpperCase()} - ${bookingId}`;

                const to = getRecipientEmail(newData);
                if (!to) {
                    console.error(`Booking ${bookingId} status changed but no customerEmail/email found.`);
                    return null;
                }
        
        const customerName = newData.customerName || newData.name || "Customer";
        const html = `
            <h2>Hi ${customerName},</h2>
            <p>Your booking status has been updated to: <strong>${newData.status}</strong></p>
            <p><strong>Admin Note:</strong> ${newData.adminNote || "No notes provided."}</p>
            <hr/>
            <h3>Booking Details</h3>
            ${renderBookingDetailsHtml(newData)}
        `;

        const msg = {
            to,
            from: config.fromEmail,
            subject: subject,
            html: html,
        };

        try {
            await sgMail.send(msg);
            console.log(`Status email sent for booking ${bookingId} to ${to}`);
        } catch (error) {
            console.error("Error sending email:", error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    });

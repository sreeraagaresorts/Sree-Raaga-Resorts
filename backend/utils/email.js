const nodemailer = require("nodemailer");

/**
 * Formats dates to a readable locale string
 */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Base email sending function.
 * Attempts real delivery via SMTP if configured. Otherwise, logs simulated emails.
 * Always catches errors gracefully to prevent crashing main HTTP workflows.
 */
async function sendMail({ to, subject, html, text }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  const isConfigured = smtpHost && smtpUser && smtpPass;

  if (!isConfigured) {
    console.log(`[Email Mock] SMTP config missing. Simulating email:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text Preview: ${text || "HTML only"}`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false // Helps avoid certification handshake issues
      }
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html
    });

    console.log(`[Email] Mail sent successfully to: ${to}`);
    return true;
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
    // Return true/false but do not bubble up to crash the main request
    return false;
  }
}

/**
 * HTML Shell template for uniform branding
 */
function getEmailShell(title, contentHtml) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #030a16;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #081a2f;
          border: 1px solid rgba(200, 166, 77, 0.2);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }
        .header {
          background-color: #071524;
          padding: 25px 30px;
          text-align: center;
          border-bottom: 2px solid #c8a64d;
        }
        .header h1 {
          color: #c8a64d;
          margin: 0;
          font-size: 24px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 30px;
          font-size: 14px;
          line-height: 1.6;
          color: #ffffff;
        }
        .greeting {
          font-size: 18px;
          color: #c8a64d;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .box {
          background-color: #04101e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .footer {
          background-color: #071524;
          padding: 20px;
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer p { margin: 5px 0; }
        .footer a { color: #c8a64d; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sree Raaga Resort</h1>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          <p><strong>Sree Raaga Resort</strong></p>
          <p>Bypass Road, Main Highway | Phone: +91 98765 43210</p>
          <p>&copy; ${new Date().getFullYear()} Sree Raaga Resort. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/*
|--------------------------------------------------------------------------
| Email Triggers
|--------------------------------------------------------------------------
*/

// 1. Welcome / Registration Email
exports.sendWelcomeEmail = async (user) => {
  const content = `
    <div class="greeting">Welcome to Sree Raaga Resort!</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>Thank you for registering an account at Sree Raaga Resort. We are delighted to have you as part of our guest member club.</p>
    <div class="box">
      <strong>Your Account Credentials:</strong><br>
      • Registered Email: ${user.email}<br>
      • Profile Type: Guest Member
    </div>
    <p>You can now sign in to our booking website to view room inventories, book reservations, and manage your stays online.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Welcome to Sree Raaga Resort - Registration Successful",
    html: getEmailShell("Welcome to Sree Raaga Resort", content),
    text: `Welcome to Sree Raaga Resort, ${user.full_name}! Registration successful.`
  });
};

// 2. Login Alert Notification
exports.sendLoginAlert = async (user) => {
  const dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const content = `
    <div class="greeting">Account Login</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>A new login was successfully processed for your Sree Raaga Resort account.</p>
    <div class="box">
      <strong>Login Audit Details:</strong><br>
      • User Email: ${user.email}<br>
      • Timestamp: ${dateStr}<br>
      • Status: Success
    </div>
    <p>If this was you, no action is required. If you do not recognize this activity, please contact support immediately to lock your account.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Security Alert: Login Detected - Sree Raaga Resort",
    html: getEmailShell("Account Login Alert", content),
    text: `Security Alert: New login detected for ${user.email} on ${dateStr}.`
  });
};

// 3. User Role Update Alert
exports.sendRoleUpdatedEmail = async (user) => {
  const content = `
    <div class="greeting">Profile Update Alert</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>This is to inform you that your account profile privileges have been updated by the system administrator.</p>
    <div class="box">
      <strong>Updated Profile Details:</strong><br>
      • Account Email: ${user.email}<br>
      • Assigned Role: <strong>${user.role}</strong>
    </div>
    <p>Please log in again to see your updated features.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Profile Update Alert - Sree Raaga Resort",
    html: getEmailShell("Profile Update Alert", content),
    text: `Profile Alert: Your user role has been updated to: ${user.role}.`
  });
};

// 4. User Account Deletion Alert
exports.sendAccountDeletedEmail = async (user) => {
  const content = `
    <div class="greeting">Account Closed</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>We are writing to confirm that your guest profile account at Sree Raaga Resort has been closed and successfully deleted from our records.</p>
    <div class="box">
      • Profile Name: ${user.full_name}<br>
      • Account Email: ${user.email}<br>
      • Status: Terminated
    </div>
    <p>If this account deletion was performed in error, please contact our guest support desk immediately.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Account Closure Confirmation - Sree Raaga Resort",
    html: getEmailShell("Account Closed", content),
    text: `Account Closed: Your profile account for ${user.email} has been deleted.`
  });
};

// 5. Booking Creation Alert (Normal or Online)
exports.sendBookingCreatedEmail = async (booking) => {
  const checkIn = formatDate(booking.check_in);
  const checkOut = formatDate(booking.check_out);
  const price = parseFloat(booking.total_price) || 0;
  
  const content = `
    <div class="greeting">Booking Request Received</div>
    <p>Dear <strong>${booking.guest_name || "Guest"}</strong>,</p>
    <p>Thank you for submitting a room booking request. We have received your reservation request and it is currently being processed.</p>
    <div class="box">
      <strong>Reservation Details:</strong><br>
      • Booking ID: #${booking.id || "N/A"}<br>
      • Selected Room: ${booking.room_name || "Premium Room"}<br>
      • Dates: ${checkIn} to ${checkOut}<br>
      • Total Guests: ${booking.adults || 1} Adults, ${booking.children || 0} Children<br>
      • Total Price: ₹${price.toLocaleString("en-IN")}<br>
      • Payment Type: ${booking.payment_method || "cash"}<br>
      • Status: <strong>${booking.status || "pending"}</strong>
    </div>
    <p>We will notify you immediately once your booking is confirmed by the resort management team.</p>
  `;
  return sendMail({
    to: booking.guest_email,
    subject: `Booking Request Received - #${booking.id} - Sree Raaga Resort`,
    html: getEmailShell("Booking Request Submitted", content),
    text: `Booking Request Received: Booking #${booking.id} for ${booking.room_name} is currently ${booking.status}.`
  });
};

// 6. Booking Status / Details Update Alert
exports.sendBookingUpdatedEmail = async (booking) => {
  const checkIn = formatDate(booking.check_in);
  const checkOut = formatDate(booking.check_out);
  const price = parseFloat(booking.total_price) || 0;

  const content = `
    <div class="greeting">Booking Status Update</div>
    <p>Dear <strong>${booking.guest_name || "Guest"}</strong>,</p>
    <p>We are writing to inform you that your booking status has been updated in our reservation system.</p>
    <div class="box">
      <strong>Updated Reservation Details:</strong><br>
      • Booking ID: #${booking.id}<br>
      • Selected Room: ${booking.room_name}<br>
      • Stay Dates: ${checkIn} to ${checkOut}<br>
      • Total Price: ₹${price.toLocaleString("en-IN")}<br>
      • Payment Type: ${booking.payment_method || "cash"}<br>
      • Updated Status: <strong style="text-transform: uppercase; color: #c8a64d;">${booking.status}</strong>
    </div>
    <p>We look forward to providing you with an exceptional stay experience. Safe travels!</p>
  `;
  return sendMail({
    to: booking.guest_email,
    subject: `Booking Updated - #${booking.id} - Sree Raaga Resort`,
    html: getEmailShell("Booking Updated", content),
    text: `Booking Updated: Booking #${booking.id} status is now: ${booking.status}.`
  });
};

// 7. Booking Deletion / Cancel alert
exports.sendBookingDeletedEmail = async (booking) => {
  const checkIn = formatDate(booking.check_in);
  const checkOut = formatDate(booking.check_out);
  
  const content = `
    <div class="greeting">Booking Cancellation Alert</div>
    <p>Dear <strong>${booking.guest_name || "Guest"}</strong>,</p>
    <p>This email confirms that reservation <strong>#${booking.id}</strong> has been cancelled and removed from Sree Raaga Resort active logs.</p>
    <div class="box">
      • Room Type: ${booking.room_name}<br>
      • Stay Schedule: ${checkIn} to ${checkOut}<br>
      • Cancellation Status: Completed
    </div>
    <p>If you did not initiate this request or have questions regarding refunds, please contact our support office.</p>
  `;
  return sendMail({
    to: booking.guest_email,
    subject: `Booking Cancelled - #${booking.id} - Sree Raaga Resort`,
    html: getEmailShell("Booking Cancelled", content),
    text: `Booking Cancellation: Booking #${booking.id} has been cancelled and deleted.`
  });
};

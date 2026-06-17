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
    <p>Thank you for signing up at Sree Raaga Resort. We are very happy to have you with us.</p>
    <div class="box">
      <strong>Your Account Details:</strong><br>
      • Email: ${user.email}<br>
      • Account Type: Guest Member
    </div>
    <p>You can now log in to our website to see available rooms, make bookings, and check your reservations online.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Welcome to Sree Raaga Resort",
    html: getEmailShell("Welcome to Sree Raaga Resort", content),
    text: `Welcome to Sree Raaga Resort, ${user.full_name}! Your account is ready.`
  });
};

// 2. Login Alert Notification
exports.sendLoginAlert = async (user) => {
  const dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const content = `
    <div class="greeting">New Account Login</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>A new login was made to your Sree Raaga Resort account.</p>
    <div class="box">
      <strong>Login Details:</strong><br>
      • Email: ${user.email}<br>
      • Date and Time: ${dateStr}<br>
      • Status: Success
    </div>
    <p>If you did this, you can ignore this email. If not, please contact us immediately to protect your account.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "New Login to Your Account - Sree Raaga Resort",
    html: getEmailShell("New Login Detected", content),
    text: `New login detected for ${user.email} on ${dateStr}.`
  });
};

// 3. User Role Update Alert
exports.sendRoleUpdatedEmail = async (user) => {
  const content = `
    <div class="greeting">Account Role Updated</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>We are writing to let you know that your account role has been updated by the admin.</p>
    <div class="box">
      <strong>New Details:</strong><br>
      • Email: ${user.email}<br>
      • New Role: <strong>${user.role}</strong>
    </div>
    <p>Please log in again to see your new features.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Account Role Updated - Sree Raaga Resort",
    html: getEmailShell("Account Updated", content),
    text: `Your account role has been updated to: ${user.role}.`
  });
};

// 4. User Account Deletion Alert
exports.sendAccountDeletedEmail = async (user) => {
  const content = `
    <div class="greeting">Account Deleted</div>
    <p>Dear <strong>${user.full_name}</strong>,</p>
    <p>We are writing to confirm that your account at Sree Raaga Resort has been deleted from our records.</p>
    <div class="box">
      • Name: ${user.full_name}<br>
      • Email: ${user.email}<br>
      • Status: Closed
    </div>
    <p>If you did not want to delete your account, please contact our support team immediately.</p>
  `;
  return sendMail({
    to: user.email,
    subject: "Account Deleted - Sree Raaga Resort",
    html: getEmailShell("Account Deleted", content),
    text: `Your account for ${user.email} has been deleted.`
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
    <p>Thank you for booking with us. We have received your booking and are checking it now.</p>
    <div class="box">
      <strong>Booking Details:</strong><br>
      • Booking ID: #${booking.id || "N/A"}<br>
      • Room: ${booking.room_name || "Premium Room"}<br>
      ${booking.room_number ? `• Room Number: <strong>${booking.room_number}</strong><br>` : ""}
      • Dates: ${checkIn} to ${checkOut}<br>
      • Guests: ${booking.adults || 1} Adults, ${booking.children || 0} Children<br>
      • Price: ₹${price.toLocaleString("en-IN")}<br>
      • Payment Method: ${booking.payment_method || "cash"}<br>
      • Status: <strong>${booking.status || "pending"}</strong>
    </div>
    <p>We will email you as soon as your booking is confirmed by the resort.</p>
  `;
  return sendMail({
    to: booking.guest_email,
    subject: `Booking Request Received - #${booking.id} - Sree Raaga Resort`,
    html: getEmailShell("Booking Received", content),
    text: `Booking Request Received: Booking #${booking.id} for ${booking.room_name} is currently ${booking.status}.`
  });
};

// 6. Booking Status / Details Update Alert
exports.sendBookingUpdatedEmail = async (booking) => {
  const checkIn = formatDate(booking.check_in);
  const checkOut = formatDate(booking.check_out);
  const price = parseFloat(booking.total_price) || 0;

  const content = `
    <div class="greeting">Booking Updated</div>
    <p>Dear <strong>${booking.guest_name || "Guest"}</strong>,</p>
    <p>Your booking status has been updated.</p>
    <div class="box">
      <strong>Booking Details:</strong><br>
      • Booking ID: #${booking.id}<br>
      • Room: ${booking.room_name}<br>
      ${booking.room_number ? `• Room Number: <strong>${booking.room_number}</strong><br>` : ""}
      • Dates: ${checkIn} to ${checkOut}<br>
      • Price: ₹${price.toLocaleString("en-IN")}<br>
      • Payment Method: ${booking.payment_method || "cash"}<br>
      • Status: <strong style="text-transform: uppercase; color: #c8a64d;">${booking.status}</strong>
    </div>
    <p>We look forward to your stay. Have a safe trip!</p>
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
    <div class="greeting">Booking Cancelled</div>
    <p>Dear <strong>${booking.guest_name || "Guest"}</strong>,</p>
    <p>This email confirms that your booking <strong>#${booking.id}</strong> has been cancelled.</p>
    <div class="box">
      • Room: ${booking.room_name}<br>
      ${booking.room_number ? `• Room Number: <strong>${booking.room_number}</strong><br>` : ""}
      • Dates: ${checkIn} to ${checkOut}<br>
      • Status: Cancelled
    </div>
    <p>If you did not ask to cancel this, or if you have questions, please contact us.</p>
  `;
  return sendMail({
    to: booking.guest_email,
    subject: `Booking Cancelled - #${booking.id} - Sree Raaga Resort`,
    html: getEmailShell("Booking Cancelled", content),
    text: `Booking Cancellation: Booking #${booking.id} has been cancelled.`
  });
};

// 8. Food Order Created Notification (Simple & Normal language)
exports.sendFoodOrderCreatedEmail = async (order) => {
  if (!order.guestEmail) {
    console.log(`[Email Alert] No email found for food order #${order.id}. Skipping email.`);
    return false;
  }

  const content = `
    <div class="greeting">Food Order Received!</div>
    <p>Dear <strong>${order.guestName}</strong>,</p>
    <p>We have received your food order. Our kitchen team is starting to make your food now.</p>
    <div class="box">
      <strong>Order Details:</strong><br>
      • Order ID: #${order.id}<br>
      • Dish Name: ${order.dishName}<br>
      • Quantity: ${order.quantity}<br>
      • Price: ₹${order.price} each (Total Price: ₹${order.totalPrice})<br>
      • Room Number: <strong>${order.roomNumber}</strong><br>
      • Status: <strong>${order.status}</strong>
    </div>
    <p>We will bring the food to your room as soon as it is ready.</p>
  `;

  return sendMail({
    to: order.guestEmail,
    subject: `Food Order Placed - #${order.id} - Sree Raaga Resort`,
    html: getEmailShell("Food Order Received", content),
    text: `We received your food order for ${order.quantity}x ${order.dishName}. We will deliver it to room ${order.roomNumber} shortly.`
  });
};

// 9. Food Order Status Updated Notification (Simple & Normal language)
exports.sendFoodOrderStatusUpdatedEmail = async (order) => {
  if (!order.guestEmail) {
    console.log(`[Email Alert] No email found for food order #${order.id}. Skipping email.`);
    return false;
  }

  let statusMsg = "";
  if (order.status === "preparing") {
    statusMsg = "Our chefs are now cooking your food.";
  } else if (order.status === "delivered") {
    statusMsg = "Your food has been delivered to your room. Enjoy your meal!";
  } else if (order.status === "cancelled") {
    statusMsg = "Your food order has been cancelled. Please contact us if you need help.";
  } else {
    statusMsg = `Your order status is now: ${order.status}`;
  }

  const content = `
    <div class="greeting">Food Order Update</div>
    <p>Dear <strong>${order.guestName}</strong>,</p>
    <p>${statusMsg}</p>
    <div class="box">
      <strong>Order Details:</strong><br>
      • Order ID: #${order.id}<br>
      • Dish Name: ${order.dishName}<br>
      • Quantity: ${order.quantity}<br>
      • Room Number: <strong>${order.roomNumber}</strong><br>
      • Status: <strong style="text-transform: uppercase; color: #c8a64d;">${order.status}</strong>
    </div>
    <p>Thank you for choosing Sree Raaga Resort!</p>
  `;

  return sendMail({
    to: order.guestEmail,
    subject: `Food Order Update - #${order.id} - ${order.status.toUpperCase()}`,
    html: getEmailShell("Food Order Update", content),
    text: `Your food order status has been updated to ${order.status}.`
  });
};

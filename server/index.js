const express = require('express');
const config = require('./config');
const db = require('./db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

// Initialize Database Tables
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Note: with pool, we can query directly.
db.query(schema, (err, results) => {
    if (err) {
        console.error('Error initializing database:', err);
    } else {
        console.log('Database initialized successfully.');
    }
});

// Create Recipients table if not exists (from reference)
const createRecipientsTable = `
  CREATE TABLE IF NOT EXISTS recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
db.query(createRecipientsTable, (err) => {
    if (err) console.error('Error creating recipients table:', err);
    else console.log('Recipients table ready');
});

// Middleware to ensure DB connection (Pool handles this, simplified)
const ensureDb = (req, res, next) => {
    // With pool, we assume connection is available or will wait
    next();
};

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API: Get Products
app.get('/api/products', ensureDb, (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// API: Get Plans
app.get('/api/plans', ensureDb, (req, res) => {
    db.query('SELECT * FROM plans', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// API: Add to Cart (Simplified: Upsert)
app.post('/api/cart', ensureDb, (req, res) => {
    const { user_id, product_id } = req.body;

    // Check if exists
    db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            db.query('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [results[0].id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Cart updated' });
            });
        } else {
            db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)', [user_id, product_id], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Added to cart' });
            });
        }
    });
});

// API: Get Cart
app.get('/api/cart/:user_id', ensureDb, (req, res) => {
    const sql = `
        SELECT c.id AS cart_id, c.quantity, p.* 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    `;
    db.query(sql, [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// API: Update Cart Quantity
app.put('/api/cart/:id', ensureDb, (req, res) => {
    const { quantity } = req.body;
    console.log(`[DEBUG] Updating cart ID: ${req.params.id} to quantity: ${quantity}`);
    if (quantity <= 0) {
        db.query('DELETE FROM cart WHERE id = ?', [req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Item removed' });
        });
    } else {
        db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Cart updated' });
        });
    }
});

// API: Remove from Cart
app.delete('/api/cart/:id', ensureDb, (req, res) => {
    console.log(`[DEBUG] Deleting cart item ID: ${req.params.id}`);
    db.query('DELETE FROM cart WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Item removed' });
    });
});

// API: Place Order
app.post('/api/orders', ensureDb, (req, res) => {
    const { customer_name, email, phone, address, payment_method, total_amount, items, user_id } = req.body;

    const sql = 'INSERT INTO orders (customer_name, email, phone, address, payment_method, total_amount, items) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [customer_name, email, phone, address, payment_method, total_amount, JSON.stringify(items)], async (err, result) => {
        if (err) return res.status(500).json(err);

        // Clear Cart
        db.query('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
            if (err) console.error('Failed to clear cart:', err);
        });

        // Email Notification Logic (Updated from Reference)
        console.log('[DEBUG] Order placed. Email field:', email);
        if (email) {
            let recipients = [];
            if (typeof email === 'string') {
                recipients = email.split(',').map(e => e.trim()).filter(e => e);
            } else if (Array.isArray(email)) {
                recipients = email.map(e => String(e).trim()).filter(e => e);
            }

            console.log('[DEBUG] Recipients parsed:', recipients);

            const subject = 'Order Confirmation - Gym Fuel';
            const textContent = `Hello ${customer_name},\n\nYour order #${result.insertId} has been successfully placed.\n\nTotal Amount: ₹${total_amount}\n\nDelivery Address:\n${address}\n\nYour order will be packed and delivered soon.\n\nThank you for choosing Gym Fuel!`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.email.pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // We use Promise.all to ensure we wait for them (optional, but good for debugging)
            Promise.all(recipients.map(async (recipientEmail) => {
                console.log(`[DEBUG] Attempting to send to: ${recipientEmail}`);
                const mailOptions = {
                    from: config.email.user,
                    to: recipientEmail,
                    subject: subject,
                    text: textContent
                };

                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log(`[SUCCESS] Email sent to ${recipientEmail}: ` + info.response);
                } catch (error) {
                    console.error(`[ERROR] Failed to send to ${recipientEmail}:`, error);
                }
                // Also add to recipients table for future bulk emails?
                // Optional, but matches the "Email System" intent
                db.query('INSERT IGNORE INTO recipients (email) VALUES (?)', [recipientEmail], (err) => {
                    if (err) console.error('Error saving recipient:', err.message);
                });
            })).then(() => {
                console.log('[DEBUG] All email attempts finished.');
            });
        }

        // WhatsApp Notification (Twilio)
        const accountSid = config.twilio.accountSid;
        const authToken = config.twilio.authToken;
        const fromPhone = config.twilio.whatsappNumber;

        // 1. Format the destination number
        let cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length === 10) {
            cleanedPhone = '91' + cleanedPhone;
        }

        let toPhone = `whatsapp:+${cleanedPhone}`;
        const trackingId = 'TRK' + Math.floor(100000 + Math.random() * 900000);
        const whatsappMessage = `*Order Confirmed!* ✅\n\nHello ${customer_name},\nYour order #${result.insertId} has been placed successfully.\n\n💰 *Amount:* ₹${total_amount}\n📦 *Tracking ID:* ${trackingId}\n\nThank you for shopping with Gym Fuel! 💪`;

        console.log(`[Twilio] Attempting to send WhatsApp to ${toPhone}`);

        if (accountSid && authToken && !accountSid.includes('ACXXXX')) {
            const client = new twilio(accountSid, authToken);

            client.messages.create({
                body: whatsappMessage,
                from: fromPhone,
                to: toPhone
            })
                .then(message => {
                    console.log("Twilio WHATSAPP SENT: " + message.sid);
                    res.json({ message: 'Order placed, WhatsApp sent', orderId: result.insertId, trackingId, notificationStatus: 'sent' });
                })
                .catch(error => {
                    console.error("Twilio WHATSAPP FAILED:", error);
                    res.json({ message: 'Order placed, WhatsApp failed', orderId: result.insertId, trackingId, notificationStatus: 'failed', error: error.message });
                });
        } else {
            // Simulation
            res.json({ message: 'Order placed (Simulation)', orderId: result.insertId, trackingId, notificationStatus: 'simulation' });
        }
    });
});

// --- NEW ROUTES FROM REFERENCE: RECIPIENTS & BULK ---

// Get all recipients
app.get('/recipients', (req, res) => {
    db.query('SELECT * FROM recipients ORDER BY created_at DESC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Add recipient
app.post('/recipients', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query('INSERT INTO recipients (email) VALUES (?)', [email], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, email, message: 'Recipient added' });
    });
});

// Delete recipient
app.delete('/recipients/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM recipients WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Recipient deleted' });
    });
});

// Send Bulk Emails
app.post('/api/send-bulk', async (req, res) => {
    const { subject, message } = req.body;

    db.query('SELECT email FROM recipients', async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'No recipients found' });
        }

        const recipients = results.map(r => r.email);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.user,
                pass: config.email.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const emailSubject = subject || 'Order Status Update';
        const emailText = message || 'Your order is packed successfully';

        const statusReport = [];

        try {
            const promises = recipients.map(async (email) => {
                try {
                    await transporter.sendMail({
                        from: config.email.user,
                        to: email,
                        subject: emailSubject,
                        text: emailText
                    });
                    console.log(`✅ Email sent to ${email}`);
                    statusReport.push({ email, status: 'Success' });
                } catch (error) {
                    console.error(`❌ Failed to send to ${email}:`, error.message);
                    statusReport.push({ email, status: 'Failed', error: error.message });
                }
            });

            await Promise.all(promises);
            res.json({ message: 'Bulk sending completed', report: statusReport });

        } catch (error) {
            console.error('Bulk send error:', error);
            res.status(500).json({ error: 'Failed to initiate bulk send' });
        }
    });
});

// API: Send SMS
app.post('/api/send-sms', (req, res) => {
    const { to, message } = req.body;

    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;
    const fromPhone = config.twilio.phoneNumber;

    if (!accountSid || !authToken || accountSid.includes('ACXXXX')) {
        console.log(`[SIMULATION] SMS to ${to}: ${message}`);
        return res.json({ success: true, message: 'SMS simulated (configure .env for real SMS)' });
    }

    try {
        const client = new twilio(accountSid, authToken);
        client.messages.create({
            body: message,
            from: fromPhone,
            to: to
        })
            .then(msg => {
                console.log('SMS sent:', msg.sid);
                res.json({ success: true, sid: msg.sid });
            })
            .catch(err => {
                console.error('Error sending SMS:', err);
                res.status(500).json({ success: false, error: err.message });
            });
    } catch (error) {
        console.error('Twilio Client Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Send WhatsApp
app.post('/api/send-whatsapp', (req, res) => {
    const { to, message } = req.body;

    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;
    const fromPhone = config.twilio.whatsappNumber;

    let toPhone = to;
    if (!toPhone.startsWith('whatsapp:')) {
        toPhone = `whatsapp:${toPhone}`;
    }

    if (!to) {
        return res.status(400).json({ success: false, error: "Phone number is required" });
    }

    if (!accountSid || !authToken || accountSid.includes('ACXXXX')) {
        console.log(`[SIMULATION] WhatsApp to ${toPhone}: ${message}`);
        return res.json({ success: true, message: 'WhatsApp simulated (configure .env for real WhatsApp)' });
    }

    try {
        const client = new twilio(accountSid, authToken);
        client.messages.create({
            body: message,
            from: fromPhone,
            to: toPhone
        })
            .then(msg => {
                console.log('WhatsApp sent:', msg.sid);
                res.json({ success: true, sid: msg.sid });
            })
            .catch(err => {
                console.error('Error sending WhatsApp:', err);
                res.status(500).json({ success: false, error: err.message });
            });
    } catch (error) {
        console.error('Twilio Client Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API: Debug Email
app.post('/api/debug-email', async (req, res) => {
    const { to } = req.body;
    if (!to) return res.status(400).json({ error: 'Target email required' });

    console.log('[DEBUG] Testing email to:', to);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: config.email.user,
            to: to,
            subject: 'Debug Email - Gym Fuel',
            text: 'This is a test email to verify server configuration.'
        });
        console.log('[DEBUG] Email sent successfully:', info.response);
        res.json({ success: true, message: info.response });
    } catch (error) {
        console.error('[DEBUG] Email failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('--- SERVER CONFIG ---');
    console.log('Email User:', config.email.user);
    console.log('Email Pass Configured:', config.email.pass ? 'YES' : 'NO');
    console.log('--- SERVER STARTED ---');
});

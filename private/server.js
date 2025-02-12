require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable provided by Render

// Middleware to serve static files
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route to handle form submissions
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate all required fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Configure the email transporter for BT Internet
        const transporter = nodemailer.createTransport({
            host: 'mail.btinternet.com',
            port: 465, // Use 587 for TLS, or 465 for SSL
            secure: true, // true for SSL, false for TLS
            auth: {
                user: process.env.EMAIL, // Your BT email
                pass: process.env.EMAIL_PASSWORD, // Your BT email password
            },
        });

        const mailOptions = {
            from: email, // Sender's email (user's email)
            to: process.env.EMAIL, // Your BT email
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

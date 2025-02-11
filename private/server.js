require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000; // Define the server port

// Serve static files from the public folder
app.use(express.static(__dirname + '/../'));
 
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

    // Additional validation: Check if the recipient email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(process.env.EMAIL)) {
        return res.status(400).json({ error: 'Invalid recipient email address.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        

        const mailOptions = {
            from: email, // Sender's email (user's email)
            to: process.env.EMAIL, // Dynamically provided recipient email
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


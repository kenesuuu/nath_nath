import twilio from 'twilio';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Enable CORS
const corsMiddleware = cors({
  origin: '*', // Change this to restrict to specific origins if needed
});

export default async function handler(req, res) {
  // Apply CORS middleware
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  if (req.method === 'POST') {
    const { phoneNumber, message } = req.body;

    try {
      const result = await client.messages.create({
        body: message,
        from: '+16596007371', // Your Twilio phone number
        to: phoneNumber,
      });
      console.log('SMS sent successfully:', result.sid);
      res.status(200).json({ status: 'success', message: result.sid });
    } catch (err) {
      console.error('Failed to send SMS:', err.message); // Log error message
      res.status(500).json({ status: 'error', message: 'Failed to send SMS' });
    }
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

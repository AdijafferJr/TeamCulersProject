import dotenv from "dotenv";
import twilio from "twilio";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../../clark-safety/.env"),
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log('TWILIO_ACCOUNT_SID:', accountSid);
console.log('TWILIO_AUTH_TOKEN:', authToken);

export async function createMessage(type, location, time) {
    const messageBody = `WARNING: A ${type} has been reported at ${location} at ${time}. Please stay clear of the area until further notice.`;
    
    try {
        const message = await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.PHONE_NUMBER,
        });

        console.log('Message sent:', message.body);
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}



import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import twilio from "twilio";  

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/crimeReports', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const reportSchema = new mongoose.Schema({
    name: String,
    studentId: String,
    report: String,
    location: String,
    time: String, 
    type: String, 
    additionalInfo: String,
});

const Report = mongoose.model('Report', reportSchema);

const accountSid = process.env.TWILIO_ACCOUNT_SID;  
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/api/report-crime', async (req, res) => {
    const reportData = req.body; 
    console.log('Report received:', reportData);

    const newReport = new Report(reportData);
    try {
        await newReport.save();  
        console.log('Report saved:', newReport);
    } catch (error) {
        console.error('Error saving report to database:', error);
        return res.status(500).json({ message: "Error saving report to database." });
    }

    try {
        await createMessage(reportData.type, reportData.location, reportData.time);
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: "Error sending notification." });
    }

    res.status(200).json({ message: "Report received successfully" }); 
});

async function createMessage(type, location, time) {
    const message = await client.messages.create({
        body: `Alert: A ${type} incident occurred at ${location} at ${time}. Please stay clear of the area.`,
        from: "whatsapp:+14155238886",
        to: "whatsapp:+19293804532",
    });

    console.log(message.body);
}

app.listen(5000, () => console.log("app is running"));

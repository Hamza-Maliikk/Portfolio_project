import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

// Get all contact messages
const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new contact message
const AddContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Step 1: Save to DB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Step 2: Email alag try/catch mein
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message); 
    }

    res.status(201).json({ message: "Message sent successfully", contact: newContact });

  } catch (error) {
    console.error("CONTACT ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export { getContact, AddContact };
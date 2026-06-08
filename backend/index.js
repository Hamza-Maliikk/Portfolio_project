import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import OpenAI from "openai";

import { connectToDatabase } from "./connection.js";
import { userData, addUser, registerUser, loginUser } from "./controllers/user.js";
import { authChecker } from "./middleware/index.js";
import { AddEducation, getEducation, updateEducation, deleteEducation } from "./controllers/education.js";
import { getBlogs, AddBlog, updateBlog, deleteBlog } from "./controllers/blog.js";
import { getCategories, AddCategory, updateCategory, deleteCategory } from "./controllers/categories.js";
import { upload, uploadHome, uploadTestimonial, uploadResume, uploadChat } from "./middleware/multer.js";
import { AddAbout, getAbout, updateAbout, deleteSkill } from "./controllers/about.js";
import { getProjects, AddProject, updateProject, deleteProject } from "./controllers/work.js";
import { getContact, AddContact } from "./controllers/contact.js";
import { getDetails, AddDetails, UpdateDetails, deleteDetails } from "./controllers/details.js";
import { getHome, AddHome, UpdateHome, deleteHome } from "./controllers/home.js";
import { getTestimonials, AddTestimonial, UpdateTestimonial, deleteTestimonial } from "./controllers/testimonial.js";
import { getResume, addResume, updateResume, deleteResume } from "./controllers/resume.js";
import { getMessages, AddMessage } from "./controllers/message.js";
import { Addkey, fetchKey, decryptApiKey } from "./controllers/key.js";
import Key from "./models/key.js";
import HomeModel from "./models/home.js";
import TestimonialsModel from "./models/testimonials.js";
import ResumeModel from "./models/resume.js";
import WorkModel from "./models/work.js";

// ─── AI Setup ────────────────────────────────────────────────────────────────

let moonshot;

async function initAI() {
  const keyDoc = await Key.findOne().sort({ _id: -1 });

  if (!keyDoc) {
    console.log("❌ Koi key nahi mili — pehle /api/save-key se key save karo!");
    return;
  }

  const decryptedKey = decryptApiKey(keyDoc.key);

  moonshot = new OpenAI({
    apiKey: decryptedKey,
    baseURL: "https://api.moonshot.ai/v1",
  });
  console.log("✅ AI ready");
}

async function getAIReply(userMessage) {
  try {
    const completion = await moonshot.chat.completions.create({
      model: "kimi-k2.5",
      messages: [
        {
          role: "system",
          content:
            "Tum ek portfolio website ka helpful chat assistant ho. Sirf final jawab do. Reasoning mat do. Short reply (2-3 lines max).",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 150,
    });

    const message = completion.choices[0].message;

    const reply =
      message.content && message.content.trim() !== ""
        ? message.content
        : message.reasoning_content || "Sorry, reply generate nahi hua.";

    return reply;
  } catch (err) {
    console.error("Moonshot error:", err.message);
    return "Sorry, abhi reply nahi de sakta. Thodi der baad try karo!";
  }
}

// ─── App & Socket Setup ───────────────────────────────────────────────────────

const port = 8000;
const app = express();
let adminOnline = false;
let adminSocketId = null;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-admin", () => {
    socket.join("admin-room");
    adminOnline = true;
    adminSocketId = socket.id;
    console.log("Admin ONLINE:", socket.id);
  });

  socket.on("user-message", async (data) => {
    console.log("Admin online status:", adminOnline);
    console.log("Message from user:", data);

    if (adminOnline) {
      console.log("Admin online — message forward kar raha hun");
      io.to("admin-room").emit("receive-message", {
        ...data,
        userId: socket.id,
      });
    } else {
      console.log("Admin offline — AI reply karega");
      const aiReply = await getAIReply(data.text);
      console.log("AI Reply:", aiReply);
      socket.emit("receive-reply", aiReply);
    }
  });

  socket.on("admin-reply", (data) => {
    console.log("Reply from admin:", JSON.stringify(data));
    io.to(data.userId).emit("receive-reply", data.text);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    if (socket.id === adminSocketId) {
      adminOnline = false;
      adminSocketId = null;
      console.log("Admin OFFLINE!");
    }
  });
});

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

// User
app.get("/api/user/", userData);
app.post("/api/user", addUser);
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.post("/", loginUser);
app.get("/dashboard", authChecker, userData);

// Homepage (combined)
app.get("/api/homepage", async (req, res) => {
  try {
    const [home, testimonials, resume, work] = await Promise.all([
      HomeModel.find(),
      TestimonialsModel.find(),
      ResumeModel.find(),
      WorkModel.find(),
    ]);
    res.status(200).json({ home, testimonials, resume, work });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// About
app.get("/api/about",getAbout);
app.post("/api/about",authChecker,   AddAbout);
app.put("/api/about/:id",authChecker,  updateAbout);
app.delete("/api/about/skill/:skill",authChecker, deleteSkill);

// Projects
app.get("/api/projects", getProjects);
app.post("/api/projects",authChecker, AddProject);
app.put("/api/projects/:id",authChecker, updateProject);
app.delete("/api/projects/:id",authChecker, deleteProject);

// Categories
app.get("/api/categories", getCategories);
app.post("/api/categories", authChecker, AddCategory);
app.put("/api/categories/:id", authChecker, updateCategory);
app.delete("/api/categories/:id", authChecker, deleteCategory);

// Blogs
app.get("/api/blogs", getBlogs);
app.post("/api/blogs", authChecker, upload.single("image"), AddBlog);
app.put("/api/blogs/:id", authChecker, upload.single("image"), updateBlog);
app.delete("/api/blogs/:id", authChecker, deleteBlog);

// Education
app.get("/api/education", getEducation);
app.post("/api/education", authChecker, AddEducation);
app.put("/api/education/:id", authChecker, updateEducation);
app.delete("/api/education/:id", authChecker, deleteEducation);

// Contact
app.get("/api/contact", getContact);
app.post("/api/contact",  AddContact);

// Details
app.get("/api/details", getDetails);
app.post("/api/details", authChecker, AddDetails);
app.put("/api/details/:id", authChecker, UpdateDetails);
app.delete("/api/details/:id", authChecker, deleteDetails);

// Home
app.get("/api/home", getHome);
app.post("/api/home", authChecker, uploadHome.single("image"), AddHome);
app.put("/api/home/:id", authChecker, uploadHome.single("image"), UpdateHome);
app.delete("/api/home/:id", authChecker, deleteHome);

// Testimonials
app.get("/api/testimonials", getTestimonials);
app.post("/api/testimonials", authChecker, uploadTestimonial.single("image"), AddTestimonial);
app.put("/api/testimonials/:id", authChecker, uploadTestimonial.single("image"), UpdateTestimonial);
app.delete("/api/testimonials/:id", authChecker, deleteTestimonial);

// Resume
app.get("/api/resume", getResume);
app.post("/api/resume", authChecker, uploadResume.single("pdf"), addResume);
app.put("/api/resume/:id", authChecker, uploadResume.single("pdf"), updateResume);
app.delete("/api/resume/:id", authChecker, deleteResume);

// Messages
app.get("/api/messages", getMessages);
app.post("/api/messages", authChecker, uploadChat.array("file", 5), AddMessage);

// API Key
app.post("/api/save-key", authChecker, Addkey);
app.get("/api/save-key", authChecker, fetchKey);

// ─── Start Server ─────────────────────────────────────────────────────────────

connectToDatabase(process.env.MONGO_URI).then(async () => {
  await initAI();
  server.listen(port, () => {
    console.log(`🚀 Server and Socket running at http://localhost:${port}`);
  });
});
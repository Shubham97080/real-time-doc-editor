# Real-Time Doc Editor ✍️

A collaborative real-time document editor built with **React**, **Socket.IO**, **Express**, and **MongoDB**. Users can write, edit, and sync documents in real time — just like Google Docs!

---

## 🚀 Features

- 🔄 Real-time collaboration using **WebSockets (Socket.IO)**
- 👥 Track online users
- 💬 Live chat panel
- 📜 Version history (optional)
- 🔐 Authentication system (JWT-based)
- ☁️ Hosted on **Vercel** (Frontend) & **Render/MongoDB Atlas** (Backend/DB)

---

## 📁 Project Structure

real-time-doc-editor/
├── client/ # React frontend
├── server/ # Express backend
├── README.md
└── .env # Environment variables

---

## ⚙️ Tech Stack

| Frontend      | Backend       | Real-Time | Database     |
|---------------|---------------|-----------|--------------|
| React         | Node.js       | Socket.IO | MongoDB Atlas |
| Tailwind CSS  | Express.js    |           | Mongoose     |

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/real-time-doc-editor.git
cd real-time-doc-editor
2. Setup the backendcd server
npm install
cp .env.example .env  # Add your Mongo URI and JWT_SECRET
npm start
3. Setup the frontend
cd client
npm install
npm start
🌐 Deployment
Frontend: Vercel

Backend: Render or Railway

Database: MongoDB Atlas
🛡️ Environment Variables
Create a .env file in the /server folder:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

Let me know if you want to customize the README for:
- Hindi/English hybrid
- College branding (RIT)
- With live URL or demo GIF

Or I can auto-fill your GitHub username in the links too.

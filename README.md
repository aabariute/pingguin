# 🐧 Pingguin — Real-time Chat App

A modern, responsive chat app with real-time messaging, image sharing, and profile management. Built with React (Tailwind + DaisyUI) on the frontend and Node/Express + MongoDB on the backend. Uploads are handled with Cloudinary; auth uses secure HTTP-only cookies.

**Live demo:** https://pingguin.onrender.com/

---

## ✨ Features

- Real-time messaging (Socket.IO)
- Image sharing with Cloudinary delivery
- Responsive UI (mobile-first, light/dark themes; DaisyUI)
- Profile management: avatar upload & preview
- User discovery & presence: search and online-only filter
- Conversation list with last message preview
- Relative timestamps in message threads
- Account management: change password and delete account

---

## 🧱 Tech Stack

**Frontend**

- React + React Router
- Tailwind CSS + DaisyUI
- Context providers: `AuthProvider`, `ChatProvider`, `UserProvider`

**Backend**

- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- Socket.IO (server + client)
- Cloudinary (uploads & transforms)
- JWT cookies

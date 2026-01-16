# 🛒 Satya General Store - WhatsApp E-Commerce

A modern, high-performance grocery e-commerce application built with **React**, **Tailwind CSS**, and **Google Gemini AI**. Designed for local businesses to manage inventory and receive orders directly via WhatsApp.

## ✨ Features

- 📲 **WhatsApp Ordering**: Users can add items to their cart and checkout instantly via WhatsApp message.
- 🤖 **AI Shopping Assistant**: Integrated Google Gemini AI to help customers find products and answer queries.
- 🛠️ **Admin Dashboard**: Secure management of products (add/edit/delete) and user accounts.
- 🏠 **Home Page Highlights**: Featured products, special offers, and how-to-order guides.
- 📱 **Fully Responsive**: Optimized for both Desktop and Mobile (Satya General Store branding visible on all screens).
- 🇮🇳 **Indian Context**: Prices in Indian Rupees (₹) and Indian address format.

## 🚀 Tech Stack

- **Frontend**: React (ESM)
- **Styling**: Tailwind CSS
- **AI**: @google/genai (Gemini 3 Flash)
- **Icons**: Lucide/HeroIcons

## 📦 How to Setup

1. **Clone the project**:
   ```bash
   git clone <your-repo-url>
   ```

2. **Set Environment Variables**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

3. **Run the App**:
   Since this app uses ESM modules and Tailwind CDN, you can serve it using any local static server (like `live-server` or `serve`).

## 📲 How to Order

1. Select items from the **Store**.
2. Go to the **Cart** and enter delivery details.
3. Click **"Place Order Now"**.
4. A pre-filled WhatsApp message will open for the store owner.

---
Built with ❤️ for Satya General Store.
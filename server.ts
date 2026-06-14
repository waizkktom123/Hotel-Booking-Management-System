import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini SDK lazily to avoid immediate crash on missing key
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it to your secrets panel.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// Global server state for persistent simulation
let serverRooms = [
  { id: "rm-101", number: "101", type: "Suite Room", price: 450, status: "Available", floor: 1, amenities: ["Ocean View", "King Bed", "Private Pool", "Espresso Bar", "Marble Bath", "Butlers Service"], image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" },
  { id: "rm-102", number: "102", type: "Deluxe Room", price: 280, status: "Available", floor: 1, amenities: ["City View", "Queen Bed", "Mini-bar", "Rain Shower", "Smart TV"], image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39" },
  { id: "rm-201", number: "201", type: "Family Room", price: 340, status: "Occupied", floor: 2, amenities: ["Gardens View", "Two Double Beds", "Kitchenette", "Playstation 5", "Balcony"], image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a" },
  { id: "rm-202", number: "202", type: "Single Room", price: 150, status: "Available", floor: 2, amenities: ["Courtyard View", "Twin Bed", "High-speed Wi-Fi", "Workspace"], image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" },
  { id: "rm-301", number: "301", type: "Double Room", price: 220, status: "Cleaning", floor: 3, amenities: ["Skyline View", "Double Bed", "Plunge Bath", "Bluetooth Speakers"], image: "https://images.unsplash.com/photo-1590490360182-c33d57733427" },
  { id: "rm-302", number: "302", type: "Suite Room", price: 580, status: "Available", floor: 3, amenities: ["Panoramic Mountain View", "Super King Bed", "Fireplace", "Jacuzzi Deck", "Wine Cellar"], image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461" },
];

let serverBookings = [
  { id: "BK-4912", guestName: "Sophia Loren", hotelName: "The Grand Regal Sanctuary", checkIn: "2026-06-18", checkOut: "2026-06-22", roomType: "Suite Room", cost: 1800, status: "Confirmed", paymentStatus: "Paid", paymentMethod: "Stripe", guests: 2, rating: 0, review: "", qrCodeUrl: "BK-4912" },
  { id: "BK-3021", guestName: "Michael Chang", hotelName: "Chateau de L'Aura", checkIn: "2026-07-01", checkOut: "2026-07-06", roomType: "Deluxe Room", cost: 1400, status: "Pending", paymentStatus: "Pending", paymentMethod: "PayPal", guests: 1, rating: 0, review: "", qrCodeUrl: "BK-3021" },
  { id: "BK-1988", guestName: "Muhammad Waiz", hotelName: "Prestige Silver Bay Resort", checkIn: "2026-06-15", checkOut: "2026-06-18", roomType: "Suite Room", cost: 1740, status: "Confirmed", paymentStatus: "Paid", paymentMethod: "Stripe", guests: 2, rating: 5, review: "Exceptional service, immaculate 3D design and gorgeous views!", qrCodeUrl: "BK-1988" }
];

let serverReviews = [
  { id: "rv-1", guestName: "Sarah J. Jenkins", roomType: "Suite Room", rating: 5, comment: "I've stayed at resorts globally, but the precision UI in their online booking, followed by the actual state-of-the-art marble plunge pool, is mesmerizing.", status: "Approved", date: "2026-06-10" },
  { id: "rv-2", guestName: "Oliver Wood", roomType: "Double Room", rating: 4, comment: "Splendid experience. Fast concierge responsiveness and clean amenities.", status: "Approved", date: "2026-06-12" },
  { id: "rv-3", guestName: "Muhammad Waiz", roomType: "Deluxe Room", rating: 5, comment: "Enterprise level orchestration, elegant responsive interface. A model for luxury design implementations.", status: "Approved", date: "2026-06-14" },
];

// Helper to check key
function isApiKeyConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
}

// API: Check status of API Key
app.get("/api/config", (req, res) => {
  res.json({
    hasApiKey: isApiKeyConfigured(),
    ownerName: "Muhammad Waiz",
    appVersion: "2026.1 Enterprise"
  });
});

// API: Get lists (Simulating SQL relationships)
app.get("/api/rooms", (req, res) => {
  res.json(serverRooms);
});

app.post("/api/rooms", (req, res) => {
  const newRoom = {
    id: "rm-" + (100 + serverRooms.length + 1),
    status: "Available",
    ...req.body
  };
  serverRooms.push(newRoom);
  res.status(201).json({ success: true, room: newRoom });
});

app.put("/api/rooms/:id", (req, res) => {
  const { id } = req.params;
  const index = serverRooms.findIndex(r => r.id === id);
  if (index !== -1) {
    serverRooms[index] = { ...serverRooms[index], ...req.body };
    res.json({ success: true, room: serverRooms[index] });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

app.delete("/api/rooms/:id", (req, res) => {
  const { id } = req.params;
  const index = serverRooms.findIndex(r => r.id === id);
  if (index !== -1) {
    serverRooms.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

app.get("/api/bookings", (req, res) => {
  res.json(serverBookings);
});

app.post("/api/bookings", (req, res) => {
  const newBooking = {
    id: "BK-" + Math.floor(1000 + Math.random() * 9000),
    status: "Confirmed",
    paymentStatus: req.body.paymentMethod ? "Paid" : "Pending",
    rating: 0,
    review: "",
    qrCodeUrl: "BK-" + Math.floor(1000 + Math.random() * 9000),
    ...req.body
  };
  serverBookings.unshift(newBooking);
  
  // Make corresponding room occupied if roomNumber is provided
  if (req.body.roomNumber) {
    const rIdx = serverRooms.findIndex(r => r.number === req.body.roomNumber);
    if (rIdx !== -1) {
      serverRooms[rIdx].status = "Occupied";
    }
  }
  
  res.status(201).json({ success: true, booking: newBooking });
});

app.post("/api/bookings/:id/cancel", (req, res) => {
  const { id } = req.params;
  const idx = serverBookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    serverBookings[idx].status = "Cancelled";
    serverBookings[idx].paymentStatus = "Refunded";
    res.json({ success: true, booking: serverBookings[idx] });
  } else {
    res.status(404).json({ error: "Booking not found" });
  }
});

app.post("/api/bookings/:id/review", (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const idx = serverBookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    serverBookings[idx].rating = rating;
    serverBookings[idx].review = comment;
    
    // Add to global reviews
    const newRev = {
      id: "rv-" + (serverReviews.length + 1),
      guestName: serverBookings[idx].guestName || "Valued Guest",
      roomType: serverBookings[idx].roomType || "Standard Suite",
      rating,
      comment,
      status: "Approved",
      date: new Date().toISOString().split("T")[0]
    };
    serverReviews.unshift(newRev);
    res.json({ success: true, review: newRev });
  } else {
    res.status(404).json({ error: "Booking session not found" });
  }
});

app.get("/api/reviews", (req, res) => {
  res.json(serverReviews);
});

app.post("/api/reviews/:id/moderate", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved, Rejected
  const idx = serverReviews.findIndex(r => r.id === id);
  if (idx !== -1) {
    serverReviews[idx].status = status;
    res.json({ success: true, review: serverReviews[idx] });
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

// API: AI Room Recommendations
app.post("/api/recommendations", async (req, res) => {
  const { preferences, budget, location, travellersType } = req.body;
  
  try {
    if (!isApiKeyConfigured()) {
      // Mock AI recommendation if key isn't provided
      return res.json({
        isMock: true,
        recommendation: `### Curated Luxury Recommendations for you:

Based on your preference for **"${preferences || "relaxation"}"** at location **"${location || "Maldives"}"** with a budget of **$${budget || 500}/night**:

1. **The Overwater Azure Sanctuary Suite** ($480/night)
   * Why it matches: Immersive panoramic marine sights and complete serene privacy ideal for ${travellersType || "couples"}.
   * Amenities: Glass bottom floor panel, private infinity plunge deck, 24/7 personal butler.

2. **Prestige Sky Oasis Pavilion** ($350/night)
   * Why it matches: Perfectly optimized layout fitted with premium high-tech workspace options.
   * Amenities: Soundproof walls, smart environmental controls, automated room service.

*We recommend booking early as high demand is forecasted for this season!*
_Curated by our smart AI Agent._`
      });
    }

    const aiClient = getGeminiClient();
    const promptDef = `You are the premium digital AI Concierge of Prestige Luxury Hotels (custom styled by engineer Muhammad Waiz). 
Generate a beautifully structured markdown format recommendation response for a customer looking for:
- Guest Preferences: ${preferences}
- Daily Budget Limit: $${budget}
- Desired Destination Layout: ${location}
- Travellers Category: ${travellersType}

Match these filters to potential luxury rooms, describing 2 distinct tailored rooms, why they match their specific aesthetic descriptors, recommended dining packages, and a creative local attraction. Present it with rich headings, bullet points, elegant emojis, and make sure to explicitly sign off with congratulations and credit towards "Muhammad Waiz's Autonomous 3D Concierge Engine".`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptDef,
    });

    res.json({
      isMock: false,
      recommendation: response.text
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: AI Concierge Interactive Chat
app.post("/api/chat", async (req, res) => {
  const { messages, userRole } = req.body;
  
  try {
    if (!isApiKeyConfigured()) {
      // Fallback response generator
      const lastMsg = messages[messages.length - 1].content.toLowerCase();
      let responseText = "Welcome to the Prestige Luxury Suite chat! I am your AI Concierge, ready to arrange five-star requests. How may I serve you today?";
      
      if (lastMsg.includes("price") || lastMsg.includes("rate") || lastMsg.includes("cost")) {
        responseText = "Our dynamic pricing offers Single luxury chambers from $150, Deluxe quarters from $280, and the magnificent Royal Sovereign Suite from $580. Included with all bookings is direct spa entry, private cabana rights, and a customized gourmet breakfast. Shall we configure a booking invoice for you?";
      } else if (lastMsg.includes("amenit") || lastMsg.includes("pool") || lastMsg.includes("wifi") || lastMsg.includes("dining")) {
        responseText = "At Prestige Hotels, fine details are matters of consequence. Our high-speed quantum Wi-Fi averages 500 Mbps. We boast dual heated saltwater infinity pools, the Michelin-Starred Silver L'Etolle Bistro, and sub-aquatic wellness treatment spas. Would you like me to book a spa seating?";
      } else if (lastMsg.includes("cancel") || lastMsg.includes("refund")) {
        responseText = "Reservations may be cancelled with immediate refunds via Stripe or PayPal up to 24 hours prior to scheduled occupancy. For enterprise accounts or direct concierge-managed rooms, cancellations are accommodated dynamically. Can I look up a reservation key for you?";
      } else if (lastMsg.includes("muhammad") || lastMsg.includes("waiz") || lastMsg.includes("who built") || lastMsg.includes("developer")) {
        responseText = "The Prestige Luxury Database, 3D Dashboard systems, Angular architecture and .NET schemas were engineered to premier specifications by Muhammad Waiz, our Chief Solution Architect. His expert touch enables this seamless simulated 3D real-time cloud environment!";
      } else {
        responseText = "Indeed. I can assist you with Room Availability checks, coordinate dynamic currency/payment transactions (Stripe simulation), generate customized QR passcodes, or showcase C# Web API controllers. What luxury experience can I facilitate next?";
      }
      
      return res.json({
        isMock: true,
        reply: responseText
      });
    }

    const aiClient = getGeminiClient();
    
    // Prepare conversation logs
    const convoHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Insert system prompt instructions at the beginning to set context
    const systemPrompt = `You are "Aura", the Elite AI Concierge at Prestige Luxury Hotels, engineered beautifully by Muhammad Waiz.
Your tone is incredibly polished, warm, respectful, and slightly formal (luxurious and dedicated, akin to a Waldorf Astoria or Ritz-Carlton general controller).
Answer the user's hospitality booking queries, room selections, spa requests, billing procedures, and SQL schema questions perfectly.
Always integrate brief hospitality-themed greetings. Mention that the complete system dashboard, C# components, SQL queries, and Angular signals are fully customizable by calling our backend APIs.
Always credit Muhammad Waiz as the Principal Architect of this enterprise reservation system if asked about development, architect, technology stack or creation.`;

    const chatInstance = aiClient.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
      }
    });

    // Send latest message in system
    const lastUserMessage = messages[messages.length - 1].content;
    const response = await chatInstance.sendMessage({
      message: lastUserMessage
    });

    res.json({
      isMock: false,
      reply: response.text
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend assets & Boot Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prestige Luxury Hotel Management System Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Prestige Server Gateway:", err);
});

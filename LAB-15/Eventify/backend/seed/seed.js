import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Event from '../models/Event.js';

const day = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); d.setHours(18, 0, 0, 0); return d; };
const events = [
  ['Neon Nights: Live in Concert','An electric open-air night of live music, immersive visuals and local food.','Music','Mumbai',18,1499,'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85'],
  ['Design Futures Summit','A one-day gathering of creative minds exploring what comes next in design and technology.','Technology','Bengaluru',24,2499,'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85'],
  ['The Sunday Table','A relaxed afternoon celebrating independent chefs, seasonal produce and good company.','Food','Pune',31,899,'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85'],
  ['Open Air Cinema: La La Land','A rooftop film screening under the stars, with snacks and a city skyline view.','Arts','Delhi',38,599,'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85'],
  ['Mindful Mornings: Yoga & Sound','Reset with guided movement, breathwork and a restorative sound bath.','Wellness','Hyderabad',45,749,'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85'],
  ['Indie Makers Market','Meet 40 independent makers, discover thoughtful objects and enjoy live acoustic sets.','Community','Mumbai',52,299,'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85'],
  ['Future of Startups','Founders and builders share practical lessons for making ambitious ideas real.','Technology','Bengaluru',59,1799,'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=85'],
  ['Jazz Under the Banyan','An intimate evening of modern jazz, candlelight and craft cocktails.','Music','Goa',66,1199,'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85']
].map(([title,description,category,location,offset,price,image]) => ({ title,description,category,location,date:day(offset),time:'6:00 PM',price,totalTickets:120,availableTickets:120,image }));
try { await connectDB(); await Event.deleteMany({}); await Event.insertMany(events); console.log(`Seeded ${events.length} events.`); }
catch (error) { console.error(error.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }

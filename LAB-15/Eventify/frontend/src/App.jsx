import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteLayout } from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Bookings from './pages/Bookings.jsx';
import Admin from './pages/Admin.jsx';
import { Link } from 'react-router-dom';
function NotFound(){return <div className="empty-state not-found"><span className="eyebrow">404 · WRONG TURN</span><h1>Nothing happening here<span className="accent">.</span></h1><Link to="/" className="button button-primary">Back home</Link></div>}
export default function App(){return <Routes><Route path="/" element={<SiteLayout><Home/></SiteLayout>}/><Route path="/explore" element={<SiteLayout><Explore/></SiteLayout>}/><Route path="/events/:id" element={<SiteLayout><EventDetail/></SiteLayout>}/><Route path="/bookings" element={<SiteLayout><Bookings/></SiteLayout>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<SiteLayout><NotFound/></SiteLayout>}/></Routes>}

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from './UI.jsx';

export function Navbar() {
  const [open,setOpen]=useState(false);
  return <header className="site-header"><div className="nav-wrap"><Logo/><button className="mobile-menu" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'nav-links open':'nav-links'}><NavLink to="/explore" onClick={()=>setOpen(false)}>Explore</NavLink><NavLink to="/bookings" onClick={()=>setOpen(false)}>My bookings</NavLink><NavLink to="/admin" onClick={()=>setOpen(false)}>Admin</NavLink></nav><Link className="nav-cta" to="/explore">Find an event <ArrowUpRight size={16}/></Link></div></header>;
}
export function Footer() { return <footer className="footer"><div className="footer-top"><div><Logo/><p>Make room for the moments<br/>you'll remember.</p></div><div className="footer-links"><Link to="/explore">Discover events</Link><Link to="/bookings">Your bookings</Link><Link to="/admin">Event manager</Link></div><div className="footer-note">Good things happen<br/>when we get together. <span>✳</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Eventify</span><span>Made for the moments that matter.</span></div></footer>; }
export function SiteLayout({ children }) { return <><Navbar/><main>{children}</main><Footer/></>; }

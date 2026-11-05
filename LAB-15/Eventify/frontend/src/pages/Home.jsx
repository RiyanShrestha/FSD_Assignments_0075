import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Music2, Sparkles, Utensils, Palette, HeartPulse, Users } from 'lucide-react';
import { api } from '../services/api.js';
import { EventGrid, LoadingSpinner, ErrorMessage, SearchBar, SectionHeading } from '../components/UI.jsx';

const categories=[['Music',Music2],['Technology',Sparkles],['Food',Utensils],['Arts',Palette],['Wellness',HeartPulse],['Community',Users]];
export default function Home(){
 const [events,setEvents]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[query,setQuery]=useState(''); const navigate=useNavigate();
 const load=()=>{setLoading(true);api.events().then(r=>setEvents(r.data)).catch(e=>setError(e.message)).finally(()=>setLoading(false));}; useEffect(load,[]);
 return <>
  <section className="hero"><div className="hero-glow"/><div className="hero-copy"><span className="eyebrow"><span className="live-dot"/> YOUR CITY, A LITTLE MORE ALIVE</span><h1>Find your<br/>next <em>moment.</em></h1><p>From front-row nights to slow Sunday afternoons—discover the things happening around you.</p><div className="hero-search"><SearchBar value={query} onChange={setQuery}/><button className="button button-primary" onClick={()=>navigate(`/explore${query?`?search=${encodeURIComponent(query)}`:''}`)}>Explore events <ArrowUpRight size={17}/></button></div><div className="hero-foot"><span><b>01</b> Discover your kind of thing</span><ArrowDown size={15}/></div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1500&q=90" alt="Crowd at a live music event"/><div className="hero-visual-shade"/><div className="hero-stamp"><span>✳</span><small>MAKE<br/>A NIGHT<br/>OF IT</small></div><div className="hero-caption"><span>THE CITY IS CALLING</span><span>19° 04' N&nbsp; 72° 52' E</span></div></div><div className="hero-scroll">SCROLL TO EXPLORE <ArrowDown size={13}/></div></section>
  <section className="category-strip"><span className="eyebrow">WHAT ARE YOU IN THE MOOD FOR?</span><div className="category-list">{categories.map(([name,Icon])=><Link key={name} to={`/explore?category=${name}`} className="category-item"><span><Icon size={19}/></span>{name}<ArrowUpRight size={13}/></Link>)}</div></section>
  <section className="section featured-section"><SectionHeading eyebrow="OUT THERE, RIGHT NOW" title={<>Worth making<br/>plans for<span className="accent">.</span></>} action={<Link to="/explore" className="outline-link">All events <ArrowRight size={15}/></Link>}/>{loading?<LoadingSpinner/>:error?<ErrorMessage message={error} onRetry={load}/>:<EventGrid events={events.slice(0,3)} featured/>}</section>
  <section className="manifesto"><span className="eyebrow">A FRIENDLY REMINDER</span><p>The best stories<br/>start with <em>“are you free?”</em></p><Link to="/explore" className="button button-light">Find your people <ArrowUpRight size={17}/></Link><span className="manifesto-mark">✳</span></section>
  <section className="section more-events"><SectionHeading eyebrow="PICK YOUR PACE" title={<>Good things are<br/>happening<span className="accent">.</span></>} action={<Link to="/explore" className="outline-link">Explore everything <ArrowRight size={15}/></Link>}/>{loading?<LoadingSpinner/>:error?<ErrorMessage message={error} onRetry={load}/>:<EventGrid events={events.slice(3,7)}/>}</section>
 </>;
}

import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MoveUpRight } from "lucide-react";

const Footer = () => (
  <footer className="site-footer">
    <div className="shell footer-top">
      <div><Link to="/" className="brand-lockup"><span className="brand-mark">S<span>.</span></span><span className="brand-name">smtp<span>lite</span></span></Link><p>Send what matters.<br />We’ll handle the rest.</p></div>
      <div className="footer-links"><div><span className="eyebrow">EXPLORE</span><Link to="/docs">Documentation <ArrowUpRight /></Link><Link to="/quick-start">Quick start <ArrowUpRight /></Link><Link to="/email-template">Templates <ArrowUpRight /></Link></div><div><span className="eyebrow">COMPANY</span><Link to="/privacy">Privacy <ArrowUpRight /></Link><Link to="/terms">Terms <ArrowUpRight /></Link><Link to="/status">System status <ArrowUpRight /></Link></div><div><span className="eyebrow">SAY HELLO</span><a href="mailto:smtplitee@gmail.com">smtplitee@gmail.com <MoveUpRight /></a></div></div>
    </div>
    <div className="shell footer-bottom"><span>© {new Date().getFullYear()} SMTPLite</span><span>Built for the messages that move things forward <span className="footer-spark">✳</span></span><Link to="/status">All systems operational</Link></div>
  </footer>
);

export default Footer;

"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="roomid-nav" aria-label="Main navigation">
      <Link
        href="/"
        className="nav-logo"
        aria-label="RoomID home"
        onClick={(e) => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("roomid:reset"));
        }}
      >
        <span className="nav-logo-room">Room</span>
        <span className="nav-logo-id">ID</span>
        <span className="nav-logo-zk" aria-hidden="true">zk</span>
      </Link>
      <ul className="nav-links" role="list">
        <li>
          <a href="#how-roomid-works">How it works</a>
        </li>
        <li>
          <a href="#verify">Verify</a>
        </li>
        <li>
          <a href="https://noir-lang.org" target="_blank" rel="noopener noreferrer">
            Docs ↗
          </a>
        </li>
      </ul>
      <a
        href="https://noir-lang.org"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-tech-badge"
        aria-label="Powered by Noir by Aztec"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 7l10 5 10-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22V12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Noir by Aztec
      </a>
    </nav>
  );
}

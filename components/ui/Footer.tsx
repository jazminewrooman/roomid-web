export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="roomid-footer">
      <div className="footer-gradient-line" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">
            <span className="nav-logo-room">Room</span>
            <span className="nav-logo-id">ID</span>
          </p>
          <p className="footer-tagline">
            Privacy-preserving rental identity<br />
            for the decentralized era.
          </p>
          <div className="footer-trust-badges">
            <span>zk-powered</span>
            <span>Privacy by default</span>
          </div>
        </div>

        <div className="footer-col">
          <p className="footer-col-heading">Ecosystem</p>
          <a href="#">RoomFi</a>
          <a href="#">RoomLen</a>
          <a href="#">Room Protocol</a>
        </div>

        <div className="footer-col">
          <p className="footer-col-heading">Protocol</p>
          <a href="#verify">Verify Credential</a>
          <a href="#">API Reference</a>
          <a href="#">Whitepaper</a>
        </div>

        <div className="footer-col">
          <p className="footer-col-heading">Technology</p>
          <a href="https://noir-lang.org" target="_blank" rel="noopener noreferrer">
            Noir (Aztec) ↗
          </a>
          <a href="#">zk Architecture</a>
          <a href="#">Privacy Model</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} RoomID Protocol. Your data never leaves your control.</p>
        <p className="footer-bottom-note">
          Built for compliance, privacy, and trust in rental markets.
        </p>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <div className="footer" id="contact">
      <div className="container">
        <div className="footerGrid">
          <div className="footerCol">
            <h3 className="footerTitle">Beauty Hub</h3>
            <div className="footerItem">
              Welcome to our world of beauty — book your next appointment in minutes.
            </div>
          </div>

          <div className="footerCol">
            <h3 className="footerTitle">Working hours</h3>
            <div className="footerItem">Mon–Sat: 09:00 – 20:00</div>
            <div className="footerItem">Sunday: Closed</div>
          </div>

          <div className="footerCol">
            <h3 className="footerTitle">Contact</h3>
            <div className="footerItem">📍 Teheranski trg 7, Sarajevo</div>
            <div className="footerItem">✉️ info@beautyhouse.ba</div>
            <div className="footerItem">📞 +387 62 225 224</div>
          </div>
        </div>

        <div className="copy">© {new Date().getFullYear()} Beauty Hub</div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Header() {
  const contact = {
    address: "Teheranski trg 7, Sarajevo",
    email: "info@beautyhouse.ba",
    phone: "+387 62 225 224",
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbarInner">
            <div className="topbarLeft">
              <span>📍 {contact.address}</span>
              <span>✉️ {contact.email}</span>
              <span>📞 {contact.phone}</span>
            </div>
            <div className="topbarRight">
              <span>Mon–Sat: 09:00–20:00</span>
              <span>Sun: Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nav">
        <div className="container">
          <div className="navInner">
            <Link className="brand" href="/">
              <span className="brandName">Beauty Hub</span>
              <span className="brandSub">From Cinderella to Princess in one day</span>
            </Link>

            <div className="navLinks">
              <Link href="/">Home</Link>
              <Link href="#about">About</Link>
              <Link href="#team">Team</Link>
              <Link href="#treatments">Treatments</Link>
              <Link href="#contact">Contact</Link>

              <Link href="#book">
                <button className="navBtn">Book Appointment</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

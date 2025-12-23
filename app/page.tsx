"use client";

import BookingForm from "@/components/BookingForm";

export default function Home() {
  const onBook = () => {
    // For now just scroll to treatments; later we’ll open your booking flow page/modal.
    const el = document.getElementById("treatments");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="hero" id="home">
        <div className="container">
          <div className="heroInner">
            <div>
              <h1 className="heroTitle">Welcome to Beauty Hub</h1>
              <p className="heroText">
                From Cinderella to Princess in one day. Book a treatment and enjoy a clean,
                professional, relaxing experience.
              </p>

              <div className="heroCtas">
                <button className="ctaPrimary" onClick={() => {
                   document.getElementById("book-online")?.scrollIntoView({ behavior: "smooth" });
                }}>Book Appointment</button>
                <a href="#treatments"><button className="ctaSecondary">View Treatments</button></a>
              </div>
            </div>

            <div className="heroCard">
              <div style={{ fontWeight: 900, fontSize: 16 }}>Why clients choose us</div>
              <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>
                Hygiene first • Professional team • Organic products
              </div>

              <div className="statRow">
                <div className="stat">
                  <div className="statNum">500+</div>
                  <div className="statLabel">Monthly clients</div>
                </div>
                <div className="stat">
                  <div className="statNum">10+</div>
                  <div className="statLabel">Years of experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <div className="section" id="about">
        <div className="container">
          <h2 className="sectionTitle">Our Story</h2>
          <p className="sectionLead">
            Beauty Hub is a hair & beauty salon with years of experience in the beauty industry.
            Our treatments are designed to refresh you and highlight your natural beauty.
          </p>
        </div>
      </div>

      <div className="section" id="treatments">
        <div className="container">
          <h2 className="sectionTitle">Treatments</h2>
          <p className="sectionLead">
            Choose a category — we’ll connect this later to your real services API.
          </p>

          <div className="grid">
            {[
              { badge: "Permanent Make-Up", title: "Permanent Make-Up", text: "Long-lasting beauty, natural results." },
              { badge: "Facials", title: "Facial Treatments", text: "Glow and refresh your skin." },
              { badge: "Lashes", title: "Lash Lift", text: "Lift and shape your natural lashes." },
              { badge: "Nails", title: "Nails", text: "A polished look for every style." },
              { badge: "Pedicure", title: "Pedicure", text: "Beautiful feet for every season." },
              { badge: "Extensions", title: "Lash Extensions", text: "Wake up with longer, fuller lashes." },
            ].map((x) => (
              <div className="card" key={x.title}>
                <span className="badge">{x.badge}</span>
                <div className="cardTitle">{x.title}</div>
                <div className="cardText">{x.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" id="team">
        <div className="container">
          <h2 className="sectionTitle">Our Team</h2>
          <p className="sectionLead">
            Add team members here (name + role + photo later). For now, this matches the layout.
          </p>

          <div className="grid">
            {["Amina", "Lejla", "Sara"].map((name) => (
              <div className="card" key={name}>
                <span className="badge">Specialist</span>
                <div className="cardTitle">{name}</div>
                <div className="cardText">Short bio goes here.</div>
              </div>
            ))}
          </div>
          <div id="book-online" className="section bg-white border-b border-gray-100">
        <div className="container">
           <div className="text-center mb-10">
              <h2 className="sectionTitle">Book Online</h2>
              <p className="sectionLead mx-auto">Select your service and preferred times below.</p>
           </div>
           <BookingForm />
        </div>
      </div>
        </div>
      </div>
    </>
  );
}

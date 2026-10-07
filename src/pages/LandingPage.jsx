import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* HERO SECTION */}
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 15px 0', letterSpacing: '-1px' }}>Nagar-Rakshak</h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Empowering citizens to report municipal hazards, track resolutions in real-time, and build safer communities together.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/report" style={{ textDecoration: 'none', padding: '14px 28px', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', borderRadius: '8px', fontSize: '16px', transition: '0.2s', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
            🚨 Report a Hazard
          </Link>
          <Link to="/track" style={{ textDecoration: 'none', padding: '14px 28px', backgroundColor: '#1e293b', color: '#f8fafc', fontWeight: 'bold', borderRadius: '8px', fontSize: '16px', border: '1px solid #475569', transition: '0.2s' }}>
            🔍 Track My Report
          </Link>
        </div>
      </div>

      {/* NEW: CIVIC SENSE & GUIDELINES SECTION */}
      <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', color: '#f8fafc', margin: '0 0 10px 0', fontWeight: 'bold' }}>Civic Duty & Guidelines</h2>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>Small actions create a massive impact. Keep these tips in mind.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
          
          {/* Tip 1 */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', borderTop: '4px solid #38bdf8', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>📸</div>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Clear Evidence</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              When reporting, take clear, wide-angle photos. This helps our NGO partners locate the exact problem area faster and bring the right equipment.
            </p>
          </div>

          {/* Tip 2 */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', borderTop: '4px solid #10b981', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>♻️</div>
            <h3 style={{ fontSize: '16px', color: '#10b981', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Waste Segregation</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Before municipal trucks arrive, ensure wet and dry waste are separated in your locality. Mixed waste delays processing and harms the environment.
            </p>
          </div>

          {/* Tip 3 */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', borderTop: '4px solid #f59e0b', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>🛑</div>
            <h3 style={{ fontSize: '16px', color: '#f59e0b', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Pothole Protocol</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Do not fill open potholes with temporary trash or plastic debris. It causes severe waterlogging and makes structural repairs much harder for our crews.
            </p>
          </div>

          {/* Tip 4 */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid #1e293b', borderTop: '4px solid #ef4444', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '15px' }}>🚨</div>
            <h3 style={{ fontSize: '16px', color: '#ef4444', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Emergency First</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Nagar-Rakshak is for infrastructure hazards. If a hazard is actively life-threatening (e.g., live sparking wires, major accidents), dial 112 immediately.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LandingPage;

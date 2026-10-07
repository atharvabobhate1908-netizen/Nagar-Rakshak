import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* TOP NAVIGATION BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🛡️ Nagar-Rakshak
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
          <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
          <Link to="/report" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Report Hazard</Link>
          <Link to="/map" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Tactical Map</Link>
          <Link to="/admin" style={{ padding: '8px 16px', backgroundColor: '#6366f1', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Admin Portal</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

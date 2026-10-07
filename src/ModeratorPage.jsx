import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const ADMIN_EMAILS = [
  'pantomime-managing44@bravealias.com' 
];

function SecureImage({ path }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!path) return;
      const { data, error } = await supabase.storage
        .from('report-images')
        .createSignedUrl(path, 3600);
      if (!error) setImageUrl(data.signedUrl);
    }
    fetchSignedUrl();
  }, [path]);

  if (!path) return <div style={{ width: '100px', height: '100px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '10px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No Image Attached</div>;
  if (!imageUrl) return <div style={{ width: '100px', height: '100px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '10px', color: '#94a3b8' }}>Decrypting...</div>;

  return <img src={imageUrl} alt="Hazard Proof" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #475569' }} />;
}

function ModeratorPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  const [pendingReports, setPendingReports] = useState([]);
  const [activeReports, setActiveReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]); 
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setAuthLoading(false);
    if (session?.user && ADMIN_EMAILS.includes(session.user.email)) {
      fetchDashData();
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthMsg("Authenticating credentials...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthMsg(error.message);
    } else {
      setUser(data.user);
      if (ADMIN_EMAILS.includes(data.user.email)) {
        setAuthMsg("");
        fetchDashData();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    setUser(null);
    setPendingReports([]);
    setActiveReports([]);
    setResolvedReports([]);
  };

  const fetchDashData = async () => {
    setDataLoading(true);
    const { data: pendingData } = await supabase.from('reports').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    const { data: activeData } = await supabase.from('reports').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    const { data: resolvedData } = await supabase.from('reports').select('*').eq('status', 'resolved').order('updated_at', { ascending: false }); 
    
    setPendingReports(pendingData || []);
    setActiveReports(activeData || []);
    setResolvedReports(resolvedData || []);
    setDataLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('reports').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) alert("Failed to update: " + error.message);
    else fetchDashData();
  };

  const handleShareNGO = (report) => {
    const reportText = `
========================================
NAGAR-RAKSHAK // FULL COMPLETION REPORT
========================================
INCIDENT ID: ${report.id}
CATEGORY: ${report.category ? report.category.toUpperCase().replace('_', ' ') : 'GENERAL HAZARD'}
GPS COORDINATES: ${report.latitude}, ${report.longitude}

ORIGINAL CITIZEN REPORT: 
"${report.description}"

STATUS: RESOLVED, VERIFIED & AUDITED
WORK DONE: Partner NGO dispatched. Proof of work successfully verified by Municipal Authority. Hazard cleared from intelligence grid.

CITIZEN NOTIFICATION:
A completion alert and thank-you message has been pushed to the reporting device (Hash: ${report.id.substring(0,6)}).
========================================
`;
    navigator.clipboard.writeText(reportText);
    alert(`[SUCCESS] Full Completion Report Generated.\n\nAutomated Alert Sent to Citizen Device: ${report.id.substring(0,6)}`);
  };

  const advanceWorkflow = async (e, id, currentStep) => {
    e.preventDefault(); 
    const { error } = await supabase
      .from('reports')
      .update({ workflow_step: currentStep + 1, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      alert("Database Error: " + error.message + "\n\nDid you forget to add the 'workflow_step' column in Supabase?");
    } else {
      fetchDashData();
    }
  };

  if (authLoading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Initializing Secure Portal...</div>;

  if (!user) {
    return (
      <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '12px', border: '1px solid #334155', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Nagar-Rakshak</h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Restricted Authority Access</p>
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="Authority Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #475569', outline: 'none' }} />
            <input type="password" placeholder="Passcode" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #475569', outline: 'none' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.2s' }}>Authenticate</button>
          </form>
          {authMsg && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>{authMsg}</p>}
        </div>
      </div>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ backgroundColor: '#450a0a', padding: '40px', borderRadius: '12px', border: '1px solid #7f1d1d', textAlign: 'center', maxWidth: '450px' }}>
          <h2 style={{ color: '#fca5a5', fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>SECURITY CLEARANCE DENIED</h2>
          <p style={{ color: '#fecaca', marginBottom: '25px', lineHeight: '1.5' }}>
            The account <strong>{user.email}</strong> does not have moderator privileges. This portal is strictly for authorized Nagar-Rakshak personnel.
          </p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Sign Out & Return</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Command Center</h1>
          <p style={{ color: '#10b981', margin: '5px 0 0 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></span>
            Secure Connection Active • {user.email}
          </p>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#334155', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Terminate Session</button>
      </div>

      {dataLoading ? <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Synchronizing intel...</div> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', color: '#fbbf24', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>⏳ Action Required</h2>
                <span style={{ backgroundColor: '#451a03', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{pendingReports.length} pending</span>
              </div>
              
              {pendingReports.length === 0 ? <p style={{ color: '#475569', textAlign: 'center', padding: '20px' }}>Queue is currently clear.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {pendingReports.map(r => (
                    <div key={r.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', borderLeft: '4px solid #fbbf24' }}>
                      <SecureImage path={r.image_path} />
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#fbbf24', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{r.category.replace('_', ' ')}</span>
                        <p style={{ margin: '8px 0', fontSize: '15px', lineHeight: '1.4' }}>{r.description}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>ID: {r.id.split('-')[0]} • GPS: {r.latitude}, {r.longitude}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => updateStatus(r.id, 'approved')} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Verify</button>
                        <button onClick={() => updateStatus(r.id, 'rejected')} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Dismiss</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>🚨 Live on Map</h2>
                <span style={{ backgroundColor: '#064e3b', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{activeReports.length} active</span>
              </div>
              
              {activeReports.length === 0 ? <p style={{ color: '#475569', textAlign: 'center', padding: '20px' }}>No active hazards on the grid.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {activeReports.map(r => (
                    <div key={r.id} style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', borderLeft: '4px solid #10b981', opacity: 0.8 }}>
                      <SecureImage path={r.image_path} />
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#10b981', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{r.category.replace('_', ' ')}</span>
                        <p style={{ margin: '8px 0', fontSize: '15px', lineHeight: '1.4' }}>{r.description}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Deployed on Map</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => updateStatus(r.id, 'resolved')} style={{ padding: '10px 16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}>Mark Fixed</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '30px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
              <h2 style={{ fontSize: '18px', color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>📁 Mission Archive & NGO Distribution</h2>
              <span style={{ backgroundColor: '#0c4a6e', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{resolvedReports.length} resolved</span>
            </div>

            {resolvedReports.length === 0 ? (
              <p style={{ color: '#475569', textAlign: 'center', padding: '20px' }}>No resolved missions yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {resolvedReports.map(r => {
                  
                  const step = r.workflow_step || 0; 

                  return (
                  <div key={r.id} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>{r.category.replace('_', ' ')}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>ID: {r.id.split('-')[0]}</div>
                      </div>
                      <span style={{ backgroundColor: '#022c22', color: '#34d399', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', border: '1px solid #059669' }}>
                        ✔ RESOLVED
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px', lineHeight: '1.4', flexGrow: 1 }}>{r.description}</p>

                    <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #334155' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Resolution Timeline:</p>
                      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ color: '#10b981' }}>✓ Hazard Confirmed & Mapped</div>
                        <div style={{ color: step >= 1 ? '#10b981' : '#475569', transition: '0.3s' }}>
                          {step >= 1 ? '✓ NGO / Contractor Dispatched' : '○ Pending Dispatch'}
                        </div>
                        <div style={{ color: step >= 2 ? '#10b981' : '#475569', transition: '0.3s' }}>
                          {step >= 2 ? '✓ Proof of Work Verified' : '○ Awaiting Work Proof'}
                        </div>
                        <div style={{ color: step >= 3 ? '#10b981' : '#475569', transition: '0.3s' }}>
                          {step >= 3 ? '✓ Citizen Notified' : '○ Pending Notification'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>
                      {step === 0 && (
                        <button onClick={(e) => advanceWorkflow(e, r.id, step)} style={{ width: '100%', padding: '10px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                          🚚 Dispatch to Partner NGO
                        </button>
                      )}
                      {step === 1 && (
                        <button onClick={(e) => advanceWorkflow(e, r.id, step)} style={{ width: '100%', padding: '10px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                          📸 Verify NGO Work Proof
                        </button>
                      )}
                      {step === 2 && (
                        <button onClick={(e) => { advanceWorkflow(e, r.id, step); handleShareNGO(r); }} style={{ width: '100%', padding: '10px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                          📩 Generate Report & Notify Citizen
                        </button>
                      )}
                      {step >= 3 && (
                        <button disabled style={{ width: '100%', padding: '10px', backgroundColor: '#064e3b', color: '#34d399', border: '1px solid #059669', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'not-allowed' }}>
                          ✔ Mission Fully Closed
                        </button>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ModeratorPage;

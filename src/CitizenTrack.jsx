import { useState } from 'react';
import { supabase } from './supabase';

function CitizenTrack() {
  const [searchId, setSearchId] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const searchReport = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);

    const { data } = await supabase
      .from('reports')
      .select('*')
      .ilike('id', `${searchId}%`)
      .single();

    if (data) setReport(data);
    else setError('Report not found. Please check your ID.');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', color: '#38bdf8', textAlign: 'center', marginBottom: '10px' }}>Track Your Report</h1>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '30px' }}>Enter your anonymous Report ID to view live municipal updates.</p>

        <form onSubmit={searchReport} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Enter ID (e.g., d703ae)" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' }}
            required
          />
          <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Track</button>
        </form>

        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}

        {report && (
          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h2 style={{ fontSize: '16px', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              Status for: {report.category.replace('_', ' ')}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: report.status !== 'pending' ? '#10b981' : '#38bdf8' }}></div>
                <div style={{ color: report.status !== 'pending' ? '#10b981' : '#f8fafc' }}>Hazard Confirmed & Mapped</div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: report.workflow_step >= 1 ? '#10b981' : '#334155' }}></div>
                <div style={{ color: report.workflow_step >= 1 ? '#10b981' : '#64748b' }}>Assigned to NGO / Field Crew</div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: report.workflow_step >= 2 ? '#10b981' : '#334155' }}></div>
                <div style={{ color: report.workflow_step >= 2 ? '#10b981' : '#64748b' }}>Work Proof Submitted</div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: report.workflow_step >= 3 ? '#10b981' : '#334155' }}></div>
                <div style={{ color: report.workflow_step >= 3 ? '#10b981' : '#64748b' }}>Issue Fully Resolved & Verified</div>
              </div>
            </div>

            {report.workflow_step >= 3 && (
              <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#064e3b', borderRadius: '8px', border: '1px solid #059669', textAlign: 'center', color: '#34d399' }}>
                <strong>Thank you!</strong> Your report helped make the city safer.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CitizenTrack;

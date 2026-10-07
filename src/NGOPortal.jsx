import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function NGOPortal() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'resolved')
      .eq('workflow_step', 1)
      .order('updated_at', { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  const submitWorkProof = async (id) => {
    const { error } = await supabase
      .from('reports')
      .update({ workflow_step: 2, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (!error) {
      alert("Work Proof Submitted Successfully! Sent to Admin for verification.");
      fetchTasks();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '20px', borderTop: '4px solid #0ea5e9' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#0ea5e9' }}>NGO Field Portal</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Active dispatch queue for ground crews.</p>
        </div>

        {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No pending tasks in your queue.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tasks.map(task => (
              <div key={task.id} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#334155', textTransform: 'uppercase' }}>{task.category.replace('_', ' ')}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {task.id.substring(0,6)}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>{task.description}</p>
                
                <div style={{ padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', margin: '0 0 10px 0' }}>Upload Proof of Work:</p>
                  <input type="file" style={{ fontSize: '12px', marginBottom: '10px' }} />
                </div>

                <button 
                  onClick={() => submitWorkProof(task.id)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Submit Proof to Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NGOPortal;

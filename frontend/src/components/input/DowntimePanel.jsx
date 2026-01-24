import React, { useState } from 'react';
import { Clock, AlertTriangle, Upload } from 'lucide-react';
import { dataService } from '../../services/api';

const DowntimePanel = ({ mode, downtimes, setDowntimes }) => {
    const [loading, setLoading] = useState(false);
    const [dtCount, setDtCount] = useState(1);

    const handleRandomDowntime = async () => {
        setLoading(true);
        try {
            const res = await dataService.generateDowntime(dtCount);
            // Append or replace? Usually explicit gen implies replace or append. 
            // In POC mode, maybe replace is cleaner, or append if user wants more.
            // Let's Append to existing for flexibility, or replace if empty.
            // Actually, for clear POC flow, let's Append.
            setDowntimes(prev => [...prev, ...res.data]);
        } catch (err) {
            alert("Error generating downtime: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await dataService.uploadDowntime(formData);
            setDowntimes(res.data);
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="industrial-card mt-4">
            <div className="flex-row justify-between mb-4">
                <h3>Machine Availability</h3>
                <span className="text-xs text-muted">{downtimes.length} Events</span>
            </div>

            {mode === 'poc' && (
                <div className="flex-col mb-4">
                    <div className="flex-row justify-between mb-2">
                        <label className="text-sm text-muted">Count:</label>
                        <input
                            type="number"
                            className="input-field"
                            style={{ width: '80px', padding: '0.25rem' }}
                            value={dtCount}
                            onChange={(e) => setDtCount(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <button
                        className="btn-secondary flex-row justify-center"
                        onClick={handleRandomDowntime}
                        disabled={loading}
                        style={{ borderColor: 'var(--status-warning)', color: 'var(--status-warning)' }}
                    >
                        <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} /> Generate Random Downtime
                    </button>
                </div>
            )}

            {mode === 'industry' && (
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                    />
                    <button className="btn-secondary w-full flex-row justify-center">
                        <Upload size={16} /> Upload Downtime CSV
                    </button>
                </div>
            )}

            <div className="flex-col">
                {downtimes.map((dt, idx) => (
                    <div key={idx} style={{
                        borderLeft: '3px solid var(--status-warning)',
                        padding: '0.5rem',
                        background: 'rgba(234, 179, 8, 0.1)',
                        fontSize: '0.8rem'
                    }}>
                        <div className="flex-row justify-between">
                            <span className="font-bold">{dt.machine_id}</span>
                            <span>{dt.start_time} - {dt.end_time}</span>
                        </div>
                        <div className="text-muted text-xs">{dt.reason}</div>
                    </div>
                ))}
                {downtimes.length === 0 && <p className="text-xs text-muted text-center">No downtime scheduled.</p>}
            </div>
        </div>
    );
};

export default DowntimePanel;

import React, { useState } from 'react';
import { Upload, Shuffle, FileText, CheckCircle } from 'lucide-react';
import { dataService } from '../../services/api';

const JobInputPanel = ({ mode, jobs, setJobs }) => {
    const [loading, setLoading] = useState(false);
    const [jobCount, setJobCount] = useState(20);
    const [rushProb, setRushProb] = useState(20); // Percentage

    const handleRandomGen = async () => {
        setLoading(true);
        try {
            const res = await dataService.generateRandomData(jobCount, rushProb / 100, 0);
            setJobs(res.data.jobs);
        } catch (err) {
            alert("Error generating data: " + err.message);
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
            const res = await dataService.uploadJobs(formData);
            setJobs(res.data);
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="industrial-card">
            <div className="flex-row justify-between mb-4">
                <h3>Job Intake</h3>
                <span className="text-xs text-muted">{jobs.length} Jobs Loaded</span>
            </div>

            <div className="flex-col">
                {mode === 'poc' && (
                    <div className="flex-col" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                        <div className="flex-row justify-between">
                            <label className="text-sm text-muted">Job Count:</label>
                            <input
                                type="number"
                                className="input-field"
                                style={{ width: '80px', padding: '0.25rem' }}
                                value={jobCount}
                                onChange={(e) => setJobCount(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="flex-row justify-between">
                            <label className="text-sm text-muted">Rush order (%):</label>
                            <input
                                type="number"
                                className="input-field"
                                style={{ width: '80px', padding: '0.25rem' }}
                                value={rushProb}
                                onChange={(e) => setRushProb(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <button className="btn-primary flex-row justify-center mt-2" onClick={handleRandomGen} disabled={loading}>
                            <Shuffle size={18} /> Generate Input Data
                        </button>
                    </div>
                )}

                {mode === 'industry' && (
                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                        <button className="btn-secondary w-full flex-row justify-center">
                            <Upload size={18} /> Upload CSV
                        </button>
                        <p className="text-xs text-muted mt-4 text-center">
                            Format: job_id, product, duration, deadline, priority, compatible_machines
                        </p>
                    </div>
                )}

                {/* Preview List */}
                {jobs.length > 0 && (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="industrial-card p-4">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead>
                                <tr className="text-muted" style={{ textAlign: 'left' }}>
                                    <th>Job ID</th>
                                    <th>Product</th>
                                    <th>Duration</th>
                                    <th>Deadline</th>
                                    <th>Priority</th>
                                    <th>Compatible Machines</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(j => (
                                    <tr key={j.job_id} style={{ borderTop: '1px solid #334155' }}>
                                        <td className="p-4">{j.job_id}</td>
                                        <td>{j.product_type}</td>
                                        <td>{j.processing_time}min</td>
                                        <td>{j.due_time || '-'}</td>
                                        <td style={{ color: j.priority === 'Rush' ? 'var(--status-error)' : 'inherit' }}>
                                            {j.priority}
                                        </td>
                                        <td className="text-xs">{j.machine_options.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobInputPanel;

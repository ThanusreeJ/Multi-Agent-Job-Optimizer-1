import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, AlertTriangle } from 'lucide-react';
import { dataService, optimizeService, simulationService } from '../services/api';

// Components (will be implemented)
import JobInputPanel from '../components/input/JobInputPanel';
import DowntimePanel from '../components/input/DowntimePanel';
import OptimizationPanel from '../components/control/OptimizationPanel';
import GanttChart from '../components/output/GanttChart';
import KPISummary from '../components/output/KPISummary';
import ExplanationPanel from '../components/output/ExplanationPanel';
import ComparisonTable from '../components/output/ComparisonTable';
import ConstraintReport from '../components/output/ConstraintReport';

import JobAllocationTable from '../components/output/JobAllocationTable';

const Dashboard = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('poc');
    const [jobs, setJobs] = useState([]);
    const [downtimes, setDowntimes] = useState([]);
    const [scheduleResult, setScheduleResult] = useState(null); // Single agent result
    const [comparisonResult, setComparisonResult] = useState(null); // Comparison result
    const [viewMode, setViewMode] = useState('single'); // 'single' or 'compare'
    const [loading, setLoading] = useState(false);
    const [activeAgent, setActiveAgent] = useState('baseline');

    useEffect(() => {
        const storedMode = localStorage.getItem('optimizer_mode');
        if (storedMode) setMode(storedMode);
    }, []);

    const handleSimulate = async () => {
        try {
            const payload = {
                jobs,
                downtimes,
                shift: { start_time: "08:00", end_time: "16:00" }
            };
            // Simulate on M1 for POC
            const res = await simulationService.simulateFailure(payload, 'M1');
            setDowntimes(res.data.downtimes);
            alert("Machine failure simulated on M1! Re-run optimization to see adaptation.");
        } catch (err) {
            alert("Simulation failed: " + err.message);
        }
    };

    const handleOptimization = async (agentType) => {
        setLoading(true);
        setActiveAgent(agentType);
        setViewMode('single');

        try {
            const payload = {
                jobs,
                downtimes,
                shift: { start_time: "08:00", end_time: "16:00" }
            };

            let res;
            switch (agentType) {
                case 'baseline': res = await optimizeService.runBaseline(payload); break;
                case 'batching': res = await optimizeService.runBatching(payload); break;
                case 'bottleneck': res = await optimizeService.runBottleneck(payload); break;
                case 'orchestrated': res = await optimizeService.runOrchestrated(payload); break;
                case 'compare':
                    res = await optimizeService.runComparison(payload);
                    setComparisonResult(res.data);
                    setViewMode('compare');
                    setLoading(false);
                    return;
            }
            setScheduleResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Optimization Failed: " + err.message);
        } finally {
            if (agentType !== 'compare') setLoading(false);
        }
    };

    const verifyData = () => {
        return jobs.length > 0;
    };

    return (
        <div className="flex-col" style={{ padding: '2rem', height: '100vh', overflow: 'hidden' }}>
            {/* Header */}
            <div className="flex-row justify-between" style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <div className="flex-row">
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h2>Production Optimizer <span className="text-muted text-sm">({mode.toUpperCase()} Mode)</span></h2>
                </div>
                <div className="flex-row">
                    {/* Global Actions */}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 100px)' }}>
                {/* Left Column: Inputs */}
                <div className="flex-col" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <JobInputPanel
                        mode={mode}
                        jobs={jobs}
                        setJobs={setJobs}
                    />
                    <DowntimePanel
                        mode={mode}
                        downtimes={downtimes}
                        setDowntimes={setDowntimes}
                    />
                </div>

                {/* Right Column: Control & Output */}
                <div className="flex-col" style={{ overflowY: 'auto' }}>
                    {/* Control Panel */}
                    <OptimizationPanel
                        onRun={handleOptimization}
                        onSimulate={handleSimulate}
                        loading={loading}
                        disabled={!verifyData()}
                        activeAgent={activeAgent}
                        viewMode={viewMode}
                    />

                    {/* Results Area */}
                    {loading ? (
                        <div className="industrial-card text-center p-4">
                            <h3>AI Agents Working...</h3>
                            <p className="text-muted">Analyzing constraints, batching sequences, and optimizing loads.</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'compare' && comparisonResult ? (
                                <ComparisonTable data={comparisonResult} onSelectAgent={(res) => {
                                    setScheduleResult(res);
                                    setViewMode('single'); // Switch to view details
                                }} />
                            ) : scheduleResult ? (
                                <div className="flex-col">
                                    <div className="grid-cols-4">
                                        <KPISummary kpis={scheduleResult.kpis} />
                                    </div>
                                    <GanttChart schedules={scheduleResult.schedules} downtimes={downtimes} />
                                    <JobAllocationTable schedules={scheduleResult.schedules} />
                                    <div className="grid-cols-2">
                                        <ExplanationPanel explanation={scheduleResult.explanation} />
                                        <ConstraintReport violations={scheduleResult.violations} />
                                    </div>
                                </div>
                            ) : (
                                <div className="industrial-card text-center p-4" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p className="text-muted">Load data and start optimization to see results.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

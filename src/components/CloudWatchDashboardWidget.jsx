import React, { useState, useEffect } from 'react';
import { cloudWatchService } from '../services/cloudWatchService';
import { Activity, ShieldCheck, Server, AlertCircle, RefreshCw, Database, Terminal } from 'lucide-react';

export const CloudWatchDashboardWidget = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMetrics = async () => {
    setLoading(true);
    const data = await cloudWatchService.getLiveMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  if (!metrics) return null;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2.5 rounded-2xl border border-amber-500/30 text-amber-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Amazon CloudWatch Metrics & Logs</h3>
            <p className="text-xs text-slate-400 font-mono">Namespace: FarmMitra/Marketplace • Region: us-east-1</p>
          </div>
        </div>

        <button
          onClick={refreshMetrics}
          className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh CloudWatch Telemetry</span>
        </button>
      </div>

      {/* CloudWatch Real-Time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
          <p className="text-2xl font-black text-white mt-1">{metrics.users?.total}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
            {metrics.users?.farmers} Farmers • {metrics.users?.buyers} Buyers
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Listings</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{metrics.listings?.active}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">DynamoDB Persistent</p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offers Placed / Accepted</p>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {metrics.offers?.total} / <span className="text-emerald-400">{metrics.offers?.accepted}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">{metrics.offers?.pending} Pending</p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Deals Created</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.deals?.total}</p>
          <p className="text-[10px] text-emerald-300 mt-1 font-bold">₹{metrics.deals?.totalAgreedValue?.toLocaleString()} Value</p>
        </div>
      </div>

      {/* CloudWatch Health Telemetry */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>CloudWatch Log Stream: {metrics.health?.cloudWatchLogGroup}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div>Status: <span className="text-emerald-400 font-bold">{metrics.health?.apiGatewayStatus}</span></div>
          <div>DynamoDB Latency: <span className="text-emerald-400 font-bold">{metrics.health?.dynamoDbReadLatency}</span></div>
          <div>Lambda Error Rate: <span className="text-emerald-400 font-bold">{metrics.health?.lambdaErrorRate}</span></div>
          <div>AWS Region: <span className="text-slate-300 font-bold">us-east-1</span></div>
        </div>
      </div>
    </div>
  );
};


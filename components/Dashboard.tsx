import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calendar, Database } from 'lucide-react';
import { VerificationStatus, Claim } from '../types';

interface DashboardProps {
  claims: Claim[];
}

const Dashboard: React.FC<DashboardProps> = ({ claims }) => {
  const [filterCity] = React.useState<string>('All');
  const [filterStatus] = React.useState<string>('All');

  // --- Filtering Logic ---
  const filteredClaims = claims.filter(claim => {
    const matchCity = filterCity === 'All' || (claim.city && claim.city.includes(filterCity));
    const matchStatus = filterStatus === 'All' || (claim.status && claim.status === filterStatus);
    return matchCity && matchStatus;
  });

  // --- Stats Calculation ---
  const total = filteredClaims.length;
  const verifiedCount = filteredClaims.filter(c => c.status === VerificationStatus.Verified).length;
  const falseCount = filteredClaims.filter(c => c.status === VerificationStatus.False).length;
  const misleadingCount = filteredClaims.filter(c => c.status === VerificationStatus.Misleading).length;
  const pendingCount = total - (verifiedCount + falseCount + misleadingCount);

  // --- Chart Data ---
  // Default empty data structure if no claims exist to keep boxes retained
  const pieData = total > 0 ? [
    { name: 'False', value: falseCount, color: '#ef4444' }, 
    { name: 'Verified', value: verifiedCount, color: '#10b981' },
    { name: 'Misleading', value: misleadingCount, color: '#f59e0b' },
  ].filter(d => d.value > 0) : [
    { name: 'System Idle', value: 1, color: '#1e293b' }
  ];

  // --- Hotspot Analysis (City Grouping) ---
  const normalizeCity = (city: string | undefined): string => {
      if (!city) return 'Unknown';
      const c = city.toString().toLowerCase().trim();
      
      // Handle variations of Cochin/Kochi
      if (c.includes('cochin') || c.includes('kochi') || c.includes('ernakulam')) return 'Cochin';
      
      // Handle variations of Mumbai
      if (c.includes('mumbai') || c.includes('bombay')) return 'Mumbai';
      
      // Handle variations of Coimbatore
      if (c.includes('coimbatore') || c.includes('kovai')) return 'Coimbatore';
      
      // Handle variations of Puducherry
      if (c.includes('puducherry') || c.includes('pondicherry')) return 'Puducherry';

      // Handle empty or unknown
      if (c === '' || c === 'n/a' || c === 'unknown' || c === 'nan') return 'Unknown';
      
      // Return capitalized for others
      return city.charAt(0).toUpperCase() + city.slice(1);
  };

  const cityGroups = filteredClaims.reduce((acc: Record<string, number>, curr: Claim) => {
      const city = normalizeCity(curr.city);
      acc[city] = (acc[city] || 0) + 1;
      return acc;
  }, {});

  let areaData = Object.keys(cityGroups)
    .map(city => ({ name: city, count: cityGroups[city] }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  if (areaData.length === 0) {
      areaData = [{ name: 'No Data', count: 0 }];
  }

  // --- Temporal Activity (Real Data) ---
  // Aggregate claims by date
  const timeDataMap = new Map<string, number>();
  
  // Create a sorted copy of claims to ensure the line chart flows correctly
  const sortedClaims = [...filteredClaims].sort((a, b) => a.timestamp - b.timestamp);

  sortedClaims.forEach(claim => {
      // Use DD MMM format (e.g. 15 Feb) which is compact for charts
      const date = new Date(claim.timestamp);
      // Ensure date is valid before processing
      if (!isNaN(date.getTime())) {
        const dateKey = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        timeDataMap.set(dateKey, (timeDataMap.get(dateKey) || 0) + 1);
      }
  });

  // Convert map to array for Recharts
  let timeData = Array.from(timeDataMap.entries()).map(([name, claims]) => ({ name, claims }));

  // If no data, provide a placeholder or empty state
  if (timeData.length === 0) {
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      timeData = [{ name: today, claims: 0 }];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-xl">
          <p className="text-slate-800 dark:text-slate-300 font-bold mb-1">{label}</p>
          <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">
            {payload[0].value} Records
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-cyan-500/30 pb-4">
         <h2 className="text-2xl font-black text-slate-900 dark:text-white font-orbitron tracking-widest uppercase border-l-4 border-cyan-500 pl-4 flex items-center gap-3">
             <Database className="h-6 w-6 text-cyan-500" />
             System Dashboard
         </h2>
         <div className="flex items-center gap-4 mt-4 md:mt-0">
             <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                 <div className={`h-2 w-2 rounded-full ${total > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                 <span className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {total > 0 ? 'LIVE DATABASE ACTIVE' : 'AWAITING DATA STREAM'}
                 </span>
             </div>
         </div>
      </div>

      {/* Top Level Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-sm">
          <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="h-12 w-12 text-cyan-600 dark:text-cyan-400" />
          </div>
          <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">Total Records</dt>
          <dd className="mt-2 text-4xl font-black text-slate-900 dark:text-white font-orbitron">{total}</dd>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-emerald-500 shadow-sm">
          <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">Verified Facts</dt>
          <dd className="mt-2 text-4xl font-black text-emerald-600 dark:text-emerald-500 font-orbitron">{verifiedCount}</dd>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 border-l-4 border-l-red-500 shadow-sm">
          <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">False Info</dt>
          <dd className="mt-2 text-4xl font-black text-red-600 dark:text-red-500 font-orbitron">{falseCount}</dd>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 relative shadow-sm">
          <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">Pending Review</dt>
          <dd className="mt-2 text-4xl font-black text-amber-600 dark:text-amber-500 font-orbitron">{pendingCount}</dd>
          {pendingCount > 0 && <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
        </div>
      </div>

      {/* Charts Section 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 lg:col-span-2 shadow-sm">
          <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-6 font-orbitron">Temporal Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22d3ee', strokeWidth: 1 }} />
                <Line 
                    type="monotone" 
                    dataKey="claims" 
                    stroke="#22d3ee" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#0f172a', stroke: '#22d3ee', strokeWidth: 2 }} 
                    activeDot={{ r: 6, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-6 font-orbitron">Verdict Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="rect"
                    formatter={(value) => <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Charts Section 2 */}
       <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
          <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase mb-6 font-orbitron">Hotspot Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]}>
                    {areaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#22d3ee', '#3b82f6', '#818cf8', '#a78bfa'][index % 4]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;
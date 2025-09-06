import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface IndexChartProps {
  results: {
    HPI: number;
    HEI: number;
    HMPI: number;
    HCI: number;
    Cd: number;
    PI: number;
    PLI: number;
  };
}

export const IndexChart: React.FC<IndexChartProps> = ({ results }) => {
  const barData = [
    { name: 'HPI', value: results.HPI, threshold: 100 },
    { name: 'HEI', value: results.HEI, threshold: 40 },
    { name: 'HMPI', value: results.HMPI, threshold: 100 },
    { name: 'HCI', value: results.HCI, threshold: 10 },
    { name: 'PLI', value: results.PLI, threshold: 5 },
  ];

  const pieData = [
    { name: 'Heavy Pollution Index (HPI)', value: results.HPI, color: '#8884d8' },
    { name: 'Heavy Metal Evaluation Index (HEI)', value: results.HEI, color: '#82ca9d' },
    { name: 'Heavy Metal Pollution Index (HMPI)', value: results.HMPI, color: '#ffc658' },
    { name: 'Pollution Load Index (PLI)', value: results.PLI * 20, color: '#ff7300' }, // Scaled for visualization
  ];

  const getBarColor = (value: number, threshold: number) => {
    if (value < threshold * 0.25) return '#10b981'; // Green - Good
    if (value < threshold * 0.5) return '#f59e0b';  // Yellow - Acceptable
    if (value < threshold) return '#ef4444';        // Red - Poor
    return '#dc2626';                               // Dark Red - Critical
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value.toFixed(2)}`}</p>
          <p className="text-sm text-muted-foreground">
            Threshold: {data.threshold}
          </p>
          <p className="text-sm">
            Status: {payload[0].value < data.threshold * 0.25 ? 'Good' :
                    payload[0].value < data.threshold * 0.5 ? 'Acceptable' :
                    payload[0].value < data.threshold ? 'Poor' : 'Critical'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Pollution Indices Comparison
          </CardTitle>
          <CardDescription>
            Visual comparison of calculated pollution indices against threshold values
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.value, entry.threshold)} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Index Distribution</CardTitle>
          <CardDescription>
            Relative contribution of each pollution index
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${percent.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
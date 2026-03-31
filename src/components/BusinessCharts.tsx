import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/supabase";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { format, parseISO, startOfDay } from "date-fns";

interface Props {
  transactions: Transaction[];
}

export const BusinessCharts = ({ transactions }: Props) => {
  // Group transactions by date
  const dataMap = transactions.reduce((acc: any, t) => {
    const date = format(parseISO(t.created_at), "MMM dd");
    if (!acc[date]) {
      acc[date] = { name: date, sales: 0, expenses: 0 };
    }
    if (t.type === 'sale') acc[date].sales += t.total;
    else acc[date].expenses += t.total;
    return acc;
  }, {});

  const data = Object.values(dataMap).reverse().slice(-7); // Last 7 days with data

  return (
    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => `₦${value >= 1000 ? (value / 1000) + 'k' : value}`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="sales" name="Sales" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, FileDown, Filter, Search } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  businessName?: string;
}

export const TransactionTable = ({ transactions, onDelete, businessName }: Props) => {
  const [filter, setFilter] = useState<'all' | 'sale' | 'expense'>('all');
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.item.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text("KudiLedger Business Report", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Business: ${businessName || "My Business"}`, 14, 30);
    doc.text(`Date Generated: ${date}`, 14, 37);
    
    const tableData = filteredTransactions.map(t => [
      new Date(t.created_at).toLocaleDateString(),
      t.item,
      t.qty,
      `${t.currency} ${t.total.toLocaleString()}`,
      t.type.toUpperCase()
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Item', 'Qty', 'Total', 'Type']],
      body: tableData,
      startY: 45,
      headStyles: { fillColor: [22, 163, 74] },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    doc.save(`kudiledger-report-${date}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Button variant="outline" onClick={exportPDF} className="flex items-center gap-2 bg-white">
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'sale', 'expense'] as const).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
            className={`capitalize rounded-full px-6 ${
              filter === type && type === 'sale' ? 'bg-green-600 hover:bg-green-700' : 
              filter === type && type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {type}
          </Button>
        ))}
      </div>
      
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-bold">Item</TableHead>
              <TableHead className="font-bold">Qty</TableHead>
              <TableHead className="font-bold">Total</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="h-8 w-8 opacity-20" />
                    <p>No transactions found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div>
                      <p className="text-gray-900">{t.item}</p>
                      <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>{t.qty}</TableCell>
                  <TableCell className={t.type === 'sale' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    ₦{t.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(t.id)} 
                      className="text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
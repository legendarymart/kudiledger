import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, FileDown, Search, Edit2, ReceiptText, Plus } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { EditTransactionDialog } from "./EditTransactionDialog";

// ✅ FIXED: Lowercase "jspdf" is the correct package name for Vercel/Linux
import jsPDF from "jspdf";
import "jspdf-autotable";

// Standardize the autoTable type for TypeScript
import { UserOptions } from "jspdf-autotable";

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (updated: Transaction) => void;
  onAddManual?: () => void;
  businessName?: string;
}

export const TransactionTable = ({ transactions, onDelete, onUpdate, onAddManual, businessName }: Props) => {
  const [filter, setFilter] = useState<'all' | 'sale' | 'expense'>('all');
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.item.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportFullReport = () => {
    const doc = new jsPDF() as jsPDFWithPlugin;
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74);
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

    doc.autoTable({
      head: [['Date', 'Item', 'Qty', 'Total', 'Type']],
      body: tableData,
      startY: 45,
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save(`report-${date}.pdf`);
  };

  const generateReceipt = (t: Transaction) => {
    const doc = new jsPDF({
      unit: "mm",
      format: [80, 150]
    });

    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text(businessName || "KudiLedger Business", 40, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("SALES RECEIPT", 40, 22, { align: "center" });
    doc.line(5, 25, 75, 25);

    doc.setTextColor(0);
    doc.text(`Date: ${new Date(t.created_at).toLocaleDateString()}`, 5, 32);
    doc.text(`Receipt #: ${t.id.slice(0, 8).toUpperCase()}`, 5, 37);

    doc.setFontSize(12);
    doc.text("Item Details:", 5, 47);
    doc.setFontSize(10);
    doc.text(`${t.item} x ${t.qty}`, 5, 54);
    
    doc.line(5, 60, 75, 60);
    doc.setFontSize(14);
    doc.text(`TOTAL: ₦${t.total.toLocaleString()}`, 40, 70, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 40, 85, { align: "center" });
    doc.text("Powered by KudiLedger", 40, 90, { align: "center" });

    doc.save(`receipt-${t.id.slice(0, 8)}.pdf`);
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
              className="pl-9 bg-white rounded-xl"
            />
          </div>
          <Button variant="outline" onClick={exportFullReport} className="flex items-center gap-2 bg-white rounded-xl">
            <FileDown className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={onAddManual} className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New
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
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium py-4">
                    <div>
                      <p className="text-gray-900">{t.item}</p>
                      <p className="text-[10px] text-gray-400">{new Date(t.created_at).toLocaleString()}</p>
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
                    <div className="flex justify-end gap-1">
                      {t.type === 'sale' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => generateReceipt(t)} 
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Download Receipt"
                        >
                          <ReceiptText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingTransaction(t)} 
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-full"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(t.id)} 
                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditTransactionDialog 
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
};
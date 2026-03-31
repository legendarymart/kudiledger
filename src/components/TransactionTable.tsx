import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, FileDown } from "lucide-react";
import { Transaction } from "@/lib/supabase";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionTable = ({ transactions, onDelete }: Props) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("KudiLedger - Business Report", 14, 15);
    
    const tableData = transactions.map(t => [
      new Date(t.created_at).toLocaleDateString(),
      t.item,
      t.qty,
      `${t.currency} ${t.total.toLocaleString()}`,
      t.type.toUpperCase()
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Item', 'Qty', 'Total', 'Type']],
      body: tableData,
      startY: 25,
    });

    doc.save("kudiledger-report.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        <Button variant="outline" size="sm" onClick={exportPDF} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" /> Export PDF
        </Button>
      </div>
      
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No transactions recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.item}</TableCell>
                  <TableCell>{t.qty}</TableCell>
                  <TableCell className={t.type === 'sale' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    ₦{t.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} className="text-red-400 hover:text-red-600">
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction, supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updated: Transaction) => void;
}

export const EditTransactionDialog = ({ transaction, open, onOpenChange, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  // Sync state when the transaction prop changes or dialog opens
  useEffect(() => {
    if (transaction && open) {
      setFormData(transaction);
    }
  }, [transaction, open]);

  const handleSave = async () => {
    if (!transaction) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          item: formData.item,
          qty: formData.qty,
          total: formData.total,
          type: formData.type
        })
        .eq('id', transaction.id)
        .select()
        .single();
      
      if (error) throw error;
      onUpdate(data);
      showSuccess("Transaction updated!");
      onOpenChange(false);
    } catch (err) {
      showError("Failed to update transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input 
              value={formData.item || ""} 
              onChange={(e) => setFormData({...formData, item: e.target.value})}
              className="rounded-xl"
              placeholder="e.g. Bag of Rice"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                type="number"
                value={formData.qty || 0} 
                onChange={(e) => setFormData({...formData, qty: Number(e.target.value)})}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Amount (₦)</Label>
              <Input 
                type="number"
                value={formData.total || 0} 
                onChange={(e) => setFormData({...formData, total: Number(e.target.value)})}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'sale' | 'expense') => setFormData({...formData, type: value})}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 rounded-xl h-12">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
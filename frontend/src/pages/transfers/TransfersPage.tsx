import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAccounts } from '../../hooks/useAccounts';
import { transfersService } from '../../services/transfers';
import { Plus, ArrowRightLeft, Loader2 } from 'lucide-react';
import type { Transfer } from '../../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

export function TransfersPage() {
  const { accounts, fetchAccounts } = useAccounts();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transfersService.getAll();
      setTransfers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transferências');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const resetForm = () => {
    setFormData({
      fromAccountId: '',
      toAccountId: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.fromAccountId || !formData.toAccountId || !formData.amount || !formData.date) {
      setFormError('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.fromAccountId === formData.toAccountId) {
      setFormError('As contas de origem e destino devem ser diferentes');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setFormError('O valor deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);
    try {
      await transfersService.create({
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        amount,
        description: formData.description || undefined,
        date: formData.date,
      });
      setIsCreateOpen(false);
      resetForm();
      fetchTransfers();
      fetchAccounts();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar transferência');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Header title="Transferências" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Transfira valores entre suas contas</p>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transferência
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transferência</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label>Conta de Origem</Label>
                  <Select value={formData.fromAccountId} onValueChange={(v) => setFormData({ ...formData, fromAccountId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({formatCurrency(Number(acc.currentBalance))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Conta de Destino</Label>
                  <Select value={formData.toAccountId} onValueChange={(v) => setFormData({ ...formData, toAccountId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.filter((acc) => acc.id !== formData.fromAccountId).map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({formatCurrency(Number(acc.currentBalance))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Transferência para poupança"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Transferir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : transfers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ArrowRightLeft className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">Nenhuma transferência realizada</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Fazer primeira transferência
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => {
              const fromAccount = accounts.find((a) => a.id === transfer.fromAccountId);
              const toAccount = accounts.find((a) => a.id === transfer.toAccountId);
              return (
                <Card key={transfer.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {fromAccount?.name || 'Conta'} → {toAccount?.name || 'Conta'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(transfer.date)}
                          {transfer.description && ` • ${transfer.description}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {formatCurrency(Number(transfer.amount))}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

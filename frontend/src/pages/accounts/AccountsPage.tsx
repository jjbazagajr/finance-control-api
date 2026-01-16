import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAccounts } from '../../hooks/useAccounts';
import { Plus, Pencil, Trash2, Wallet, Building2, CreditCard, Loader2 } from 'lucide-react';
import type { Account, AccountType } from '../../types';

const accountTypeLabels: Record<AccountType, string> = {
  CASH: 'Carteira',
  BANK: 'Banco',
  CREDIT: 'Cartão de Crédito',
};

const accountTypeIcons: Record<AccountType, typeof Wallet> = {
  CASH: Wallet,
  BANK: Building2,
  CREDIT: CreditCard,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function AccountsPage() {
  const { accounts, isLoading, error, createAccount, updateAccount, deleteAccount } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'BANK' as AccountType,
    initialBalance: '',
  });

  const resetForm = () => {
    setFormData({ name: '', type: 'BANK', initialBalance: '' });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAccount({
        name: formData.name,
        type: formData.type,
        initialBalance: parseFloat(formData.initialBalance) || 0,
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingAccount || !formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAccount(editingAccount.id, {
        name: formData.name,
        type: formData.type,
      });
      setEditingAccount(null);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao atualizar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    try {
      await deleteAccount(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir conta');
    }
  };

  const openEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      initialBalance: String(account.initialBalance),
    });
    setEditingAccount(account);
  };

  return (
    <div className="flex flex-col">
      <Header title="Contas" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Gerencie suas contas bancárias, carteiras e cartões</p>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Conta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Nubank, Carteira"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as AccountType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Carteira</SelectItem>
                      <SelectItem value="BANK">Banco</SelectItem>
                      <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Saldo Inicial</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar
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
        ) : accounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">Nenhuma conta cadastrada</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira conta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => {
              const Icon = accountTypeIcons[account.type];
              return (
                <Card key={account.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {account.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(Number(account.currentBalance))}</div>
                    <p className="text-xs text-slate-500">{accountTypeLabels[account.type]}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!editingAccount} onOpenChange={(open) => { if (!open) { setEditingAccount(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Conta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as AccountType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Carteira</SelectItem>
                    <SelectItem value="BANK">Banco</SelectItem>
                    <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAccount(null)}>Cancelar</Button>
              <Button onClick={handleUpdate} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

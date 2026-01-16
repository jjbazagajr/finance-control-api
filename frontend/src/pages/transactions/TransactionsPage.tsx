import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Pencil, Trash2, ArrowLeftRight, TrendingUp, TrendingDown, Loader2, Filter } from 'lucide-react';
import type { Transaction, TransactionType } from '../../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

export function TransactionsPage() {
  const { transactions, filters, isLoading, error, createTransaction, updateTransaction, deleteTransaction, updateFilters } = useTransactions();
  const { accounts } = useAccounts();
  const { categories, incomeCategories, expenseCategories } = useCategories();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accountId: '',
    categoryId: '',
    type: 'EXPENSE' as TransactionType,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
    accountId: '',
    categoryId: '',
    type: '' as TransactionType | '',
  });

  const resetForm = () => {
    setFormData({
      accountId: '',
      categoryId: '',
      type: 'EXPENSE',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.accountId || !formData.categoryId || !formData.amount || !formData.date) {
      setFormError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        date: formData.date,
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar lançamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    setIsSubmitting(true);
    try {
      await updateTransaction(editingTransaction.id, {
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        date: formData.date,
      });
      setEditingTransaction(null);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao atualizar lançamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;
    try {
      await deleteTransaction(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir lançamento');
    }
  };

  const openEdit = (transaction: Transaction) => {
    setFormData({
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      amount: String(transaction.amount),
      description: transaction.description || '',
      date: transaction.date.split('T')[0],
    });
    setEditingTransaction(transaction);
  };

  const applyFilters = () => {
    updateFilters({
      startDate: filterData.startDate || undefined,
      endDate: filterData.endDate || undefined,
      accountId: filterData.accountId || undefined,
      categoryId: filterData.categoryId || undefined,
      type: filterData.type || undefined,
    });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterData({ startDate: '', endDate: '', accountId: '', categoryId: '', type: '' });
    updateFilters({});
    setIsFilterOpen(false);
  };

  const availableCategories = formData.type === 'INCOME' ? incomeCategories : expenseCategories;
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col">
      <Header title="Lançamentos" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Registre suas receitas e despesas</p>
          <div className="flex gap-2">
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant={hasActiveFilters ? 'default' : 'outline'}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros {hasActiveFilters && '(ativos)'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtrar Lançamentos</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Inicial</Label>
                      <Input
                        type="date"
                        value={filterData.startDate}
                        onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Final</Label>
                      <Input
                        type="date"
                        value={filterData.endDate}
                        onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Conta</Label>
                    <Select value={filterData.accountId} onValueChange={(v) => setFilterData({ ...filterData, accountId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as contas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as contas</SelectItem>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={filterData.categoryId} onValueChange={(v) => setFilterData({ ...filterData, categoryId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={filterData.type} onValueChange={(v) => setFilterData({ ...filterData, type: v as TransactionType | '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os tipos</SelectItem>
                        <SelectItem value="INCOME">Receita</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={clearFilters}>Limpar</Button>
                  <Button onClick={applyFilters}>Aplicar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Lançamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Lançamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as TransactionType, categoryId: '' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Receita</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Conta</Label>
                    <Select value={formData.accountId} onValueChange={(v) => setFormData({ ...formData, accountId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                      placeholder="Ex: Almoço no restaurante"
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
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ArrowLeftRight className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">Nenhum lançamento encontrado</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro lançamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const account = accounts.find((a) => a.id === transaction.accountId);
              const category = categories.find((c) => c.id === transaction.categoryId);
              return (
                <Card key={transaction.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      {transaction.type === 'INCOME' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                          <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{category?.name || 'Categoria'}</p>
                        <p className="text-sm text-slate-500">
                          {account?.name} • {formatDate(transaction.date)}
                          {transaction.description && ` • ${transaction.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-semibold ${transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(Number(transaction.amount))}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(transaction)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!editingTransaction} onOpenChange={(open) => { if (!open) { setEditingTransaction(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Lançamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as TransactionType, categoryId: '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Conta</Label>
                <Select value={formData.accountId} onValueChange={(v) => setFormData({ ...formData, accountId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                <Label>Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTransaction(null)}>Cancelar</Button>
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

import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { useBudgets } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Pencil, Trash2, PiggyBank, Loader2 } from 'lucide-react';
import type { Budget } from '../../types';

const months = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function BudgetsPage() {
  const { budgets, isLoading, error, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { expenseCategories } = useCategories();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i + 2);

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: String(currentMonth),
    year: String(currentYear),
  });

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      month: String(currentMonth),
      year: String(currentYear),
    });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.categoryId || !formData.amount) {
      setFormError('Preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setFormError('O valor deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBudget({
        categoryId: formData.categoryId,
        amount,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar orçamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingBudget || !formData.amount) {
      setFormError('Valor é obrigatório');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setFormError('O valor deve ser maior que zero');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBudget(editingBudget.id, { amount });
      setEditingBudget(null);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao atualizar orçamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;
    try {
      await deleteBudget(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir orçamento');
    }
  };

  const openEdit = (budget: Budget) => {
    setFormData({
      categoryId: budget.categoryId,
      amount: String(budget.amount),
      month: String(budget.month),
      year: String(budget.year),
    });
    setEditingBudget(budget);
  };

  const getMonthName = (month: number) => months.find((m) => m.value === String(month))?.label || '';

  return (
    <div className="flex flex-col">
      <Header title="Orçamentos" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Defina limites de gastos por categoria</p>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Orçamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Limite</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mês</Label>
                    <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
        ) : budgets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <PiggyBank className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">Nenhum orçamento definido</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeiro orçamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const category = expenseCategories.find((c) => c.id === budget.categoryId);
              const spent = budget.spent || 0;
              const percentage = Math.min((spent / Number(budget.amount)) * 100, 100);
              const isOverBudget = spent > Number(budget.amount);

              return (
                <Card key={budget.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {category?.name || 'Categoria'}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(budget)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : ''}`}>
                        {formatCurrency(spent)}
                      </span>
                      <span className="text-sm text-slate-500">
                        de {formatCurrency(Number(budget.amount))}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={isOverBudget ? '[&>div]:bg-red-500' : ''}
                    />
                    <p className="text-xs text-slate-500">
                      {getMonthName(budget.month)} {budget.year}
                      {isOverBudget && (
                        <span className="ml-2 text-red-500">
                          (Excedido em {formatCurrency(spent - Number(budget.amount))})
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!editingBudget} onOpenChange={(open) => { if (!open) { setEditingBudget(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Orçamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Valor Limite</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingBudget(null)}>Cancelar</Button>
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

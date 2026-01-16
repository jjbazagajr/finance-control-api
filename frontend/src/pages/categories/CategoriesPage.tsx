import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Pencil, Trash2, Tags, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import type { Category, CategoryType } from '../../types';

export function CategoriesPage() {
  const { categories, incomeCategories, expenseCategories, isLoading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as CategoryType,
  });

  const resetForm = () => {
    setFormData({ name: '', type: 'EXPENSE' });
    setFormError('');
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCategory({
        name: formData.name,
        type: formData.type,
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateCategory(editingCategory.id, {
        name: formData.name,
        type: formData.type,
      });
      setEditingCategory(null);
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await deleteCategory(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir categoria');
    }
  };

  const openEdit = (category: Category) => {
    setFormData({
      name: category.name,
      type: category.type,
    });
    setEditingCategory(category);
  };

  const CategoryList = ({ items }: { items: Category[] }) => (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <Card key={category.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {category.type === 'INCOME' ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      <Header title="Categorias" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">Organize suas receitas e despesas por categorias</p>
          <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
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
                    placeholder="Ex: Alimentação, Salário"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as CategoryType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Receita</SelectItem>
                      <SelectItem value="EXPENSE">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
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
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tags className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">Nenhuma categoria cadastrada</p>
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="expense">
            <TabsList>
              <TabsTrigger value="expense" className="gap-2">
                <TrendingDown className="h-4 w-4" />
                Despesas ({expenseCategories.length})
              </TabsTrigger>
              <TabsTrigger value="income" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Receitas ({incomeCategories.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="expense" className="mt-4">
              {expenseCategories.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhuma categoria de despesa</p>
              ) : (
                <CategoryList items={expenseCategories} />
              )}
            </TabsContent>
            <TabsContent value="income" className="mt-4">
              {incomeCategories.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Nenhuma categoria de receita</p>
              ) : (
                <CategoryList items={incomeCategories} />
              )}
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={!!editingCategory} onOpenChange={(open) => { if (!open) { setEditingCategory(null); resetForm(); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
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
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as CategoryType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancelar</Button>
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

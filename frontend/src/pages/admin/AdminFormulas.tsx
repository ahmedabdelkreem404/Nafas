import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import {
  AdminPageShell,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  LoadingState,
  Select,
  Textarea,
} from '../../components/ui';
import { formatCurrency } from '../../utils/format';

type FormulaItemForm = {
  cost_per_gram: string;
  ifra_status: string;
  ingredient_id: string;
  ingredient_name: string;
  internal_notes: string;
  percentage: string;
  quantity_grams: string;
  quantity_ml: string;
  sds_status: string;
  supplier_reference: string;
};

const blankFormula = {
  alcohol_percentage: 76,
  ifra_status: '',
  internal_notes: '',
  oil_percentage: 24,
  product_id: '',
  sds_status: '',
  supplier_batch_reference: '',
  supplier_name: '',
  supplier_reference: '',
};

const blankItem: FormulaItemForm = {
  cost_per_gram: '',
  ifra_status: '',
  ingredient_id: '',
  ingredient_name: '',
  internal_notes: '',
  percentage: '',
  quantity_grams: '',
  quantity_ml: '',
  sds_status: '',
  supplier_reference: '',
};

function emptyToNull(value: unknown) {
  return value === '' ? null : value;
}

function normalizeFormulaPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, emptyToNull(value)]),
  );
}

function normalizeFormulaItemPayload(form: FormulaItemForm, ingredients: any[]) {
  const selectedIngredient = ingredients.find((ingredient) => String(ingredient.id) === String(form.ingredient_id));
  const ingredientName = form.ingredient_name.trim() || selectedIngredient?.name || '';

  return {
    cost_per_gram: emptyToNull(form.cost_per_gram),
    ifra_status: emptyToNull(form.ifra_status),
    ingredient_id: emptyToNull(form.ingredient_id),
    ingredient_name: ingredientName,
    internal_notes: emptyToNull(form.internal_notes),
    percentage: emptyToNull(form.percentage),
    quantity_grams: emptyToNull(form.quantity_grams),
    quantity_ml: emptyToNull(form.quantity_ml),
    sds_status: emptyToNull(form.sds_status),
    supplier_reference: emptyToNull(form.supplier_reference),
  };
}

function getApiErrorMessage(error: any) {
  const errors = error?.response?.data?.errors;
  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().join(' ');
  }

  return error?.response?.data?.message || error?.message || 'تعذر تنفيذ العملية. راجع البيانات وحاول مرة أخرى.';
}

const AdminFormulas: React.FC = () => {
  const [formulas, setFormulas] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [formulaForm, setFormulaForm] = useState<any>(blankFormula);
  const [itemForms, setItemForms] = useState<Record<number, FormulaItemForm>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingFormula, setSavingFormula] = useState(false);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError('');

    Promise.all([adminApi.formulas.list(), adminApi.products.list(), adminApi.ingredients.list()])
      .then(([formulasRes, productsRes, ingredientsRes]) => {
        setFormulas(formulasRes.data || []);
        setProducts(productsRes.data || []);
        setIngredients(ingredientsRes.data || []);
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const formulaTotals = useMemo(() => Object.fromEntries(formulas.map((formula) => {
    const total = (formula.items || []).reduce(
      (sum: number, item: any) => sum + (Number(item.quantity_grams || 0) * Number(item.cost_per_gram || 0)),
      0,
    );

    return [formula.id, total];
  })), [formulas]);

  const updateItemForm = (formulaId: number, patch: Partial<FormulaItemForm>) => {
    setItemForms((current) => ({
      ...current,
      [formulaId]: {
        ...(current[formulaId] || blankItem),
        ...patch,
      },
    }));
  };

  const createFormula = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSavingFormula(true);

    try {
      await adminApi.formulas.create(normalizeFormulaPayload(formulaForm));
      setFormulaForm(blankFormula);
      load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSavingFormula(false);
    }
  };

  const createFormulaItem = async (event: React.FormEvent<HTMLFormElement>, formulaId: number) => {
    event.preventDefault();
    setError('');

    const form = itemForms[formulaId] || blankItem;
    const payload = normalizeFormulaItemPayload(form, ingredients);

    if (!payload.ingredient_name) {
      setError('اختار مكوّن من القائمة أو اكتب اسم المكوّن قبل الإضافة.');
      return;
    }

    setSavingItemId(formulaId);

    try {
      await adminApi.formulas.createItem(formulaId, payload);
      setItemForms((current) => ({ ...current, [formulaId]: blankItem }));
      load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSavingItemId(null);
    }
  };

  return (
    <AdminPageShell
      eyebrow="التركيبات"
      title="التركيبات والامتثال"
      description="إدارة التركيبات الداخلية، المكوّنات، التكلفة، ومراجع الامتثال داخل لوحة التحكم فقط."
    >
      {error ? (
        <div className="admin-error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <Card tone="strong">
        <form className="stack" onSubmit={createFormula}>
          <div className="grid-auto">
            <Field label="المنتج">
              <Select
                value={formulaForm.product_id}
                onChange={(event) => setFormulaForm({ ...formulaForm, product_id: event.target.value })}
              >
                <option value="">اختر المنتج</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name_ar || product.name_en || product.code}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="نسبة الزيت">
              <Input
                type="number"
                value={formulaForm.oil_percentage}
                onChange={(event) => setFormulaForm({ ...formulaForm, oil_percentage: Number(event.target.value) })}
              />
            </Field>
            <Field label="نسبة الكحول">
              <Input
                type="number"
                value={formulaForm.alcohol_percentage}
                onChange={(event) => setFormulaForm({ ...formulaForm, alcohol_percentage: Number(event.target.value) })}
              />
            </Field>
            <Field label="حالة IFRA">
              <Input value={formulaForm.ifra_status} onChange={(event) => setFormulaForm({ ...formulaForm, ifra_status: event.target.value })} />
            </Field>
            <Field label="حالة SDS">
              <Input value={formulaForm.sds_status} onChange={(event) => setFormulaForm({ ...formulaForm, sds_status: event.target.value })} />
            </Field>
            <Field label="المورد">
              <Input value={formulaForm.supplier_name} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_name: event.target.value })} />
            </Field>
            <Field label="مرجع المورد">
              <Input value={formulaForm.supplier_reference} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_reference: event.target.value })} />
            </Field>
            <Field label="دفعة المورد">
              <Input value={formulaForm.supplier_batch_reference} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_batch_reference: event.target.value })} />
            </Field>
          </div>
          <Field label="ملاحظات داخلية">
            <Textarea value={formulaForm.internal_notes} onChange={(event) => setFormulaForm({ ...formulaForm, internal_notes: event.target.value })} />
          </Field>
          <Button type="submit" disabled={savingFormula}>
            {savingFormula ? 'جاري إضافة التركيبة...' : 'إضافة تركيبة'}
          </Button>
        </form>
      </Card>

      {loading ? (
        <LoadingState label="جاري تحميل التركيبات..." />
      ) : !formulas.length ? (
        <EmptyState title="لا توجد تركيبات" description="أضف أول تركيبة داخلية لهذا المنتج." />
      ) : (
        <div className="stack">
          {formulas.map((formula) => {
            const itemForm = itemForms[formula.id] || blankItem;

            return (
              <Card key={formula.id} tone="strong" className="stack">
                <div className="data-card__row">
                  <strong>{formula.product?.name_ar || formula.product?.name_en || 'تركيبة بدون اسم'}</strong>
                  <span className="copy-muted">{formula.ifra_status || 'بانتظار مراجعة الامتثال'}</span>
                </div>

                <Textarea
                  value={formula.internal_notes || ''}
                  onChange={(event) => setFormulas((current) => current.map((entry) => (
                    entry.id === formula.id ? { ...entry, internal_notes: event.target.value } : entry
                  )))}
                />

                <div className="admin-inline-actions">
                  <Button
                    onClick={() => adminApi.formulas.update(formula.id, {
                      ifra_status: formula.ifra_status,
                      internal_notes: formula.internal_notes,
                      sds_status: formula.sds_status,
                    }).then(load).catch((requestError) => setError(getApiErrorMessage(requestError)))}
                  >
                    حفظ التركيبة
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => adminApi.formulas.delete(formula.id).then(load).catch((requestError) => setError(getApiErrorMessage(requestError)))}
                  >
                    حذف التركيبة
                  </Button>
                </div>

                <div className="soft-divider" />
                <strong>العناصر</strong>

                {(formula.items || []).map((item: any) => (
                  <div key={item.id} className="data-card">
                    <div className="data-card__row">
                      <strong>{item.ingredient_name || item.ingredient?.name}</strong>
                      <span className="copy-muted">{item.percentage || item.quantity_ml || item.quantity_grams}</span>
                    </div>
                    <div className="copy-muted">{item.internal_notes}</div>
                    <div className="data-card__row">
                      <span>تكلفة العنصر</span>
                      <strong>{formatCurrency(Number(item.quantity_grams || 0) * Number(item.cost_per_gram || 0))}</strong>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => adminApi.formulas.deleteItem(item.id).then(load).catch((requestError) => setError(getApiErrorMessage(requestError)))}
                    >
                      حذف العنصر
                    </Button>
                  </div>
                ))}

                <div className="summary-card">
                  <div className="price-line">
                    <span>تكلفة التركيبة الكاملة</span>
                    <strong>{formatCurrency(formulaTotals[formula.id] || 0)}</strong>
                  </div>
                  <small className="copy-muted">لكل 100 مل تقريبًا</small>
                </div>

                <form className="stack" onSubmit={(event) => createFormulaItem(event, formula.id)}>
                  <div className="grid-auto">
                    <Field label="المكوّن">
                      <Select
                        value={itemForm.ingredient_id}
                        onChange={(event) => {
                          const selectedIngredient = ingredients.find((ingredient) => String(ingredient.id) === event.target.value);
                          updateItemForm(formula.id, {
                            ingredient_id: event.target.value,
                            ingredient_name: selectedIngredient?.name || itemForm.ingredient_name,
                          });
                        }}
                      >
                        <option value="">اختر مكوّنًا</option>
                        {ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="اسم المكوّن">
                      <Input value={itemForm.ingredient_name} onChange={(event) => updateItemForm(formula.id, { ingredient_name: event.target.value })} />
                    </Field>
                    <Field label="الكمية بالجرام">
                      <Input type="number" min="0" step="0.01" value={itemForm.quantity_grams} onChange={(event) => updateItemForm(formula.id, { quantity_grams: event.target.value })} />
                    </Field>
                    <Field label="التكلفة لكل جرام">
                      <Input type="number" min="0" step="0.01" value={itemForm.cost_per_gram} onChange={(event) => updateItemForm(formula.id, { cost_per_gram: event.target.value })} />
                    </Field>
                    <Field label="الكمية بالملي">
                      <Input type="number" min="0" step="0.01" value={itemForm.quantity_ml} onChange={(event) => updateItemForm(formula.id, { quantity_ml: event.target.value })} />
                    </Field>
                    <Field label="النسبة">
                      <Input type="number" min="0" step="0.01" value={itemForm.percentage} onChange={(event) => updateItemForm(formula.id, { percentage: event.target.value })} />
                    </Field>
                  </div>
                  <Field label="ملاحظات">
                    <Textarea value={itemForm.internal_notes} onChange={(event) => updateItemForm(formula.id, { internal_notes: event.target.value })} />
                  </Field>
                  <div className="data-card__row">
                    <span>تكلفة هذا العنصر</span>
                    <strong>{formatCurrency(Number(itemForm.quantity_grams || 0) * Number(itemForm.cost_per_gram || 0))}</strong>
                  </div>
                  <Button type="submit" variant="secondary" disabled={savingItemId === formula.id}>
                    {savingItemId === formula.id ? 'جاري إضافة العنصر...' : 'إضافة عنصر'}
                  </Button>
                </form>
              </Card>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminFormulas;

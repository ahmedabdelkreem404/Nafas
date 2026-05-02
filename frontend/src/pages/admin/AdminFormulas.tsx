import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Button, Card, EmptyState, ErrorState, Field, Input, LoadingState, Select, Textarea } from '../../components/ui';
import { formatCurrency } from '../../utils/format';

const blankFormula = { product_id: '', oil_percentage: 24, alcohol_percentage: 76, ifra_status: '', sds_status: '', supplier_name: '', supplier_reference: '', supplier_batch_reference: '', internal_notes: '' };
const blankItem = { ingredient_id: '', ingredient_name: '', quantity_ml: '', quantity_grams: '', cost_per_gram: '', percentage: '', internal_notes: '', supplier_reference: '', ifra_status: '', sds_status: '' };

const AdminFormulas: React.FC = () => {
  const [formulas, setFormulas] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [formulaForm, setFormulaForm] = useState<any>(blankFormula);
  const [itemForms, setItemForms] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([adminApi.formulas.list(), adminApi.products.list(), adminApi.ingredients.list()])
      .then(([formulasRes, productsRes, ingredientsRes]) => {
        setFormulas(formulasRes.data || []);
        setProducts(productsRes.data || []);
        setIngredients(ingredientsRes.data || []);
      })
      .catch((err) => {
        setError(err.message || 'تعذر تحميل التركيبات. تأكد من اتصال الـ API ثم أعد المحاولة.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const formulaTotals = useMemo(() => Object.fromEntries(formulas.map((formula) => {
    const total = (formula.items || []).reduce((sum: number, item: any) => sum + (Number(item.quantity_grams || 0) * Number(item.cost_per_gram || 0)), 0);
    return [formula.id, total];
  })), [formulas]);

  return (
    <AdminPageShell eyebrow="Formulas" title="التركيبات والامتثال" description="منطقة داخلية محمية لإدارة التركيبات، الموردين، وعناصر التكلفة لفريق التشغيل فقط.">
      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.formulas.create(formulaForm).then(() => { setFormulaForm(blankFormula); load(); });
        }}>
          <div className="grid-auto">
            <Field label="المنتج">
              <Select value={formulaForm.product_id} onChange={(event) => setFormulaForm({ ...formulaForm, product_id: event.target.value })}>
                <option value="">اختر المنتج</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name_ar || product.name_en}</option>)}
              </Select>
            </Field>
            <Field label="نسبة الزيت"><Input type="number" value={formulaForm.oil_percentage} onChange={(event) => setFormulaForm({ ...formulaForm, oil_percentage: Number(event.target.value) })} /></Field>
            <Field label="نسبة الكحول"><Input type="number" value={formulaForm.alcohol_percentage} onChange={(event) => setFormulaForm({ ...formulaForm, alcohol_percentage: Number(event.target.value) })} /></Field>
            <Field label="IFRA"><Input value={formulaForm.ifra_status} onChange={(event) => setFormulaForm({ ...formulaForm, ifra_status: event.target.value })} /></Field>
            <Field label="SDS"><Input value={formulaForm.sds_status} onChange={(event) => setFormulaForm({ ...formulaForm, sds_status: event.target.value })} /></Field>
            <Field label="المورد"><Input value={formulaForm.supplier_name} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_name: event.target.value })} /></Field>
            <Field label="مرجع المورد"><Input value={formulaForm.supplier_reference} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_reference: event.target.value })} /></Field>
            <Field label="دفعة المورد"><Input value={formulaForm.supplier_batch_reference} onChange={(event) => setFormulaForm({ ...formulaForm, supplier_batch_reference: event.target.value })} /></Field>
          </div>
          <Field label="ملاحظات داخلية"><Textarea value={formulaForm.internal_notes} onChange={(event) => setFormulaForm({ ...formulaForm, internal_notes: event.target.value })} /></Field>
          <Button type="submit">إضافة تركيبة</Button>
        </form>
      </Card>

      {loading ? (
        <LoadingState label="جارِ تحميل التركيبات..." />
      ) : error ? (
        <ErrorState
          message={error}
          action={<Button type="button" variant="secondary" onClick={load}>إعادة المحاولة</Button>}
        />
      ) : !formulas.length ? (
        <EmptyState title="لا توجد تركيبات" description="أضف أول تركيبة داخلية لهذا المنتج." />
      ) : (
        <div className="stack">
          {formulas.map((formula) => (
            <Card key={formula.id} tone="strong" className="stack">
              <div className="data-card__row">
                <strong>{formula.product?.name_ar || formula.product?.name_en || 'Formula'}</strong>
                <span className="copy-muted">{formula.ifra_status || 'IFRA pending'}</span>
              </div>
              <Textarea value={formula.internal_notes || ''} onChange={(event) => setFormulas((current) => current.map((entry) => entry.id === formula.id ? { ...entry, internal_notes: event.target.value } : entry))} />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button onClick={() => adminApi.formulas.update(formula.id, { internal_notes: formula.internal_notes, ifra_status: formula.ifra_status, sds_status: formula.sds_status }).then(load)}>حفظ التركيبة</Button>
                <Button variant="danger" onClick={() => adminApi.formulas.delete(formula.id).then(load)}>حذف التركيبة</Button>
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
                  <Button size="sm" variant="danger" onClick={() => adminApi.formulas.deleteItem(item.id).then(load)}>حذف العنصر</Button>
                </div>
              ))}
              <div className="summary-card">
                <div className="price-line">
                  <span>تكلفة التركيبة الكاملة</span>
                  <strong>{formatCurrency(formulaTotals[formula.id] || 0)}</strong>
                </div>
                <small className="copy-muted">لكل 100 مل تقريبا</small>
              </div>
              <form className="stack" onSubmit={(event) => {
                event.preventDefault();
                adminApi.formulas.createItem(formula.id, itemForms[formula.id] || blankItem).then(() => { setItemForms({ ...itemForms, [formula.id]: blankItem }); load(); });
              }}>
                <div className="grid-auto">
                  <Field label="المكون">
                    <Select value={itemForms[formula.id]?.ingredient_id || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), ingredient_id: event.target.value } })}>
                      <option value="">اختر مكونا</option>
                      {ingredients.map((ingredient) => <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="الاسم"><Input value={itemForms[formula.id]?.ingredient_name || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), ingredient_name: event.target.value } })} /></Field>
                  <Field label="الكمية بالجرام"><Input value={itemForms[formula.id]?.quantity_grams || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), quantity_grams: event.target.value } })} /></Field>
                  <Field label="التكلفة لكل جرام"><Input value={itemForms[formula.id]?.cost_per_gram || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), cost_per_gram: event.target.value } })} /></Field>
                  <Field label="الكمية مل"><Input value={itemForms[formula.id]?.quantity_ml || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), quantity_ml: event.target.value } })} /></Field>
                  <Field label="النسبة"><Input value={itemForms[formula.id]?.percentage || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), percentage: event.target.value } })} /></Field>
                </div>
                <Field label="ملاحظات"><Textarea value={itemForms[formula.id]?.internal_notes || ''} onChange={(event) => setItemForms({ ...itemForms, [formula.id]: { ...(itemForms[formula.id] || blankItem), internal_notes: event.target.value } })} /></Field>
                <div className="data-card__row">
                  <span>تكلفة هذا العنصر</span>
                  <strong>{formatCurrency(Number(itemForms[formula.id]?.quantity_grams || 0) * Number(itemForms[formula.id]?.cost_per_gram || 0))}</strong>
                </div>
                <Button type="submit" variant="secondary">إضافة عنصر</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminFormulas;

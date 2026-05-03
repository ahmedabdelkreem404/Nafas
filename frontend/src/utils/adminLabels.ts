const statusLabels: Record<string, string> = {
  active: 'نشط',
  approved: 'معتمد',
  cancelled: 'ملغي',
  confirmed: 'مؤكد',
  delivered: 'تم التسليم',
  draft: 'مسودة',
  hidden: 'مخفي',
  inactive: 'غير نشط',
  out_of_stock: 'نفد المخزون',
  paid: 'مدفوع',
  pending: 'قيد المراجعة',
  preparing: 'جاري التحضير',
  preparing_dispatch: 'جاري التجهيز للشحن',
  refunded: 'مسترد',
  rejected: 'مرفوض',
  shipped: 'تم الشحن',
};

const genderLabels: Record<string, string> = {
  female: 'حريمي',
  male: 'رجالي',
  men: 'رجالي',
  Men: 'رجالي',
  unisex: 'يونيسكس',
  Unisex: 'يونيسكس',
  women: 'حريمي',
  Women: 'حريمي',
};

const roleLabels: Record<string, string> = {
  admin: 'مدير',
  content_manager: 'مسؤول المحتوى',
  customer: 'عميل',
  inventory_manager: 'مسؤول المخزون',
  order_manager: 'مسؤول الطلبات',
  super_admin: 'مدير عام',
};

const userNameLabels: Record<string, string> = {
  Admin: 'مدير النظام',
  'Local Nafas Admin': 'مدير نفس المحلي',
};

const qualityValueLabels: Record<string, string> = {
  Clarity: 'الصفاء',
  Fail: 'غير مقبول',
  Good: 'جيد',
  Leak: 'التسريب',
  Pass: 'مقبول',
  Scent: 'الرائحة',
  Sprayer: 'البخاخ',
  failed: 'غير مقبول',
  passed: 'مقبول',
};

export function adminStatusLabel(value?: string | null) {
  return statusLabels[String(value || '')] || value || 'غير محدد';
}

export function adminGenderLabel(value?: string | null) {
  return genderLabels[String(value || '')] || value || 'غير محدد';
}

export function adminRoleLabel(value?: string | null) {
  return roleLabels[String(value || '')] || value || 'مدير';
}

export function adminUserNameLabel(value?: string | null) {
  return userNameLabels[String(value || '')] || value || 'مدير النظام';
}

export function adminQualityValueLabel(value?: string | null) {
  return qualityValueLabels[String(value || '')] || value || 'غير محدد';
}

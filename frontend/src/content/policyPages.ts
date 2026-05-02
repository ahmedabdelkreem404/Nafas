import type { Locale } from '../context/LocaleContext';

type PolicySection = {
  title: string;
  body: string;
};

type PolicyPage = {
  hero: string;
  sections: readonly PolicySection[];
  reviewNote: string;
};

const policyPages = {
  'privacy-policy': {
    ar: {
      hero: 'نحترم بياناتك ونستخدمها فقط لتشغيل الطلبات والدعم وتحسين تجربة الشراء.',
      sections: [
        {
          title: 'البيانات التي نجمعها',
          body: 'قد نجمع الاسم، رقم الهاتف، البريد الإلكتروني الاختياري، عنوان التوصيل، تفاصيل الطلب، وطريقة الدفع المختارة حتى نتمكن من تنفيذ الطلب ومتابعته.',
        },
        {
          title: 'استخدام البيانات',
          body: 'تُستخدم البيانات لتأكيد الطلب، التوصيل، مراجعة التحويلات اليدوية، خدمة العملاء، وتحسين تجربة المتجر. لا نعرض بيانات الدفع الداخلية أو صور إثبات التحويل للعامة.',
        },
        {
          title: 'حماية البيانات',
          body: 'نقيد الوصول إلى بيانات الطلبات والمدفوعات داخل لوحة الإدارة، ونحتفظ بملفات إثبات الدفع في تخزين خاص غير مخصص للعرض العام.',
        },
      ],
      reviewNote: 'يجب مراجعة الصياغة القانونية النهائية قبل الإطلاق التجاري الواسع.',
    },
    en: {
      hero: 'We use customer data only to operate orders, support, and the buying experience.',
      sections: [
        {
          title: 'Data we collect',
          body: 'We may collect name, phone number, optional email, delivery address, order details, and selected payment method to process and support the order.',
        },
        {
          title: 'How data is used',
          body: 'Data is used for order confirmation, delivery, manual payment review, customer support, and store improvement. Internal payment files are not publicly exposed.',
        },
        {
          title: 'Data protection',
          body: 'Order and payment data access is restricted to the admin area, and payment proof files are stored privately.',
        },
      ],
      reviewNote: 'Final legal wording should be reviewed before broad commercial launch.',
    },
  },
  'return-policy': {
    ar: {
      hero: 'سياسة واضحة تساعد العميل على الشراء بثقة وفهم قبل تأكيد الطلب.',
      sections: [
        {
          title: 'قبل التجهيز',
          body: 'يمكن طلب تعديل أو إلغاء الطلب قبل بدء التجهيز حسب حالة الطلب وتوفر المخزون.',
        },
        {
          title: 'بعد الاستلام',
          body: 'بسبب طبيعة منتجات العطور، يجب أن يبقى المنتج غير مستخدم وبحالته الأصلية لأي طلب استبدال أو مراجعة، وفق السياسة التشغيلية النهائية للعلامة.',
        },
        {
          title: 'التواصل',
          body: 'يتم استقبال طلبات المتابعة عبر قناة الدعم الرسمية مع رقم الطلب وصور واضحة إذا لزم الأمر.',
        },
      ],
      reviewNote: 'هذه صياغة تشغيلية أولية ويجب تثبيتها قانونيًا قبل التوسع.',
    },
    en: {
      hero: 'A clear policy helps customers buy with confidence before confirming an order.',
      sections: [
        {
          title: 'Before preparation',
          body: 'Orders can be modified or cancelled before preparation starts, depending on order status and stock.',
        },
        {
          title: 'After delivery',
          body: 'Because fragrances are personal products, any exchange review should require the item to remain unused and in original condition, subject to final business policy.',
        },
        {
          title: 'Support',
          body: 'Follow-up requests should be sent through the official support channel with the order number and clear photos when needed.',
        },
      ],
      reviewNote: 'This operational wording should be legally reviewed before scale.',
    },
  },
  'shipping-policy': {
    ar: {
      hero: 'توصيل واضح ومتابعة هادئة من تأكيد الطلب حتى وصوله.',
      sections: [
        {
          title: 'تأكيد الطلب',
          body: 'طلبات الدفع عند الاستلام تبدأ كمراجعة تشغيلية، وطلبات Vodafone Cash أو Instapay تتم مراجعتها يدويًا قبل تأكيد التجهيز.',
        },
        {
          title: 'التوصيل',
          body: 'يتم التواصل مع العميل عند الحاجة لتأكيد العنوان أو تفاصيل التسليم. قد تختلف مدة التوصيل حسب المحافظة وحالة التشغيل.',
        },
        {
          title: 'المتابعة',
          body: 'احتفظ برقم الطلب لتسهيل المتابعة عبر حسابك أو قناة الدعم الرسمية.',
        },
      ],
      reviewNote: 'يجب ضبط مدد ورسوم الشحن النهائية حسب شركة التوصيل قبل الإعلان العام.',
    },
    en: {
      hero: 'Clear delivery expectations from order confirmation to arrival.',
      sections: [
        {
          title: 'Order confirmation',
          body: 'Cash on delivery orders enter operational review, while Vodafone Cash and Instapay orders are manually reviewed before preparation is confirmed.',
        },
        {
          title: 'Delivery',
          body: 'Support may contact the customer to confirm the address or delivery details. Delivery timing can vary by governorate and operations.',
        },
        {
          title: 'Follow-up',
          body: 'Keep the order number available for account or support follow-up.',
        },
      ],
      reviewNote: 'Final delivery timing and fees should be confirmed with the shipping partner before public launch.',
    },
  },
  terms: {
    ar: {
      hero: 'شروط استخدام بسيطة وواضحة لتجربة شراء موثوقة.',
      sections: [
        {
          title: 'استخدام المتجر',
          body: 'يُستخدم المتجر لاستعراض منتجات نفَس المتاحة وإتمام الطلبات وفق القوانين المحلية وسياسات العلامة.',
        },
        {
          title: 'الأسعار والتوفر',
          body: 'قد يتغير التوفر حسب المخزون الفعلي. صفحة المنتج وسلة الشراء هما المرجع الأقرب للسعر والحالة وقت الطلب.',
        },
        {
          title: 'الدفع اليدوي',
          body: 'مدفوعات Vodafone Cash وInstapay تحتاج مراجعة يدوية للمرجع أو إثبات التحويل قبل اعتماد الدفع داخل العمليات.',
        },
      ],
      reviewNote: 'يجب مراجعة هذه الشروط قانونيًا قبل الإطلاق العام النهائي.',
    },
    en: {
      hero: 'Simple terms for a trustworthy buying experience.',
      sections: [
        {
          title: 'Store use',
          body: 'The store is intended for browsing available Nafas products and placing orders under local laws and brand policy.',
        },
        {
          title: 'Prices and availability',
          body: 'Availability may change with real stock. Product and cart pages are the closest reference at order time.',
        },
        {
          title: 'Manual payments',
          body: 'Vodafone Cash and Instapay payments require manual reference or proof review before payment approval in operations.',
        },
      ],
      reviewNote: 'Final terms should be legally reviewed before broad public launch.',
    },
  },
} as const;

export function getPolicyPage(slug: string, locale: Locale): PolicyPage | null {
  if (!(slug in policyPages)) {
    return null;
  }

  return policyPages[slug as keyof typeof policyPages][locale];
}

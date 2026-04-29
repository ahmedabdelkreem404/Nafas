export type Locale = 'ar' | 'en';

export type Accent = 'gold' | 'amber' | 'copper' | 'rose';

export type CustomerProfileSummary = {
  id: number;
  total_orders: number;
  total_spent: number;
  last_order_at?: string | null;
};

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
  profile_picture?: string | null;
  google_id?: string | null;
  customer?: CustomerProfileSummary | null;
};

export type MediaItem = {
  id?: number | string;
  alt?: string | null;
  url?: string;
  src?: string;
};

export type Variant = {
  id: number;
  label: string;
  size_ml: number;
  retail_price: number;
  in_stock: boolean;
  type: 'retail' | 'tester';
};

export type Product = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  description?: string;
  category_ar?: string;
  category_en?: string;
  gender_ar?: string;
  gender_en?: string;
  personality_ar: string;
  personality_en: string;
  story: string;
  story_en: string;
  notes_ar: string[];
  notes_en: string[];
  accent?: Accent;
  local_media?: string[];
  media?: MediaItem[];
  tags_ar?: string[];
  tags_en?: string[];
  mood_ar?: string;
  mood_en?: string;
  season_ar?: string;
  season_en?: string;
  longevity_label?: string;
  longevity_label_ar?: string;
  longevity_label_en?: string;
  projection_label?: string;
  projection_label_ar?: string;
  projection_label_en?: string;
  variants: Variant[];
  favorite_count?: number;
  favorites_count?: number;
  view_count?: number;
  views_count?: number;
  rating_average?: number;
  average_rating?: number;
  review_count?: number;
  reviews_count?: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: Product | null;
  variant: Variant;
};

export type OrderItem = {
  id?: number | string;
  quantity: number;
  product?: Product | null;
  variant?: Variant | null;
  product_name?: string;
  variant_label?: string;
  unit_price?: number;
  total_price?: number;
};

export type Order = {
  id?: number | string;
  order_number: string;
  status?: string;
  total?: number;
  items?: OrderItem[];
  customer_name?: string;
  phone?: string;
  email?: string;
  created_at?: string;
  address?: string;
  governorate?: string;
  city?: string;
  delivery_notes?: string;
};

export type ReviewVoteType = 'like' | 'dislike' | null;

export type ProductReviewReply = {
  authorAvatar?: string;
  authorName: string;
  body: string;
  created_at: string;
  dislikes: number;
  id: number | string;
  likes: number;
  parent_id?: number | string | null;
  replies?: ProductReviewReply[];
  userVote?: ReviewVoteType;
};

export type ProductReview = {
  authorAvatar?: string;
  authorName: string;
  body: string;
  created_at: string;
  dislikes: number;
  id: number | string;
  likes: number;
  rating: number;
  replies: ProductReviewReply[];
  reply_count?: number;
  userVote?: ReviewVoteType;
};

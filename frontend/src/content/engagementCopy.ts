import type { Locale } from '../context/LocaleContext';

const engagementCopy = {
  ar: {
    nav: {
      favorites: 'المفضلة',
    },
    wishlist: {
      title: 'مفضلاتك',
      subtitle: 'العطور التي حفظتها تبقى هنا لعودة أسرع واختيار أهدأ.',
      emptyTitle: 'لا توجد مفضلات بعد',
      emptyDescription: 'احفظ العطور التي لفتت انتباهك لتعود لها بسرعة وقت المقارنة أو الطلب.',
      browse: 'اكتشف العطور',
      bestLabel: 'الأكثر تفضيلًا الآن',
    },
    stats: {
      best: 'أفضل منتج',
      favorites: 'في المفضلة',
      rating: 'التقييم',
      reviews: 'مراجعات',
      views: 'شاهده الزوار',
    },
    product: {
      addFavorite: 'أضف للمفضلة',
      removeFavorite: 'إزالة من المفضلة',
      saved: 'محفوظ',
      topProduct: 'الأكثر تفضيلًا',
    },
    reviews: {
      title: 'التقييمات والآراء',
      subtitle: 'شارك انطباعك عن الرائحة والثبات والفوحان، واترك مساحة لغيرك يرد أو يتفاعل.',
      average: 'متوسط التقييم',
      basedOn: 'بناءً على المراجعات',
      emptyTitle: 'كن أول من يقيّم هذا العطر',
      emptyDescription: 'أضف انطباعك الأول ليساعد غيرك على الاختيار بشكل أوضح.',
      name: 'الاسم',
      rating: 'تقييمك',
      comment: 'رأيك',
      commentPlaceholder: 'اكتب رأيك في الرائحة، الثبات، الفوحان، أو أفضل وقت لاستخدامه.',
      submit: 'أضف تقييمك',
      submitReply: 'أضف الرد',
      reply: 'رد',
      replyPlaceholder: 'اكتب ردك على هذا التعليق.',
      guest: 'زائر نفَس',
      like: 'إعجاب',
      dislike: 'عدم إعجاب',
      anonymousHint: 'يمكنك الكتابة باسم بسيط لو لم تكن مسجلًا.',
    },
  },
  en: {
    nav: {
      favorites: 'Favorites',
    },
    wishlist: {
      title: 'Your favorites',
      subtitle: 'The fragrances you saved stay here for a faster return and a calmer decision later.',
      emptyTitle: 'No favorites yet',
      emptyDescription: 'Save the fragrances that catch your eye so you can compare or order them faster later.',
      browse: 'Discover perfumes',
      bestLabel: 'Most favorited right now',
    },
    stats: {
      best: 'Best product',
      favorites: 'Saved',
      rating: 'Rating',
      reviews: 'Reviews',
      views: 'Views',
    },
    product: {
      addFavorite: 'Save to favorites',
      removeFavorite: 'Remove from favorites',
      saved: 'Saved',
      topProduct: 'Most favorited',
    },
    reviews: {
      title: 'Ratings and comments',
      subtitle: 'Share your take on scent, projection, and longevity, then let others reply or react.',
      average: 'Average rating',
      basedOn: 'Based on reviews',
      emptyTitle: 'Be the first to review this fragrance',
      emptyDescription: 'Add your first impression to help the next shopper decide more clearly.',
      name: 'Name',
      rating: 'Your rating',
      comment: 'Your comment',
      commentPlaceholder: 'Share your take on the scent, trail, longevity, or best time to wear it.',
      submit: 'Add your review',
      submitReply: 'Post reply',
      reply: 'Reply',
      replyPlaceholder: 'Write your reply to this comment.',
      guest: 'Nafas guest',
      like: 'Like',
      dislike: 'Dislike',
      anonymousHint: 'A simple display name is enough if you are not signed in.',
    },
  },
} as const;

export function getEngagementCopy(locale: Locale) {
  return engagementCopy[locale];
}


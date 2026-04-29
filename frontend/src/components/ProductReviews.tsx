import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../api/publicApi';
import { useLocale } from '../context/LocaleContext';
import type { ProductReview, ProductReviewReply, ReviewVoteType } from '../types/store';
import { formatNumber, formatRelativeTime } from '../utils/format';
import { extractResponseData } from '../utils/products';

function getInitials(name?: string) {
  return String(name || 'Nafas Guest')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function Stars({ value }: { value: number }) {
  return (
    <div className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < Math.round(value) ? 'is-on' : ''}>★</span>
      ))}
    </div>
  );
}

function normalizeReply(payload: any): ProductReviewReply {
  return {
    authorAvatar: getInitials(payload?.author_name || payload?.authorName),
    authorName: payload?.author_name || payload?.authorName || 'Nafas Guest',
    body: payload?.body || payload?.text || '',
    created_at: payload?.created_at || new Date().toISOString(),
    dislikes: Number(payload?.dislikes || 0),
    id: payload?.id,
    likes: Number(payload?.likes || 0),
    parent_id: payload?.parent_id ?? null,
    replies: Array.isArray(payload?.replies) ? payload.replies.map(normalizeReply) : [],
    userVote: null,
  };
}

function normalizeReview(payload: any): ProductReview {
  return {
    authorAvatar: getInitials(payload?.author_name || payload?.authorName),
    authorName: payload?.author_name || payload?.authorName || 'Nafas Guest',
    body: payload?.body || payload?.text || '',
    created_at: payload?.created_at || new Date().toISOString(),
    dislikes: Number(payload?.dislikes || 0),
    id: payload?.id,
    likes: Number(payload?.likes || 0),
    rating: Number(payload?.rating || 0),
    replies: Array.isArray(payload?.replies) ? payload.replies.map(normalizeReply) : [],
    reply_count: Number(payload?.reply_count || 0),
    userVote: null,
  };
}

function createTempId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.round(Math.random() * 1_000_000)}`;
}

function extractList<T>(payload: unknown): T[] {
  const nested = extractResponseData<T[]>(payload);
  if (nested) {
    return nested;
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown[] }).data)) {
    return (payload as { data: T[] }).data;
  }

  return Array.isArray(payload) ? payload as T[] : [];
}

function updateNestedReply(items: ProductReviewReply[], reviewId: number | string, updater: (item: ProductReviewReply) => ProductReviewReply): ProductReviewReply[] {
  return items.map((item) => {
    if (String(item.id) === String(reviewId)) {
      return updater(item);
    }

    return {
      ...item,
      replies: item.replies?.length ? updateNestedReply(item.replies, reviewId, updater) : [],
    };
  });
}

function ReviewReplyNode({
  locale,
  onReplySubmit,
  onVote,
  reply,
}: {
  locale: 'ar' | 'en';
  onReplySubmit: (reviewId: number | string, authorName: string, body: string) => Promise<void>;
  onVote: (reviewId: number | string, vote: 'like' | 'dislike', currentVote: ReviewVoteType) => Promise<void>;
  reply: ProductReviewReply;
}) {
  const [replying, setReplying] = useState(false);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  return (
    <div className="review-reply">
      <div className="review-avatar">{reply.authorAvatar}</div>
      <div className="review-body">
        <div className="review-meta">
          <strong>{reply.authorName}</strong>
          <span>{formatRelativeTime(reply.created_at, locale)}</span>
        </div>
        <p>{reply.body}</p>
        <div className="review-actions">
          <button type="button" className={reply.userVote === 'like' ? 'is-active' : ''} onClick={() => onVote(reply.id, 'like', reply.userVote || null)}>
            <ThumbsUp size={14} /> {formatNumber(reply.likes, locale)}
          </button>
          <button type="button" className={reply.userVote === 'dislike' ? 'is-active' : ''} onClick={() => onVote(reply.id, 'dislike', reply.userVote || null)}>
            <ThumbsDown size={14} /> {formatNumber(reply.dislikes, locale)}
          </button>
          <button type="button" onClick={() => setReplying((current) => !current)}>
            <MessageSquare size={14} /> {locale === 'ar' ? 'رد' : 'Reply'}
          </button>
        </div>
        {replying ? (
          <form
            className="reply-form"
            onSubmit={async (event) => {
              event.preventDefault();
              await onReplySubmit(reply.id, author, text);
              setAuthor('');
              setText('');
              setReplying(false);
            }}
          >
            <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder={locale === 'ar' ? 'الاسم' : 'Name'} required />
            <textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} placeholder={locale === 'ar' ? 'اكتب ردك' : 'Write your reply'} required />
            <button type="submit" className="n-btn n-btn--ghost">{locale === 'ar' ? 'نشر الرد' : 'Post reply'}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const { locale } = useLocale();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [replying, setReplying] = useState<number | string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  const loadReplies = useCallback(async (reviewId: number | string) => {
    const response = await publicApi.getReviewReplies(reviewId);
    return extractList<any>(response.data).map(normalizeReply);
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await publicApi.getProductReviews(productSlug);
      const baseReviews = extractList<any>(response.data).map(normalizeReview);
      const reviewsWithReplies = await Promise.all(baseReviews.map(async (review) => {
        if (!review.reply_count) {
          return review;
        }

        const replies = await loadReplies(review.id);
        return { ...review, replies };
      }));

      setReviews(reviewsWithReplies);
    } catch (err: any) {
      setError(err.message || (locale === 'ar' ? 'تعذّر تحميل التقييمات.' : 'Unable to load reviews.'));
    } finally {
      setLoading(false);
    }
  }, [loadReplies, locale, productSlug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const summary = useMemo(() => {
    const ratingReviews = reviews.filter((review) => review.rating > 0);
    const count = ratingReviews.length;
    const avg = count ? ratingReviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const hits = ratingReviews.filter((review) => review.rating === star).length;
      return { ratio: count ? hits / count : 0, star, total: hits };
    });
    return { avg, count, distribution };
  }, [reviews]);

  const handleVote = useCallback(async (reviewId: number | string, vote: 'like' | 'dislike', currentVote: ReviewVoteType) => {
    const applyOptimistic = (likes: number, dislikes: number, current: ReviewVoteType) => {
      let nextLikes = likes;
      let nextDislikes = dislikes;
      let nextVote: ReviewVoteType = vote;

      if (current === vote) {
        nextVote = null;
        if (vote === 'like') nextLikes = Math.max(0, likes - 1);
        if (vote === 'dislike') nextDislikes = Math.max(0, dislikes - 1);
        return { dislikes: nextDislikes, likes: nextLikes, vote: nextVote };
      }

      if (current === 'like') nextLikes = Math.max(0, likes - 1);
      if (current === 'dislike') nextDislikes = Math.max(0, dislikes - 1);
      if (vote === 'like') nextLikes += 1;
      if (vote === 'dislike') nextDislikes += 1;

      return { dislikes: nextDislikes, likes: nextLikes, vote: nextVote };
    };

    const previous = reviews;

    setReviews((current) => current.map((review) => {
      if (String(review.id) === String(reviewId)) {
        const next = applyOptimistic(review.likes, review.dislikes, review.userVote || currentVote);
        return { ...review, dislikes: next.dislikes, likes: next.likes, userVote: next.vote };
      }

      return {
        ...review,
        replies: updateNestedReply(review.replies, reviewId, (reply) => {
          const next = applyOptimistic(reply.likes, reply.dislikes, reply.userVote || currentVote);
          return { ...reply, dislikes: next.dislikes, likes: next.likes, userVote: next.vote };
        }),
      };
    }));

    try {
      const response = await publicApi.voteReview(reviewId, vote);
      const payload = extractResponseData<{ likes: number; dislikes: number }>(response.data) || response.data.data || response.data;
      setReviews((current) => current.map((review) => {
        if (String(review.id) === String(reviewId)) {
          return { ...review, dislikes: Number(payload.dislikes || 0), likes: Number(payload.likes || 0) };
        }

        return {
          ...review,
          replies: updateNestedReply(review.replies, reviewId, (reply) => ({
            ...reply,
            dislikes: Number(payload.dislikes || 0),
            likes: Number(payload.likes || 0),
          })),
        };
      }));
    } catch {
      setReviews(previous);
    }
  }, [reviews]);

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      return;
    }

    const optimistic: ProductReview = {
      authorAvatar: getInitials(author || 'Nafas Guest'),
      authorName: author.trim() || 'Nafas Guest',
      body: text.trim(),
      created_at: new Date().toISOString(),
      dislikes: 0,
      id: createTempId('temp-review'),
      likes: 0,
      rating,
      replies: [],
      reply_count: 0,
      userVote: null,
    };

    const previous = reviews;
    setReviews((current) => [optimistic, ...current]);
    setAuthor('');
    setText('');
    setRating(0);
    setOpen(false);
    setError('');

    try {
      const response = await publicApi.createProductReview(productSlug, {
        author_name: optimistic.authorName,
        body: optimistic.body,
        rating: optimistic.rating,
      });

      const created = normalizeReview(extractResponseData<any>(response.data) || response.data.data || response.data);
      setReviews((current) => current.map((review) => String(review.id) === String(optimistic.id) ? created : review));
    } catch (err: any) {
      setReviews(previous);
      setError(err.message || (locale === 'ar' ? 'تعذّر نشر التقييم.' : 'Unable to publish the review.'));
    }
  };

  const handleReplySubmit = async (reviewId: number | string, authorName: string, body: string) => {
    const optimistic = normalizeReply({
      author_name: authorName.trim() || 'Nafas Guest',
      body,
      created_at: new Date().toISOString(),
      dislikes: 0,
      id: createTempId('temp-reply'),
      likes: 0,
      parent_id: reviewId,
    });

    const previous = reviews;
    setReviews((current) => current.map((review) => {
      if (String(review.id) === String(reviewId)) {
        return { ...review, replies: [...review.replies, optimistic], reply_count: (review.reply_count || 0) + 1 };
      }

      return {
        ...review,
        replies: updateNestedReply(review.replies, reviewId, (reply) => ({
          ...reply,
          replies: [...(reply.replies || []), optimistic],
        })),
      };
    }));

    try {
      const response = await publicApi.createReviewReply(reviewId, {
        author_name: authorName.trim() || 'Nafas Guest',
        body: body.trim(),
      });

      const created = normalizeReply(extractResponseData<any>(response.data) || response.data.data || response.data);
      setReviews((current) => current.map((review) => {
        if (String(review.id) === String(reviewId)) {
          return {
            ...review,
            replies: review.replies.map((reply) => String(reply.id) === String(optimistic.id) ? created : reply),
          };
        }

        return {
          ...review,
          replies: updateNestedReply(review.replies, reviewId, (reply) => ({
            ...reply,
            replies: (reply.replies || []).map((child) => String(child.id) === String(optimistic.id) ? created : child),
          })),
        };
      }));
    } catch (err: any) {
      setReviews(previous);
      setError(err.message || (locale === 'ar' ? 'تعذّر نشر الرد.' : 'Unable to publish the reply.'));
    }
  };

  return (
    <section className="reviews">
      <div className="reviews__summary">
        <div className="reviews__score">
          <small>{locale === 'ar' ? 'آراء العملاء' : 'Customer reviews'}</small>
          <strong>{summary.avg.toFixed(1)}</strong>
          <Stars value={summary.avg} />
          <span>{locale === 'ar' ? `${formatNumber(summary.count, locale)} تقييم` : `${formatNumber(summary.count, locale)} reviews`}</span>
        </div>

        <div className="reviews__bars">
          {summary.distribution.map((item, index) => (
            <div key={item.star} className="rating-bar">
              <span>{item.star}★</span>
              <div className="rating-bar__track">
                <b style={{ ['--bar-scale' as string]: item.ratio.toString(), ['--delay' as string]: `${index * 80}ms` }} />
              </div>
              <small>{formatNumber(item.total, locale)}</small>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="n-btn n-btn--ghost reviews__toggle" onClick={() => setOpen((current) => !current)}>
        {locale === 'ar' ? 'اكتب تقييمًا' : 'Write a review'}
      </button>

      <div className={`review-form-panel ${open ? 'is-open' : ''}`}>
        <form className="review-form" onSubmit={handleSubmitReview}>
          <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder={locale === 'ar' ? 'اسمك' : 'Your name'} required />
          <div className="star-picker">
            {Array.from({ length: 5 }).map((_, index) => (
              <button key={index} type="button" className={index < rating ? 'is-on' : ''} onClick={() => setRating(index + 1)} aria-label={`${index + 1} stars`}>
                ★
              </button>
            ))}
          </div>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows={4} placeholder={locale === 'ar' ? 'شارك انطباعك عن الرائحة والثبات والحضور' : 'Share your impression of the scent, longevity, and projection'} required />
          {!rating ? <p className="review-form__hint">{locale === 'ar' ? 'اختر عدد النجوم أولًا' : 'Choose a star rating first'}</p> : null}
          <button type="submit" className="n-btn n-btn--primary">{locale === 'ar' ? 'نشر التقييم' : 'Publish review'}</button>
        </form>
      </div>

      {error ? (
        <div className="error-banner reviews__error">
          <span>{error}</span>
          <button type="button" className="text-button" onClick={() => void loadReviews()}>
            {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      ) : null}

      <div className="reviews__list">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="review-skeleton" aria-hidden="true">
              <span className="review-skeleton__avatar" />
              <div className="review-skeleton__lines">
                <span className="review-skeleton__line review-skeleton__line--short" />
                <span className="review-skeleton__line" />
                <span className="review-skeleton__line review-skeleton__line--mid" />
              </div>
            </div>
          ))
        ) : null}

        {!loading && !reviews.length ? (
          <div className="reviews__empty">
            <strong>{locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</strong>
            <p>{locale === 'ar' ? 'ابدأ أول انطباع عن هذه الرائحة وساعد غيرك على الاختيار.' : 'Be the first to share your impression and help others choose.'}</p>
          </div>
        ) : null}

        {!loading ? reviews.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-avatar">{review.authorAvatar}</div>
            <div className="review-body">
              <div className="review-meta">
                <strong>{review.authorName}</strong>
                <Stars value={review.rating} />
                <span>{formatRelativeTime(review.created_at, locale)}</span>
              </div>
              <p>{review.body}</p>
              <div className="review-actions">
                <button type="button" className={review.userVote === 'like' ? 'is-active' : ''} onClick={() => void handleVote(review.id, 'like', review.userVote || null)}>
                  <ThumbsUp size={14} /> {locale === 'ar' ? `إعجاب ${formatNumber(review.likes, locale)}` : `Like ${formatNumber(review.likes, locale)}`}
                </button>
                <button type="button" className={review.userVote === 'dislike' ? 'is-active' : ''} onClick={() => void handleVote(review.id, 'dislike', review.userVote || null)}>
                  <ThumbsDown size={14} /> {locale === 'ar' ? `عدم إعجاب ${formatNumber(review.dislikes, locale)}` : `Dislike ${formatNumber(review.dislikes, locale)}`}
                </button>
                <button type="button" onClick={() => setReplying((current) => current === review.id ? null : review.id)}>
                  <MessageSquare size={14} /> {locale === 'ar' ? 'رد' : 'Reply'}
                </button>
              </div>

              {replying === review.id ? (
                <form
                  className="reply-form"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await handleReplySubmit(review.id, replyAuthor, replyText);
                    setReplyAuthor('');
                    setReplyText('');
                    setReplying(null);
                  }}
                >
                  <input value={replyAuthor} onChange={(event) => setReplyAuthor(event.target.value)} placeholder={locale === 'ar' ? 'الاسم' : 'Name'} required />
                  <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={3} placeholder={locale === 'ar' ? 'اكتب ردك' : 'Write your reply'} required />
                  <button type="submit" className="n-btn n-btn--ghost">{locale === 'ar' ? 'نشر الرد' : 'Post reply'}</button>
                </form>
              ) : null}

              {review.replies.length ? (
                <div className="review-thread">
                  {review.replies.map((reply) => (
                    <ReviewReplyNode
                      key={reply.id}
                      locale={locale}
                      onReplySubmit={handleReplySubmit}
                      onVote={handleVote}
                      reply={reply}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        )) : null}
      </div>
    </section>
  );
}

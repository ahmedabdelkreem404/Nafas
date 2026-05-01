import { MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../api/publicApi';
import { useLocale } from '../context/LocaleContext';
import type { ProductReview, ProductReviewReply, ReviewVoteType } from '../types/store';
import { formatNumber, formatRelativeTime } from '../utils/format';
import { extractResponseData } from '../utils/products';

const reviewCopy = {
  ar: {
    author: 'اسمك',
    chooseRating: 'اختر عدد النجوم أولا',
    customerReviews: 'آراء العملاء',
    dislike: 'عدم إعجاب',
    emptyBody: 'كن أول من يشارك انطباعه عن هذه الرائحة ويساعد غيره على الاختيار.',
    emptyTitle: 'لا توجد تقييمات بعد',
    like: 'إعجاب',
    loadError: 'تعذر تحميل التقييمات.',
    moderationReply: 'تم إرسال الرد للمراجعة قبل النشر.',
    moderationReview: 'تم إرسال تقييمك للمراجعة قبل النشر.',
    noReviews: 'تقييم',
    postReply: 'نشر الرد',
    publishReview: 'إرسال التقييم',
    reply: 'رد',
    replyError: 'تعذر إرسال الرد.',
    replyPlaceholder: 'اكتب ردك',
    retry: 'إعادة المحاولة',
    reviewError: 'تعذر إرسال التقييم.',
    reviewPlaceholder: 'شارك انطباعك عن الرائحة والثبات والحضور',
    writeReview: 'اكتب تقييما',
  },
  en: {
    author: 'Your name',
    chooseRating: 'Choose a star rating first',
    customerReviews: 'Customer reviews',
    dislike: 'Dislike',
    emptyBody: 'Be the first to share your impression and help others choose.',
    emptyTitle: 'No reviews yet',
    like: 'Like',
    loadError: 'Unable to load reviews.',
    moderationReply: 'Your reply was sent for review before publishing.',
    moderationReview: 'Your review was sent for review before publishing.',
    noReviews: 'reviews',
    postReply: 'Post reply',
    publishReview: 'Submit review',
    reply: 'Reply',
    replyError: 'Unable to submit the reply.',
    replyPlaceholder: 'Write your reply',
    retry: 'Retry',
    reviewError: 'Unable to submit the review.',
    reviewPlaceholder: 'Share your impression of the scent, longevity, and projection',
    writeReview: 'Write a review',
  },
} as const;

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
  const copy = reviewCopy[locale];
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
            <MessageSquare size={14} /> {copy.reply}
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
            <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder={copy.author} required />
            <textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} placeholder={copy.replyPlaceholder} required />
            <button type="submit" className="n-btn n-btn--ghost">{copy.postReply}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const { locale } = useLocale();
  const copy = reviewCopy[locale];
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
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
      setError(err.message || copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError, loadReplies, productSlug]);

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

    setError('');
    setNotice('');

    try {
      await publicApi.createProductReview(productSlug, {
        author_name: author.trim() || 'Nafas Guest',
        body: text.trim(),
        rating,
      });

      setAuthor('');
      setText('');
      setRating(0);
      setOpen(false);
      setNotice(copy.moderationReview);
    } catch (err: any) {
      setError(err.message || copy.reviewError);
    }
  };

  const handleReplySubmit = async (reviewId: number | string, authorName: string, body: string) => {
    setError('');
    setNotice('');

    try {
      await publicApi.createReviewReply(reviewId, {
        author_name: authorName.trim() || 'Nafas Guest',
        body: body.trim(),
      });

      setNotice(copy.moderationReply);
    } catch (err: any) {
      setError(err.message || copy.replyError);
    }
  };

  return (
    <section className="reviews">
      <div className="reviews__summary">
        <div className="reviews__score">
          <small>{copy.customerReviews}</small>
          <strong>{summary.avg.toFixed(1)}</strong>
          <Stars value={summary.avg} />
          <span>{`${formatNumber(summary.count, locale)} ${copy.noReviews}`}</span>
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
        {copy.writeReview}
      </button>

      <div className={`review-form-panel ${open ? 'is-open' : ''}`}>
        <form className="review-form" onSubmit={handleSubmitReview}>
          <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder={copy.author} required />
          <div className="star-picker">
            {Array.from({ length: 5 }).map((_, index) => (
              <button key={index} type="button" className={index < rating ? 'is-on' : ''} onClick={() => setRating(index + 1)} aria-label={`${index + 1} stars`}>
                ★
              </button>
            ))}
          </div>
          <textarea value={text} onChange={(event) => setText(event.target.value)} rows={4} placeholder={copy.reviewPlaceholder} required />
          {!rating ? <p className="review-form__hint">{copy.chooseRating}</p> : null}
          <button type="submit" className="n-btn n-btn--primary">{copy.publishReview}</button>
        </form>
      </div>

      {notice ? <div className="success-banner reviews__notice">{notice}</div> : null}

      {error ? (
        <div className="error-banner reviews__error">
          <span>{error}</span>
          <button type="button" className="text-button" onClick={() => void loadReviews()}>
            {copy.retry}
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
            <strong>{copy.emptyTitle}</strong>
            <p>{copy.emptyBody}</p>
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
                  <ThumbsUp size={14} /> {copy.like} {formatNumber(review.likes, locale)}
                </button>
                <button type="button" className={review.userVote === 'dislike' ? 'is-active' : ''} onClick={() => void handleVote(review.id, 'dislike', review.userVote || null)}>
                  <ThumbsDown size={14} /> {copy.dislike} {formatNumber(review.dislikes, locale)}
                </button>
                <button type="button" onClick={() => setReplying((current) => current === review.id ? null : review.id)}>
                  <MessageSquare size={14} /> {copy.reply}
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
                  <input value={replyAuthor} onChange={(event) => setReplyAuthor(event.target.value)} placeholder={copy.author} required />
                  <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={3} placeholder={copy.replyPlaceholder} required />
                  <button type="submit" className="n-btn n-btn--ghost">{copy.postReply}</button>
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

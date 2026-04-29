/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../types/store';

type VoteValue = 'like' | 'dislike' | null;

export type ReviewReply = {
  authorAvatar: string;
  authorName: string;
  createdAt: string;
  dislikes: number;
  id: string;
  likes: number;
  parentId: string;
  replies: ReviewReply[];
  text: string;
  userVote: VoteValue;
};

export type ProductReview = {
  authorAvatar: string;
  authorName: string;
  createdAt: string;
  dislikes: number;
  id: string;
  likes: number;
  parentId: null;
  productId: string;
  rating: number;
  replies: ReviewReply[];
  text: string;
  userVote: VoteValue;
};

type MetricsRecord = {
  favoriteBoost: number;
  views: number;
};

type PersistedState = {
  favorites: Record<string, Product>;
  metrics: Record<string, MetricsRecord>;
  reviews: Record<string, ProductReview[]>;
  sessionViewed: Record<string, boolean>;
  votes: Record<string, VoteValue>;
};

type ProductMetrics = {
  favorites: number;
  isFavorited: boolean;
  ratingAverage: number;
  reviewCount: number;
  score: number;
  views: number;
};

type EngagementContextValue = {
  addReply: (slug: string, reviewId: string, payload: { author?: string; body: string }) => void;
  addReview: (slug: string, payload: { author?: string; body: string; rating: number }) => void;
  favoriteCount: number;
  favoriteProducts: Product[];
  favoriteSlugs: string[];
  getProductMetrics: (product: Product) => ProductMetrics;
  getReviews: (slug: string) => ProductReview[];
  getScore: (product: Product) => number;
  getTopProductSlug: (products: Product[]) => string | null;
  isFavorited: (slug?: string | null) => boolean;
  registerView: (product: Product) => void;
  toggleFavorite: (product: Product) => void;
  voteReply: (slug: string, reviewId: string, replyId: string, vote: Exclude<VoteValue, null>) => void;
  voteReview: (slug: string, reviewId: string, vote: Exclude<VoteValue, null>) => void;
};

const STORAGE_KEY = 'nafas_engagement_v2';
const EngagementContext = createContext<EngagementContextValue | null>(null);

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function loadInitialState(): PersistedState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { favorites: {}, metrics: {}, reviews: {}, sessionViewed: {}, votes: {} };
    }

    const parsed = JSON.parse(saved);
    return {
      favorites: parsed.favorites || {},
      metrics: parsed.metrics || {},
      reviews: parsed.reviews || {},
      sessionViewed: parsed.sessionViewed || {},
      votes: parsed.votes || {},
    };
  } catch {
    return { favorites: {}, metrics: {}, reviews: {}, sessionViewed: {}, votes: {} };
  }
}

function getSlug(productOrSlug: Product | string) {
  return typeof productOrSlug === 'string' ? productOrSlug : productOrSlug?.slug || '';
}

function getMetricFromProduct(product: Product, metric: 'favorite' | 'view') {
  const metrics = product as Product & { wishlist_count?: number; wishlisted_count?: number; product_views?: number };
  if (metric === 'favorite') {
    return Number(metrics.favorite_count ?? metrics.favorites_count ?? metrics.wishlist_count ?? metrics.wishlisted_count ?? 0);
  }

  return Number(metrics.view_count ?? metrics.views_count ?? metrics.product_views ?? 0);
}

function getInitials(name?: string) {
  const parts = String(name || 'Nafas Guest').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
}

function applyVote(currentLikes: number, currentDislikes: number, currentVote: VoteValue, nextVote: Exclude<VoteValue, null>) {
  let likes = currentLikes;
  let dislikes = currentDislikes;

  if (currentVote === nextVote) {
    if (nextVote === 'like') likes = Math.max(0, likes - 1);
    if (nextVote === 'dislike') dislikes = Math.max(0, dislikes - 1);
    return { dislikes, likes, storedVote: null as VoteValue };
  }

  if (currentVote === 'like') likes = Math.max(0, likes - 1);
  if (currentVote === 'dislike') dislikes = Math.max(0, dislikes - 1);
  if (nextVote === 'like') likes += 1;
  if (nextVote === 'dislike') dislikes += 1;

  return { dislikes, likes, storedVote: nextVote as VoteValue };
}

function addNestedReply(nodes: ReviewReply[], parentId: string, reply: ReviewReply): ReviewReply[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, replies: [...node.replies, reply] };
    }

    if (!node.replies.length) {
      return node;
    }

    return { ...node, replies: addNestedReply(node.replies, parentId, reply) };
  });
}

function updateReplyVote(nodes: ReviewReply[], replyId: string, currentVote: VoteValue, nextVote: Exclude<VoteValue, null>): ReviewReply[] {
  return nodes.map((node) => {
    if (node.id === replyId) {
      const next = applyVote(node.likes, node.dislikes, currentVote, nextVote);
      return { ...node, dislikes: next.dislikes, likes: next.likes, userVote: next.storedVote };
    }

    if (!node.replies.length) {
      return node;
    }

    return { ...node, replies: updateReplyVote(node.replies, replyId, currentVote, nextVote) };
  });
}

export const EngagementProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isFavorited = useCallback((slug?: string | null) => Boolean(slug && state.favorites[slug]), [state.favorites]);

  const toggleFavorite = useCallback((product: Product) => {
    const slug = getSlug(product);
    if (!slug) {
      return;
    }

    setState((current) => {
      const favorites = { ...current.favorites };
      const metrics = { ...current.metrics };
      const currentMetrics = metrics[slug] || { favoriteBoost: 0, views: 0 };

      if (favorites[slug]) {
        delete favorites[slug];
        metrics[slug] = { ...currentMetrics, favoriteBoost: 0 };
      } else {
        favorites[slug] = product;
        metrics[slug] = { ...currentMetrics, favoriteBoost: 1 };
      }

      return { ...current, favorites, metrics };
    });
  }, []);

  const registerView = useCallback((product: Product) => {
    const slug = getSlug(product);
    if (!slug) {
      return;
    }

    const sessionKey = `viewed_${slug}`;

    try {
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }

      sessionStorage.setItem(sessionKey, '1');
    } catch {
      return;
    }

    setState((current) => ({
      ...current,
      metrics: {
        ...current.metrics,
        [slug]: {
          favoriteBoost: current.metrics[slug]?.favoriteBoost || 0,
          views: (current.metrics[slug]?.views || 0) + 1,
        },
      },
      sessionViewed: {
        ...current.sessionViewed,
        [slug]: true,
      },
    }));
  }, []);

  const addReview = useCallback((slug: string, payload: { author?: string; body: string; rating: number }) => {
    if (!slug || !payload.body.trim()) {
      return;
    }

    const authorName = payload.author?.trim() || 'Nafas Guest';
    const review: ProductReview = {
      authorAvatar: getInitials(authorName),
      authorName,
      createdAt: new Date().toISOString(),
      dislikes: 0,
      id: createId('review'),
      likes: 0,
      parentId: null,
      productId: slug,
      rating: payload.rating,
      replies: [],
      text: payload.body.trim(),
      userVote: null,
    };

    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [slug]: [review, ...(current.reviews[slug] || [])],
      },
    }));
  }, []);

  const addReply = useCallback((slug: string, reviewId: string, payload: { author?: string; body: string }) => {
    if (!slug || !reviewId || !payload.body.trim()) {
      return;
    }

    const authorName = payload.author?.trim() || 'Nafas Guest';
    const reply: ReviewReply = {
      authorAvatar: getInitials(authorName),
      authorName,
      createdAt: new Date().toISOString(),
      dislikes: 0,
      id: createId('reply'),
      likes: 0,
      parentId: reviewId,
      replies: [],
      text: payload.body.trim(),
      userVote: null,
    };

    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [slug]: (current.reviews[slug] || []).map((review) => {
          if (review.id === reviewId) {
            return { ...review, replies: [...review.replies, reply] };
          }

          return { ...review, replies: addNestedReply(review.replies, reviewId, reply) };
        }),
      },
    }));
  }, []);

  const voteReview = useCallback((slug: string, reviewId: string, vote: Exclude<VoteValue, null>) => {
    const voteKey = `vote_${reviewId}`;

    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [slug]: (current.reviews[slug] || []).map((review) => {
          if (review.id !== reviewId) {
            return review;
          }

          const next = applyVote(review.likes, review.dislikes, current.votes[voteKey] || null, vote);
          return { ...review, dislikes: next.dislikes, likes: next.likes, userVote: next.storedVote };
        }),
      },
      votes: {
        ...current.votes,
        [voteKey]: applyVote(0, 0, current.votes[voteKey] || null, vote).storedVote,
      },
    }));
  }, []);

  const voteReply = useCallback((slug: string, reviewId: string, replyId: string, vote: Exclude<VoteValue, null>) => {
    const voteKey = `vote_${replyId}`;

    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [slug]: (current.reviews[slug] || []).map((review) => {
          if (review.id !== reviewId) {
            return review;
          }

          return {
            ...review,
            replies: updateReplyVote(review.replies, replyId, current.votes[voteKey] || null, vote),
          };
        }),
      },
      votes: {
        ...current.votes,
        [voteKey]: applyVote(0, 0, current.votes[voteKey] || null, vote).storedVote,
      },
    }));
  }, []);

  const getReviews = useCallback((slug: string) => state.reviews[slug] || [], [state.reviews]);

  const getProductMetrics = useCallback((product: Product): ProductMetrics => {
    const slug = getSlug(product);
    const metrics = state.metrics[slug] || { favoriteBoost: 0, views: 0 };
    const reviews = state.reviews[slug] || [];
    const fallbackAverage = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    const ratingAverage = Number(product?.rating_average ?? product?.average_rating ?? fallbackAverage);
    const reviewCount = Number(product?.review_count ?? product?.reviews_count ?? reviews.length);
    const favorites = getMetricFromProduct(product, 'favorite') + metrics.favoriteBoost;
    const views = getMetricFromProduct(product, 'view') + metrics.views;
    const score = (favorites * 3.5) + (ratingAverage * 18) + (views * 0.04) + (reviewCount * 2.2);

    return {
      favorites,
      isFavorited: Boolean(state.favorites[slug]),
      ratingAverage,
      reviewCount,
      score,
      views,
    };
  }, [state.favorites, state.metrics, state.reviews]);

  const getScore = useCallback((product: Product) => getProductMetrics(product).score, [getProductMetrics]);

  const getTopProductSlug = useCallback((products: Product[]) => {
    if (!products.length) {
      return null;
    }

    return [...products].sort((left, right) => getScore(right) - getScore(left))[0]?.slug || null;
  }, [getScore]);

  const value = useMemo<EngagementContextValue>(() => ({
    addReply,
    addReview,
    favoriteCount: Object.keys(state.favorites).length,
    favoriteProducts: Object.values(state.favorites),
    favoriteSlugs: Object.keys(state.favorites),
    getProductMetrics,
    getReviews,
    getScore,
    getTopProductSlug,
    isFavorited,
    registerView,
    toggleFavorite,
    voteReply,
    voteReview,
  }), [addReply, addReview, getProductMetrics, getReviews, getScore, getTopProductSlug, isFavorited, registerView, state.favorites, toggleFavorite, voteReply, voteReview]);

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
};

export function useEngagementContext() {
  const context = useContext(EngagementContext);

  if (!context) {
    throw new Error('useEngagement must be used within EngagementProvider.');
  }

  return context;
}

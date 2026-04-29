import React, { useState } from 'react';
import { Eye, Package, Sparkles } from 'lucide-react';
import Product3DViewer from './Product3DViewer';
import ProductGallery from './ProductGallery';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import FavoriteButton from './FavoriteButton';
import { useLocale } from '../context/LocaleContext';
import { formatCurrency } from '../utils/format';

interface ProductDetailEnhancedProps {
  product: any;
  selectedVariant: any;
  quantity: number;
  onVariantChange: (variant: any) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductDetailEnhanced: React.FC<ProductDetailEnhancedProps> = ({
  product,
  selectedVariant,
  quantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
}) => {
  const { locale } = useLocale();
  const [view3D, setView3D] = useState(false);

  const primaryName = locale === 'ar' 
    ? product.name_ar || product.name_en 
    : product.name_en || product.name_ar;
  
  const secondaryName = locale === 'ar' 
    ? product.name_en 
    : product.name_ar;

  const description = locale === 'ar'
    ? product.description_ar || product.description_en || product.description
    : product.description_en || product.description;

  const story = locale === 'ar'
    ? product.story_ar || product.story
    : product.story_en || product.story;

  const notes = locale === 'ar'
    ? product.notes_ar || product.notes
    : product.notes_en || product.notes;

  return (
    <div className="product-detail-enhanced">
      <div className="product-detail-enhanced__layout">
        {/* Media Section */}
        <div className="product-detail-enhanced__media">
          {/* View Toggle */}
          <div className="product-view-toggle">
            <button
              className={`view-toggle-btn ${!view3D ? 'active' : ''}`}
              onClick={() => setView3D(false)}
            >
              <Package size={18} />
              <span>{locale === 'ar' ? 'معرض الصور' : 'Gallery'}</span>
            </button>
            <button
              className={`view-toggle-btn ${view3D ? 'active' : ''}`}
              onClick={() => setView3D(true)}
            >
              <Eye size={18} />
              <span>{locale === 'ar' ? 'عرض 3D' : '3D View'}</span>
            </button>
          </div>

          {/* Media Display */}
          {view3D ? (
            <Product3DViewer
              productName={primaryName}
              productColor={product.color || '#d4af37'}
            />
          ) : (
            <ProductGallery product={product} />
          )}
        </div>

        {/* Info Section */}
        <div className="product-detail-enhanced__info">
          <div className="product-header">
            <div className="product-header__main">
              <h1 className="product-title">{primaryName}</h1>
              {secondaryName && (
                <p className="product-subtitle">{secondaryName}</p>
              )}
            </div>
            <FavoriteButton productId={product.id} />
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className="product-price">
              <span className="product-price__amount">
                {formatCurrency(selectedVariant.retail_price, locale)}
              </span>
              {selectedVariant.size && (
                <span className="product-price__size">
                  {selectedVariant.size}ml
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="product-description">
              <p>{description}</p>
            </div>
          )}

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-section">
              <h3 className="product-section__title">
                {locale === 'ar' ? 'اختر المقاس' : 'Select Size'}
              </h3>
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={onVariantChange}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="product-actions">
            <QuantitySelector
              quantity={quantity}
              onChange={onQuantityChange}
              max={selectedVariant?.stock_quantity || 10}
            />
            <button
              className="ui-button ui-button--primary ui-button--lg product-add-to-cart"
              onClick={onAddToCart}
              disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
            >
              {locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            </button>
          </div>

          {/* Story Section */}
          {story && (
            <div className="product-section product-story">
              <div className="product-section__header">
                <Sparkles size={20} className="section-icon" />
                <h3 className="product-section__title">
                  {locale === 'ar' ? 'القصة' : 'The Story'}
                </h3>
              </div>
              <p>{story}</p>
            </div>
          )}

          {/* Notes Section */}
          {notes && (
            <div className="product-section product-notes">
              <h3 className="product-section__title">
                {locale === 'ar' ? 'النوتات' : 'Fragrance Notes'}
              </h3>
              <div className="product-notes__content">
                {notes.split('\n').map((note: string, index: number) => (
                  <div key={index} className="note-item">
                    <span className="note-bullet">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <Package size={18} />
              <span>{locale === 'ar' ? 'شحن مجاني للطلبات فوق 500 جنيه' : 'Free shipping over 500 EGP'}</span>
            </div>
            <div className="feature-item">
              <Sparkles size={18} />
              <span>{locale === 'ar' ? 'عطور أصلية 100%' : '100% Authentic Perfumes'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;

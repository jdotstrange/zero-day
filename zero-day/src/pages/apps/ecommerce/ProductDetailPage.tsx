import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button } from '@/components/ui'
import { products } from '@/data/ecommerce'
import { useLocale } from '@/i18n'

export default function ProductDetailPage() {
  const { t } = useLocale()
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="p-6">
        <div className="card rounded-xl p-12 text-center">
          <h2 className="heading-4 text-secondary-900 dark:text-white mb-2">
            {t('ecommerce.product_not_found_title')}
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6">
            {t('ecommerce.product_not_found_message')}
          </p>
          <Button asChild>
            <Link to="/app/ecommerce/products">
              <Icon icon={Icons.arrowLeft} width={18} height={18} />
              {t('ecommerce.back_to_products')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)} className="px-0">
          <Icon icon={Icons.arrowLeft} width={20} height={20} />
          <span>{t('common.back')}</span>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/app/ecommerce/products/${product.id}/edit`}>
            <Icon icon={Icons.edit} width={18} height={18} />
            {t('ecommerce.edit_product')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="card rounded-xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
            {/* Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded">
                  {t('common.new')}
                </span>
              )}
              {product.discount && (
                <span className="px-3 py-1 bg-danger-500 text-white text-sm font-medium rounded">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`rounded-xl overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-theme-primary'
                    : 'border-transparent hover:border-surface-300 dark:hover:border-surface-600'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-30 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {/* Category & Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-theme-primary font-medium">
                {product.category}
              </span>
              <span className="text-sm text-secondary-400">•</span>
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                {product.brand}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="heading-2 text-secondary-900 dark:text-white mb-3">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    icon={Icons.star}
                    width={18}
                    height={18}
                    className={
                      i < Math.floor(product.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-secondary-300 dark:text-secondary-600'
                    }
                  />
                ))}
                <span className="text-sm font-medium text-secondary-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                ({t('ecommerce.reviews_count', { count: product.reviews })})
              </span>
              {product.sold && (
                <>
                  <span className="text-secondary-400">•</span>
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">
                    {t('ecommerce.sold_count', { count: product.sold })}
                  </span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="heading-1 text-secondary-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.discount && (
                <>
                  <span className="text-xl text-secondary-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 text-sm font-medium rounded">
                    {t('ecommerce.save_percent', { discount: product.discount })}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-success-500 font-medium">{t('ecommerce.in_stock')}</span>
                  <span className="text-sm text-secondary-400">
                    ({t('ecommerce.units_available', { count: product.stock })})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                  <span className="text-sm text-danger-500 font-medium">{t('ecommerce.out_of_stock')}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
                {t('ecommerce.color')}: <span className="font-normal text-secondary-600 dark:text-secondary-400">{selectedColor}</span>
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    size="sm"
                    variant={selectedColor === color ? 'primary' : 'secondary'}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
                {t('ecommerce.size')}: <span className="font-normal text-secondary-600 dark:text-secondary-400">{selectedSize}</span>
              </h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    size="sm"
                    variant={selectedSize === size ? 'primary' : 'secondary'}
                    onClick={() => setSelectedSize(size)}
                    className="h-12 w-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-3">
              {t('ecommerce.quantity')}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="rounded-none rounded-s-lg"
                >
                  <Icon icon={Icons.minus} width={18} height={18} />
                </Button>
                <span className="px-6 py-3 text-sm font-medium text-secondary-900 dark:text-white">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="rounded-none rounded-e-lg"
                >
                  <Icon icon={Icons.plus} width={18} height={18} />
                </Button>
              </div>
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('ecommerce.available_count', { count: product.stock })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="button" size="lg" fullWidth disabled={product.stock === 0} className="flex-1">
              <Icon icon={Icons.shopping} />
              {t('ecommerce.add_to_cart')}
            </Button>
            <Button type="button" variant="outline" size="lg" iconOnly aria-label="Add to wishlist">
              <Icon icon={Icons.heart} className="text-secondary-600 dark:text-secondary-400" />
            </Button>
            <Button type="button" variant="outline" size="lg" iconOnly aria-label="Share">
              <Icon icon={Icons.share} className="text-secondary-600 dark:text-secondary-400" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Icon icon={Icons.truck} width={20} height={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('ecommerce.feature.free_shipping_title')}</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">{t('ecommerce.feature.free_shipping_subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Icon icon={Icons.refresh} width={20} height={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('ecommerce.feature.easy_returns_title')}</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">{t('ecommerce.feature.easy_returns_subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Icon icon={Icons.shield} width={20} height={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('ecommerce.feature.secure_payment_title')}</p>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">{t('ecommerce.feature.secure_payment_subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card rounded-xl p-6">
        <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
          <div className="flex gap-6">
            <button className="pb-3 border-b-2 border-theme-primary text-theme-primary font-medium text-sm">
              {t('ecommerce.tab.specifications')}
            </button>
            <button className="pb-3 border-b-2 border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white font-medium text-sm transition-colors">
              {t('ecommerce.tab.reviews')} ({product.reviews})
            </button>
            <button className="pb-3 border-b-2 border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white font-medium text-sm transition-colors">
              {t('ecommerce.tab.shipping_info')}
            </button>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="heading-5 text-secondary-900 dark:text-white mb-4">
              {t('ecommerce.product_specifications')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">
                      {spec.label}
                    </p>
                    <p className="text-sm text-secondary-900 dark:text-white font-medium">
                      {spec.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-secondary-500 dark:text-secondary-400 mb-1">SKU</p>
              <p className="font-medium text-secondary-900 dark:text-white">{product.sku}</p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400 mb-1">{t('ecommerce.category')}</p>
              <p className="font-medium text-secondary-900 dark:text-white">{product.category}</p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400 mb-1">{t('ecommerce.brand')}</p>
              <p className="font-medium text-secondary-900 dark:text-white">{product.brand}</p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400 mb-1">{t('ecommerce.tags')}</p>
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

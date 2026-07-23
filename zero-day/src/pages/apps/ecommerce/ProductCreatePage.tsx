import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button, Checkbox, FormField, Input, Select, Textarea } from '@/components/ui'
import { products, categories } from '@/data/ecommerce'
import { useLocale } from '@/i18n'

export default function ProductCreatePage() {
  const { t } = useLocale()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id
  const existingProduct = isEditMode ? products.find((p) => p.id === id) : null

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price || 0,
    originalPrice: existingProduct?.originalPrice || 0,
    category: existingProduct?.category || categories[0],
    brand: existingProduct?.brand || '',
    stock: existingProduct?.stock || 0,
    sku: existingProduct?.sku || '',
    tags: existingProduct?.tags?.join(', ') || '',
    colors: existingProduct?.colors?.join(', ') || '',
    sizes: existingProduct?.sizes?.join(', ') || '',
    isFeatured: existingProduct?.isFeatured || false,
    isNew: existingProduct?.isNew || false,
  })

  const [specifications, setSpecifications] = useState(
    existingProduct?.specifications || [{ label: '', value: '' }]
  )

  const [images, setImages] = useState<string[]>(existingProduct?.images || [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { label: '', value: '' }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const updateSpecification = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specifications]
    updated[index][field] = value
    setSpecifications(updated)
  }

  const addImage = () => {
    const url = prompt(t('ecommerce.enter_image_url_prompt'))
    if (url) {
      setImages([...images, url])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t('ecommerce.validation.name_required')
    if (!formData.description.trim()) newErrors.description = t('ecommerce.validation.description_required')
    if (formData.price <= 0) newErrors.price = t('ecommerce.validation.price_positive')
    if (formData.stock < 0) newErrors.stock = t('ecommerce.validation.stock_non_negative')
    if (!formData.brand.trim()) newErrors.brand = t('ecommerce.validation.brand_required')
    if (!formData.sku.trim()) newErrors.sku = t('ecommerce.validation.sku_required')
    if (images.length === 0) newErrors.images = t('ecommerce.validation.images_required')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    // In real app, this would be an API call to save:
    // - formData with parsed tags, colors, sizes
    // - specifications filtered for non-empty entries
    // - images array with first image as thumbnail

    alert(isEditMode ? t('ecommerce.alert_product_updated') : t('ecommerce.alert_product_created'))
    navigate('/app/ecommerce/products')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)} className="px-0">
            <Icon icon={Icons.arrowLeft} width={20} height={20} />
            <span>{t('common.back')}</span>
          </Button>
          <div>
            <h1 className="heading-3 text-secondary-900 dark:text-white">
              {isEditMode ? t('ecommerce.edit_product_title') : t('ecommerce.create_product_title')}
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {isEditMode
                ? t('ecommerce.edit_description')
                : t('ecommerce.create_description')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
                {t('ecommerce.basic_information')}
              </h2>
              <div className="space-y-4">
                <FormField label={t('ecommerce.product_name')} required error={errors.name}>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    placeholder={t('ecommerce.product_name_placeholder')}
                  />
                </FormField>

                <FormField label={t('ecommerce.description')} required error={errors.description}>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    error={!!errors.description}
                    placeholder={t('ecommerce.description_placeholder')}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label={t('ecommerce.brand')} required error={errors.brand}>
                    <Input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      error={!!errors.brand}
                      placeholder={t('ecommerce.brand_placeholder')}
                    />
                  </FormField>

                  <FormField label={t('ecommerce.sku')} required error={errors.sku}>
                    <Input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      error={!!errors.sku}
                      placeholder={t('ecommerce.sku_example_placeholder')}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
                {t('ecommerce.pricing_inventory')}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <FormField label={t('ecommerce.price')} required error={errors.price}>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    prefix={<span className="text-sm font-medium text-secondary-500">$</span>}
                    error={!!errors.price}
                  />
                </FormField>

                <FormField label={t('ecommerce.original_price')}>
                  <Input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    prefix={<span className="text-sm font-medium text-secondary-500">$</span>}
                  />
                </FormField>

                <FormField label={t('ecommerce.stock')} required error={errors.stock}>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    error={!!errors.stock}
                  />
                </FormField>
              </div>
            </div>

            {/* Product Images */}
            <div className="card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  {t('ecommerce.product_images')} *
                </h2>
                <Button type="button" size="sm" onClick={addImage}>
                  <Icon icon={Icons.plus} width={16} height={16} />
                  {t('ecommerce.add_image')}
                </Button>
              </div>

              {errors.images && (
                <p className="mb-4 text-sm text-danger-500">{errors.images}</p>
              )}

              {images.length === 0 ? (
                <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-12 text-center">
                  <Icon icon={Icons.upload} width={48} height={48} className="mx-auto text-secondary-400 mb-3" />
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">
                    {t('ecommerce.no_images_added')}
                  </p>
                  <p className="text-xs text-secondary-400 mb-4">
                    {t('ecommerce.no_images_added_hint')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={t('ecommerce.product_image_alt', { index: index + 1 })}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Icon icon={Icons.x} width={16} height={16} />
                      </Button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                          {t('ecommerce.thumbnail')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  {t('ecommerce.tab.specifications')}
                </h2>
                <Button type="button" variant="secondary" size="sm" onClick={addSpecification}>
                  <Icon icon={Icons.plus} width={16} height={16} />
                  {t('ecommerce.add_spec')}
                </Button>
              </div>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        updateSpecification(index, 'label', e.target.value)
                      }
                      placeholder={t('ecommerce.spec_label_placeholder')}
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(index, 'value', e.target.value)
                      }
                      placeholder={t('ecommerce.spec_value_placeholder')}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="text-danger-500 hover:text-danger-600"
                    >
                      <Icon icon={Icons.trash} width={18} height={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <div className="card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                {t('ecommerce.category')}
              </h3>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            {/* Variants */}
            <div className="card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                {t('ecommerce.product_variants')}
              </h3>
              <div className="space-y-4">
                <FormField label={t('ecommerce.colors')} hint={t('common.separate_with_commas')}>
                  <Input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    placeholder={t('ecommerce.colors_placeholder')}
                  />
                </FormField>

                <FormField label={t('ecommerce.sizes')} hint={t('common.separate_with_commas')}>
                  <Input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleInputChange}
                    placeholder={t('ecommerce.sizes_placeholder')}
                  />
                </FormField>
              </div>
            </div>

            {/* Tags */}
            <div className="card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                {t('ecommerce.tags')}
              </h3>
              <FormField label={t('ecommerce.tags')} hint={t('common.separate_with_commas')}>
                <Input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder={t('ecommerce.tags_placeholder')}
                />
              </FormField>
            </div>

            {/* Product Status */}
            <div className="card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                {t('ecommerce.product_status')}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-secondary-900 dark:text-white">
                    {t('ecommerce.featured_product')}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-secondary-900 dark:text-white">
                    {t('ecommerce.new_arrival')}
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" fullWidth size="lg">
                <Icon icon={Icons.deviceFloppy} width={20} height={20} />
                {isEditMode ? t('ecommerce.update_product') : t('ecommerce.create_product')}
              </Button>
              <Button asChild variant="secondary" fullWidth size="lg">
                <Link to="/app/ecommerce/products">{t('common.cancel')}</Link>
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  variant="danger"
                  fullWidth
                  size="lg"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Icon icon={Icons.trash} width={20} height={20} />
                  {t('ecommerce.delete_product')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && existingProduct && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl animate-fade-in p-6">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} width={28} height={28} className="text-danger-600 dark:text-danger-400" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white text-center mb-2">
              {t('ecommerce.delete_product')}
            </h3>

            {/* Message */}
            <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center mb-6">
              {t('ecommerce.delete_product_confirm_message', { name: existingProduct.name })}
            </p>

            {/* Product Preview */}
            <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl mb-6">
              <img
                src={existingProduct.thumbnail}
                alt={existingProduct.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {existingProduct.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {t('ecommerce.sku')}: {existingProduct.sku}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="danger"
                fullWidth
                onClick={() => {
                  navigate('/app/ecommerce/products')
                }}
              >
                {t('ecommerce.delete_product')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button, FormField, Input, Select } from '@/components/ui'
import { mockCartItems, shippingMethods, paymentMethods } from '@/data/ecommerce'
import { useLocale } from '@/i18n'

export default function CheckoutPage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id)
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id)
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [orderNumber, setOrderNumber] = useState<string>('')

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  })

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change
          if (newQuantity >= 1 && newQuantity <= item.product.stock) {
            return { ...item, quantity: newQuantity }
          }
        }
        return item
      })
    )
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * 0.08 // 8% tax
  const shipping = shippingMethods.find((s) => s.id === selectedShipping)?.price || 0
  const total = subtotal + tax + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderNumber(`ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`)
    setStep('success')
    setTimeout(() => {
      navigate('/app/ecommerce/products')
    }, 3000)
  }

  if (step === 'success') {
    return (
      <div>
        <div className="max-w-2xl mx-auto">
          <div className="card rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon={Icons.check} width={40} height={40} className="text-success-500" />
            </div>
            <h1 className="heading-2 text-secondary-900 dark:text-white mb-3">
              {t('ecommerce.order_success_title')}
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mb-2">
              {t('ecommerce.order_success_message')}
            </p>
            <p className="text-sm text-secondary-400 mb-8">
              {t('ecommerce.order_number', { orderNumber })}
            </p>
            <div className="space-y-3">
              <Button asChild fullWidth size="lg">
                <Link to="/app/ecommerce/products">{t('ecommerce.continue_shopping')}</Link>
              </Button>
              <Button variant="secondary" fullWidth size="lg" onClick={() => navigate('/dashboard')}>
                {t('ecommerce.go_dashboard')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/app/ecommerce/products"
            className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
          >
            <Icon icon={Icons.arrowLeft} width={20} height={20} />
            <span className="text-sm font-medium">{t('ecommerce.continue_shopping')}</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 'cart'
                ? 'bg-theme-primary text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span className="text-sm font-medium">{t('ecommerce.step_cart')}</span>
          </div>
          <div className="w-8 h-0.5 bg-surface-200 dark:bg-surface-700"></div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 'checkout'
                ? 'bg-theme-primary text-white'
                : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span className="text-sm font-medium">{t('ecommerce.step_checkout')}</span>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card rounded-xl p-12 text-center">
          <h2 className="heading-4 text-secondary-900 dark:text-white mb-2">
            {t('ecommerce.cart_empty')}
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-6">
            {t('ecommerce.cart_empty_desc')}
          </p>
          <Button asChild size="lg">
            <Link to="/app/ecommerce/products">{t('ecommerce.browse_products')}</Link>
          </Button>
        </div>
      ) : step === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card rounded-xl p-6">
              <h2 className="heading-4 text-secondary-900 dark:text-white mb-6">
                {t('ecommerce.shopping_cart')} ({t('ecommerce.items_count', { count: cartItems.length })})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg"
                  >
                    {/* Image */}
                    <Link
                      to={`/app/ecommerce/products/${item.product.id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/app/ecommerce/products/${item.product.id}`}>
                        <h3 className="text-ui font-semibold text-secondary-900 dark:text-white hover:text-theme-primary transition-colors mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">
                        {item.product.brand}
                      </p>
                      {item.selectedColor && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {t('ecommerce.color')}: {item.selectedColor}
                        </p>
                      )}
                      {item.selectedSize && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {t('ecommerce.size')}: {item.selectedSize}
                        </p>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-secondary-400 hover:text-danger-500"
                      >
                        <Icon icon={Icons.trash} width={18} height={18} />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1"
                        >
                          <Icon icon={Icons.minus} width={16} height={16} />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-secondary-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1"
                        >
                          <Icon icon={Icons.plus} width={16} height={16} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-secondary-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-secondary-400">
                          ${item.product.price.toFixed(2)} {t('ecommerce.each')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card rounded-xl p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
                {t('ecommerce.order_summary')}
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600 dark:text-secondary-400">
                    {t('ecommerce.subtotal')} ({t('ecommerce.items_count', { count: cartItems.length })})
                  </span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600 dark:text-secondary-400">{t('ecommerce.shipping')}</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600 dark:text-secondary-400">{t('ecommerce.tax_with_rate', { rate: 8 })}</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {t('ecommerce.total')}
                    </span>
                    <span className="heading-3 text-theme-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button type="button" fullWidth size="lg" onClick={() => setStep('checkout')}>
                {t('ecommerce.proceed_checkout')}
              </Button>
              <Button asChild variant="secondary" fullWidth size="lg" className="mt-3">
                <Link to="/app/ecommerce/products">{t('ecommerce.continue_shopping')}</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Checkout Form
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-theme-primary/10 rounded-lg">
                    <Icon icon={Icons.truck} width={20} height={20} className="text-theme-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    {t('ecommerce.shipping_information')}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label={t('ecommerce.first_name')}>
                    <Input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.last_name')}>
                    <Input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.email')}>
                    <Input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.phone')}>
                    <Input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.address')} className="col-span-2">
                    <Input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.city')}>
                    <Input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.state')}>
                    <Input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.zip_code')}>
                    <Input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </FormField>
                  <FormField label={t('ecommerce.country')}>
                    <Select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </Select>
                  </FormField>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                  {t('ecommerce.shipping_method')}
                </h3>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedShipping === method.id
                          ? 'border-theme-primary bg-theme-primary/5'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={selectedShipping === method.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="w-4 h-4 text-theme-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {method.name}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-secondary-900 dark:text-white">
                        ${method.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-theme-primary/10 rounded-lg">
                    <Icon icon={Icons.creditCard} width={20} height={20} className="text-theme-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {t('ecommerce.payment_method')}
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        selectedPayment === method.id
                          ? 'border-theme-primary bg-theme-primary/5'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      }`}
                    >
                      <Icon icon={Icons.creditCard} width={24} height={24} className="mx-auto mb-2 text-secondary-600 dark:text-secondary-400" />
                      <p className="text-xs font-medium text-secondary-900 dark:text-white">
                        {method.name}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-3 bg-surface-100 dark:bg-surface-800 rounded-lg">
                  <Icon icon={Icons.lock} width={16} height={16} className="text-theme-primary" />
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    {t('ecommerce.secure_payment_message')}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card rounded-xl p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
                  {t('ecommerce.order_summary')}
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {t('ecommerce.subtotal')} ({t('ecommerce.items_count', { count: cartItems.length })})
                    </span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">{t('ecommerce.shipping')}</span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">{t('ecommerce.tax_with_rate', { rate: 8 })}</span>
                    <span className="font-medium text-secondary-900 dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {t('ecommerce.total')}
                      </span>
                      <span className="heading-3 text-theme-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button type="submit" fullWidth size="lg">
                  {t('ecommerce.place_order')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  size="lg"
                  className="mt-3"
                  onClick={() => setStep('cart')}
                >
                  {t('ecommerce.back_to_cart')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

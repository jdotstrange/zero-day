export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  brand: string
  images: string[]
  thumbnail: string
  rating: number
  reviews: number
  stock: number
  sku: string
  tags: string[]
  colors?: string[]
  sizes?: string[]
  specifications?: { label: string; value: string }[]
  isFeatured?: boolean
  isNew?: boolean
  sold?: number
  status?: 'active' | 'low-stock' | 'out-of-stock'
  createdAt: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: string
  email: string
  phone?: string
  total: number
  items: number
  status: 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled'
  date: string
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  subtotal?: number
  tax?: number
  shipping?: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
}

export const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for travel, work, or relaxation.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: 'Electronics',
    brand: 'AudioTech',
    thumbnail: '/assets/products/product_1.webp',
    images: [
      '/assets/products/product_1.webp',
      '/assets/products/product_1-1.webp',
      '/assets/products/product_1-2.webp',
    ],
    rating: 4.8,
    reviews: 342,
    stock: 45,
    sku: 'ANC-WH-001',
    tags: ['wireless', 'noise-cancelling', 'bluetooth', 'headphones'],
    colors: ['Black', 'Silver', 'Navy Blue'],
    specifications: [
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery Life', value: '30 hours' },
      { label: 'Charging Time', value: '2 hours' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '2 years' },
    ],
    isFeatured: true,
    isNew: false,
    sold: 234,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Smart Watch Pro Series 6',
    description:
      'Advanced smartwatch with health tracking, GPS, water resistance, and customizable watch faces. Stay connected and track your fitness goals.',
    price: 449.99,
    category: 'Electronics',
    brand: 'TechWear',
    thumbnail: '/assets/products/product_2.webp',
    images: [
      '/assets/products/product_2.webp',
      '/assets/products/product_2-1.webp',
      '/assets/products/product_2-2.webp',
    ],
    rating: 4.6,
    reviews: 189,
    stock: 78,
    sku: 'SW-PRO-006',
    tags: ['smartwatch', 'fitness', 'gps', 'waterproof'],
    colors: ['Black', 'Silver', 'Gold', 'Rose Gold'],
    specifications: [
      { label: 'Display', value: '1.9" AMOLED' },
      { label: 'Battery Life', value: 'Up to 7 days' },
      { label: 'Water Resistance', value: '5ATM' },
      { label: 'Sensors', value: 'Heart rate, GPS, SpO2' },
    ],
    isFeatured: true,
    isNew: true,
    sold: 456,
    status: 'active',
    createdAt: '2024-03-01',
  },
  {
    id: '3',
    name: 'Ultra HD 4K Smart TV 55"',
    description:
      'Immersive 55-inch 4K UHD Smart TV with HDR support, built-in streaming apps, and voice control. Experience cinema-quality entertainment at home.',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: 'Electronics',
    brand: 'VisionPlus',
    thumbnail: '/assets/products/product_3.webp',
    images: [
      '/assets/products/product_3.webp',
      '/assets/products/product_3-1.webp',
      '/assets/products/product_3-2.webp',
    ],
    rating: 4.7,
    reviews: 256,
    stock: 12,
    sku: 'TV-55-4K-001',
    tags: ['tv', '4k', 'smart tv', 'hdr'],
    specifications: [
      { label: 'Screen Size', value: '55 inches' },
      { label: 'Resolution', value: '3840 x 2160 (4K UHD)' },
      { label: 'HDR', value: 'HDR10, Dolby Vision' },
      { label: 'Refresh Rate', value: '120Hz' },
      { label: 'Smart Platform', value: 'Android TV' },
    ],
    isFeatured: true,
    isNew: false,
    sold: 123,
    status: 'low-stock',
    createdAt: '2023-11-20',
  },
  {
    id: '4',
    name: 'Leather Messenger Bag',
    description:
      'Handcrafted genuine leather messenger bag with multiple compartments. Perfect for work, travel, or everyday use. Ages beautifully over time.',
    price: 189.99,
    category: 'Fashion',
    brand: 'Leather Co.',
    thumbnail: '/assets/products/product_4.webp',
    images: [
      '/assets/products/product_4.webp',
      '/assets/products/product_4-1.webp',
      '/assets/products/product_4-2.webp',
    ],
    rating: 4.9,
    reviews: 127,
    stock: 34,
    sku: 'BAG-LTH-MSG-001',
    tags: ['bag', 'leather', 'messenger', 'work'],
    colors: ['Brown', 'Black', 'Tan'],
    specifications: [
      { label: 'Material', value: 'Genuine Leather' },
      { label: 'Dimensions', value: '15" x 11" x 4"' },
      { label: 'Laptop Compartment', value: 'Up to 15 inch' },
      { label: 'Pockets', value: '5 interior, 2 exterior' },
    ],
    isNew: false,
    sold: 89,
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Running Shoes Pro',
    description:
      'Professional running shoes with advanced cushioning technology and breathable mesh. Designed for performance and comfort during long-distance runs.',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    category: 'Sports & Outdoors',
    brand: 'RunFast',
    thumbnail: '/assets/products/product_5.webp',
    images: [
      '/assets/products/product_5.webp',
      '/assets/products/product_5-1.webp',
      '/assets/products/product_5-2.webp',
    ],
    rating: 4.5,
    reviews: 423,
    stock: 156,
    sku: 'SHOE-RUN-PRO-001',
    tags: ['shoes', 'running', 'sports', 'fitness'],
    colors: ['Black/White', 'Navy/Red', 'Grey/Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    specifications: [
      { label: 'Upper Material', value: 'Breathable Mesh' },
      { label: 'Sole Type', value: 'Rubber with cushioning' },
      { label: 'Weight', value: '280g (per shoe)' },
      { label: 'Recommended For', value: 'Road running' },
    ],
    isNew: false,
    sold: 892,
    status: 'active',
    createdAt: '2024-01-05',
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse',
    description:
      'High-precision wireless gaming mouse with RGB lighting, programmable buttons, and up to 20,000 DPI. Dominate your games with zero lag.',
    price: 79.99,
    category: 'Electronics',
    brand: 'GameGear',
    thumbnail: '/assets/products/product_6.webp',
    images: [
      '/assets/products/product_6.webp',
      '/assets/products/product_6-1.webp',
    ],
    rating: 4.6,
    reviews: 312,
    stock: 89,
    sku: 'MOUSE-GM-WL-001',
    tags: ['mouse', 'gaming', 'wireless', 'rgb'],
    specifications: [
      { label: 'DPI Range', value: '100 - 20,000' },
      { label: 'Buttons', value: '8 programmable' },
      { label: 'Battery Life', value: 'Up to 70 hours' },
      { label: 'Connectivity', value: '2.4GHz wireless + Bluetooth' },
    ],
    isNew: true,
    sold: 245,
    status: 'active',
    createdAt: '2024-03-15',
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    description:
      'Extra thick, non-slip yoga mat with alignment marks. Eco-friendly material, perfect for yoga, pilates, and floor exercises.',
    price: 49.99,
    category: 'Sports & Outdoors',
    brand: 'ZenFit',
    thumbnail: '/assets/products/product_7.webp',
    images: [
      '/assets/products/product_7.webp',
      '/assets/products/product_7-1.webp',
      '/assets/products/product_7-2.webp',
    ],
    rating: 4.7,
    reviews: 178,
    stock: 203,
    sku: 'YM-PREM-001',
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    colors: ['Purple', 'Blue', 'Pink', 'Green'],
    specifications: [
      { label: 'Thickness', value: '6mm' },
      { label: 'Dimensions', value: '72" x 24"' },
      { label: 'Material', value: 'TPE (eco-friendly)' },
      { label: 'Weight', value: '1.2kg' },
    ],
    isNew: false,
    sold: 567,
    status: 'active',
    createdAt: '2023-12-01',
  },
  {
    id: '8',
    name: 'Coffee Maker Pro 2000',
    description:
      'Programmable coffee maker with built-in grinder, brew strength control, and thermal carafe. Wake up to fresh coffee every morning.',
    price: 149.99,
    category: 'Home & Garden',
    brand: 'BrewMaster',
    thumbnail: '/assets/products/product_8.webp',
    images: [
      '/assets/products/product_8.webp',
      '/assets/products/product_8-1.webp',
      '/assets/products/product_8-2.webp',
    ],
    rating: 4.4,
    reviews: 267,
    stock: 0,
    sku: 'CM-PRO-2000',
    tags: ['coffee', 'maker', 'kitchen', 'appliance'],
    specifications: [
      { label: 'Capacity', value: '12 cups' },
      { label: 'Grinder', value: 'Built-in burr grinder' },
      { label: 'Carafe Type', value: 'Thermal stainless steel' },
      { label: 'Timer', value: '24-hour programmable' },
    ],
    isNew: false,
    sold: 189,
    status: 'out-of-stock',
    createdAt: '2024-01-20',
  },
  {
    id: '9',
    name: 'Bluetooth Portable Speaker',
    description:
      '360-degree sound portable Bluetooth speaker with waterproof design. Perfect for outdoor adventures and pool parties.',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: 'Electronics',
    brand: 'SoundWave',
    thumbnail: '/assets/products/product_9.webp',
    images: [
      '/assets/products/product_9.webp',
      '/assets/products/product_9-1.webp',
    ],
    rating: 4.5,
    reviews: 198,
    stock: 67,
    sku: 'SPK-BT-360-001',
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
    colors: ['Black', 'Blue', 'Red', 'Green'],
    specifications: [
      { label: 'Battery Life', value: '12 hours' },
      { label: 'Water Resistance', value: 'IPX7' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Output Power', value: '20W' },
    ],
    isNew: true,
    sold: 345,
    status: 'active',
    createdAt: '2024-02-28',
  },
  {
    id: '10',
    name: 'USB-C Charging Hub',
    description:
      'Multi-port USB-C hub with 4K HDMI output, SD card reader, and fast charging. Essential accessory for modern laptops.',
    price: 59.99,
    category: 'Electronics',
    brand: 'TechConnect',
    thumbnail: '/assets/products/product_10.webp',
    images: [
      '/assets/products/product_10.webp',
      '/assets/products/product_10-1.webp',
    ],
    rating: 4.7,
    reviews: 284,
    stock: 142,
    sku: 'HUB-USBC-7IN1',
    tags: ['usb-c', 'hub', 'adapter', 'accessory'],
    specifications: [
      { label: 'Ports', value: '7-in-1' },
      { label: 'HDMI Output', value: '4K@60Hz' },
      { label: 'Data Transfer', value: 'Up to 5Gbps' },
      { label: 'Power Delivery', value: '100W' },
    ],
    isNew: false,
    sold: 567,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '11',
    name: 'Wireless Charging Pad',
    description:
      'Fast wireless charging pad with non-slip surface. Compatible with all Qi-enabled devices. LED indicator shows charging status.',
    price: 34.99,
    category: 'Electronics',
    brand: 'ChargeFast',
    thumbnail: '/assets/products/product_11.webp',
    images: [
      '/assets/products/product_11.webp',
      '/assets/products/product_11-1.webp',
    ],
    rating: 4.4,
    reviews: 156,
    stock: 234,
    sku: 'CHG-WRL-QI-001',
    tags: ['wireless', 'charging', 'qi', 'fast-charge'],
    colors: ['Black', 'White'],
    specifications: [
      { label: 'Output Power', value: '15W max' },
      { label: 'Input', value: 'USB-C' },
      { label: 'Safety', value: 'Over-charge protection' },
      { label: 'Compatibility', value: 'All Qi devices' },
    ],
    isNew: false,
    sold: 892,
    status: 'active',
    createdAt: '2023-12-15',
  },
  {
    id: '12',
    name: 'HD Webcam with Microphone',
    description:
      '1080p HD webcam with built-in dual microphones and auto-focus. Perfect for video calls, streaming, and content creation.',
    price: 79.99,
    category: 'Electronics',
    brand: 'StreamPro',
    thumbnail: '/assets/products/product_12.webp',
    images: [
      '/assets/products/product_12.webp',
      '/assets/products/product_12-1.webp',
      '/assets/products/product_12-2.webp',
    ],
    rating: 4.6,
    reviews: 312,
    stock: 89,
    sku: 'CAM-HD-1080-001',
    tags: ['webcam', 'streaming', 'video-call', 'hd'],
    specifications: [
      { label: 'Resolution', value: '1080p@30fps' },
      { label: 'Field of View', value: '90 degrees' },
      { label: 'Microphones', value: 'Dual built-in' },
      { label: 'Focus', value: 'Auto-focus' },
    ],
    isNew: true,
    sold: 234,
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '13',
    name: 'External SSD Drive 1TB',
    description:
      'Ultra-fast portable SSD with USB 3.2 Gen 2 interface. Compact aluminum design with read speeds up to 1050MB/s.',
    price: 139.99,
    originalPrice: 179.99,
    discount: 22,
    category: 'Electronics',
    brand: 'DataSpeed',
    thumbnail: '/assets/products/product_13.webp',
    images: [
      '/assets/products/product_13.webp',
      '/assets/products/product_13-1.webp',
      '/assets/products/product_13-2.webp',
    ],
    rating: 4.8,
    reviews: 445,
    stock: 156,
    sku: 'SSD-EXT-1TB-001',
    tags: ['ssd', 'storage', 'portable', 'external'],
    specifications: [
      { label: 'Capacity', value: '1TB' },
      { label: 'Interface', value: 'USB 3.2 Gen 2' },
      { label: 'Read Speed', value: 'Up to 1050MB/s' },
      { label: 'Write Speed', value: 'Up to 1000MB/s' },
      { label: 'Dimensions', value: '95 x 52 x 9mm' },
    ],
    isNew: false,
    sold: 678,
    status: 'active',
    createdAt: '2024-01-25',
  },
]

export const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    product: products[0],
    quantity: 1,
    selectedColor: 'Black',
  },
  {
    id: 'cart-2',
    product: products[4],
    quantity: 2,
    selectedColor: 'Navy/Red',
    selectedSize: '10',
  },
]

export const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 10.0,
    estimatedDays: '5-7 days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 25.0,
    estimatedDays: '2-3 days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    price: 45.0,
    estimatedDays: '1 day',
  },
]

export const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'paypal', name: 'PayPal', icon: 'brand-paypal' },
  { id: 'stripe', name: 'Stripe', icon: 'brand-stripe' },
]

export const orders: Order[] = [
  { 
    id: 'ORD-2847', 
    orderNumber: 'ORD-2024-002847',
    customer: 'Emma Wilson', 
    email: 'emma@example.com', 
    phone: '+1 234 567 8900',
    total: 428.50, 
    items: 3, 
    status: 'delivered', 
    date: 'Today, 2:30 PM',
    subtotal: 399.50,
    tax: 19.00,
    shipping: 10.00,
  },
  { 
    id: 'ORD-2846', 
    orderNumber: 'ORD-2024-002846',
    customer: 'James Brown', 
    email: 'james@example.com', 
    phone: '+1 234 567 8901',
    total: 1299.00, 
    items: 1, 
    status: 'shipped', 
    date: 'Today, 11:15 AM',
    subtotal: 1199.00,
    tax: 75.00,
    shipping: 25.00,
  },
  { 
    id: 'ORD-2845', 
    orderNumber: 'ORD-2024-002845',
    customer: 'Olivia Davis', 
    email: 'olivia@example.com', 
    phone: '+1 234 567 8902',
    total: 89.99, 
    items: 2, 
    status: 'processing', 
    date: 'Yesterday',
    subtotal: 74.99,
    tax: 5.00,
    shipping: 10.00,
  },
  { 
    id: 'ORD-2844', 
    orderNumber: 'ORD-2024-002844',
    customer: 'William Taylor', 
    email: 'william@example.com', 
    phone: '+1 234 567 8903',
    total: 567.00, 
    items: 4, 
    status: 'pending', 
    date: 'Yesterday',
    subtotal: 525.00,
    tax: 32.00,
    shipping: 10.00,
  },
]

export const orderStatusConfig: Record<string, { color: string; bg: string }> = {
  delivered: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  shipped: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  processing: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  pending: { color: 'text-secondary-500', bg: 'bg-surface-100 dark:bg-surface-800' },
}

export const stockStatusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'text-green-600', label: 'In Stock' },
  'low-stock': { color: 'text-orange-600', label: 'Low Stock' },
  'out-of-stock': { color: 'text-red-600', label: 'Out of Stock' },
}

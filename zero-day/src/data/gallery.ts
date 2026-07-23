/**
 * Gallery Data
 * Mock data for the gallery page
 */

export interface GalleryImage {
  id: number
  src: string
  category: 'technology' | 'abstract' | 'decor' | 'food' | 'architecture' | 'nature' | 'product' | 'lifestyle'
  title: string
  photographer?: string
  description?: string
}

export type GalleryCategory = 'all' | GalleryImage['category']

export const galleryCategories: GalleryCategory[] = [
  'all',
  'technology',
  'abstract',
  'decor',
  'food',
  'architecture',
  'nature',
  'product',
  'lifestyle'
]

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: '/assets/gallery/gallery_1.webp',
    category: 'technology',
    title: 'Minimal Workspace',
    photographer: 'Alex Chen',
    description: 'Ultra-minimalist workspace with clean white marble desk'
  },
  {
    id: 2,
    src: '/assets/gallery/gallery_2.webp',
    category: 'abstract',
    title: 'Abstract Gradient',
    photographer: 'Sarah Miller',
    description: 'Soft pastel gradient with flowing silk-like waves'
  },
  {
    id: 3,
    src: '/assets/gallery/gallery_3.webp',
    category: 'decor',
    title: 'Ceramic Pottery',
    photographer: 'James Wilson',
    description: 'Handcrafted ceramic vase collection on white shelf'
  },
  {
    id: 4,
    src: '/assets/gallery/gallery_4.webp',
    category: 'food',
    title: 'Morning Coffee',
    photographer: 'Emma Davis',
    description: 'Aesthetic flat lay of coffee on light marble surface'
  },
  {
    id: 5,
    src: '/assets/gallery/gallery_5.webp',
    category: 'architecture',
    title: 'Modern Architecture',
    photographer: 'Michael Brown',
    description: 'Sleek modern white building with geometric patterns'
  },
  {
    id: 6,
    src: '/assets/gallery/gallery_6.webp',
    category: 'nature',
    title: 'Botanical Leaves',
    photographer: 'Lisa Wang',
    description: 'Single monstera leaf on pure white background'
  },
  {
    id: 7,
    src: '/assets/gallery/gallery_7.webp',
    category: 'decor',
    title: 'Designer Chair',
    photographer: 'David Lee',
    description: 'Iconic mid-century modern chair in soft pink'
  },
  {
    id: 8,
    src: '/assets/gallery/gallery_8.webp',
    category: 'product',
    title: 'Skincare Products',
    photographer: 'Rachel Green',
    description: 'Luxury skincare bottles on white marble slab'
  },
  {
    id: 9,
    src: '/assets/gallery/gallery_9.webp',
    category: 'abstract',
    title: 'Cotton Clouds',
    photographer: 'Thomas Anderson',
    description: 'Soft fluffy white clouds on pale blue gradient'
  },
  {
    id: 10,
    src: '/assets/gallery/gallery_10.webp',
    category: 'food',
    title: 'Fresh Fruits',
    photographer: 'Jennifer White',
    description: 'Artfully arranged citrus fruits on light cream background'
  },
  {
    id: 11,
    src: '/assets/gallery/gallery_11.webp',
    category: 'product',
    title: 'White Sneakers',
    photographer: 'Chris Martinez',
    description: 'Clean white designer sneakers on light grey background'
  },
  {
    id: 12,
    src: '/assets/gallery/gallery_12.webp',
    category: 'abstract',
    title: 'Geometric Shapes',
    photographer: 'Nina Patel',
    description: '3D rendered pastel geometric shapes floating on white'
  },
  {
    id: 13,
    src: '/assets/gallery/gallery_13.webp',
    category: 'lifestyle',
    title: 'Cozy Reading',
    photographer: 'Kevin Zhang',
    description: 'Open book with coffee on soft white linen bedding'
  },
  {
    id: 14,
    src: '/assets/gallery/gallery_14.webp',
    category: 'decor',
    title: 'Glass Vases',
    photographer: 'Sofia Rodriguez',
    description: 'Elegant clear glass vases with single stems'
  },
  {
    id: 15,
    src: '/assets/gallery/gallery_15.webp',
    category: 'abstract',
    title: 'Marble Texture',
    photographer: 'Mark Johnson',
    description: 'Luxurious white marble texture with subtle grey veins'
  },
  {
    id: 16,
    src: '/assets/gallery/gallery_16.webp',
    category: 'technology',
    title: 'Tech Accessories',
    photographer: 'Amy Taylor',
    description: 'Modern tech accessories on white desk, Apple-style aesthetic'
  }
]

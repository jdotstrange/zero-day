import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { useLocale } from '@/i18n'
import { galleryImages, galleryCategories, type GalleryCategory } from '@/data/gallery'

export default function GalleryPage() {
 const { t } = useLocale()
 const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all')
 const [lightboxOpen, setLightboxOpen] = useState(false)
 const [lightboxIndex, setLightboxIndex] = useState(0)

 const filteredImages = selectedCategory === 'all'
 ? galleryImages
 : galleryImages.filter((img) => img.category === selectedCategory)

 const slides = filteredImages.map((image) => ({
 src: image.src,
 title: image.title,
 description: image.category,
 }))

 return (
 <div className="space-y-6">
 {/* Header */}
 <div>
 <h1 className="heading-2 text-secondary-900 dark:text-white">{t('gallery.title')}</h1>
 <p className="mt-2 text-body-sm text-secondary-600 dark:text-secondary-400">
 {t('gallery.description')}
 </p>
 </div>

 {/* Category Filter */}
 <div className="card rounded-xl p-4">
 <div className="flex flex-wrap gap-2">
 {galleryCategories.map((category) => (
 <button
 key={category}
 onClick={() => setSelectedCategory(category)}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
 selectedCategory === category
 ? 'bg-theme-primary text-white'
 : 'bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-300 hover:bg-surface-200 dark:hover:bg-surface-700'
 }`}
 >
 {category}
 </button>
 ))}
 </div>
 </div>

 {/* Gallery Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filteredImages.map((image, index) => (
 <button
 key={image.id}
 type="button"
 onClick={() => {
 setLightboxIndex(index)
 setLightboxOpen(true)
 }}
 className="group relative aspect-square overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-800 text-left"
 >
 <img
 src={`${image.src}?w=400&h=400&fit=crop`}
 alt={image.title}
 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
 <div className="absolute bottom-0 left-0 right-0 p-4">
 <h3 className="text-white font-semibold text-sm">{image.title}</h3>
 <p className="text-white/80 text-xs capitalize">{image.category}</p>
 </div>
 </div>
 </button>
 ))}
 </div>

 <Lightbox
 open={lightboxOpen}
 close={() => setLightboxOpen(false)}
 index={lightboxIndex}
 slides={slides}
 plugins={[Thumbnails, Zoom]}
 thumbnails={{ position: 'bottom' }}
 />

 {filteredImages.length === 0 && (
 <div className="card rounded-xl p-12 text-center">
 <p className="text-secondary-500 dark:text-secondary-400">
 {t('gallery.no_images')}
 </p>
 </div>
 )}
 </div>
 )
}

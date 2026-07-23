import { useParams, useNavigate } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { Button, FormField, Textarea } from '@/components/ui'
import { useState } from 'react'
import { blogPosts, categoryColors } from '@/data/blog'
import { useLocale } from '@/i18n'

/**
 * Blog Detail Page Component
 * Displays full blog post content with comments and related posts
 */
export function BlogDetailPage() {
  const { t, locale } = useLocale()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const post = blogPosts.find(p => p.slug === slug)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes || 0)
  const [comment, setComment] = useState('')
  const [isShareOpen, setIsShareOpen] = useState(false)

  if (!post) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="card rounded-xl py-16 text-center">
          <h2 className="heading-4 text-secondary-900 dark:text-white mb-2">{t('blog.post_not_found')}</h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-4">
            {t('blog.post_not_found_desc')}
          </p>
          <Button type="button" variant="ghost" onClick={() => navigate('/app/blog')}>
            ← {t('blog.back_to_blog')}
          </Button>
        </div>
      </div>
    )
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  // Get previous and next posts
  const currentIndex = blogPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    // In a real app, this would submit the comment
    setComment('')
  }

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsShareOpen(false)
  }

  const categoryColor = categoryColors[post.category] || categoryColors.Technology

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        className="px-0"
        onClick={() => navigate('/app/blog')}
      >
        <Icon icon={Icons.arrowLeft} className="w-5 h-5" width={20} height={20} />
        <span className="font-medium">{t('blog.back_to_blog')}</span>
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article */}
        <div className="lg:col-span-2 space-y-6">
          <article className="card rounded-xl overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-64 sm:h-80 lg:h-96">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text} mb-3`}>
                  {post.category}
                </span>
                <h1 className="heading-1 text-white">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Meta Info */}
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <div className="flex flex-wrap items-center gap-6">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-200 dark:ring-surface-700"
                  />
                  <div>
                    <p className="font-semibold text-secondary-900 dark:text-white">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {post.author.role}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Icons.calendar} className="w-4 h-4" width={16} height={16} />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Icons.clock} className="w-4 h-4" width={16} height={16} />
                    {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon icon={Icons.eye} className="w-4 h-4" width={16} height={16} />
                    {post.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-secondary-900 dark:prose-headings:text-white
                  prose-p:text-secondary-600 dark:prose-p:text-secondary-400
                  prose-a:text-theme-primary hover:prose-a:underline
                  prose-strong:text-secondary-900 dark:prose-strong:text-white
                  prose-ul:text-secondary-600 dark:prose-ul:text-secondary-400
                  prose-li:marker:text-theme-primary"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 rounded-lg text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isLiked
                        ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                        : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                    }`}
                  >
                    {isLiked ? (
                      <Icon icon={Icons.heartFilled} className="w-5 h-5" width={20} height={20} />
                    ) : (
                      <Icon icon={Icons.heart} className="w-5 h-5" width={20} height={20} />
                    )}
                    {likeCount}
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-xl transition-all ${
                      isBookmarked
                        ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400'
                        : 'bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                    }`}
                  >
                    {isBookmarked ? (
                      <Icon icon={Icons.bookmarkFilled} className="w-5 h-5" width={20} height={20} />
                    ) : (
                      <Icon icon={Icons.bookmark} className="w-5 h-5" width={20} height={20} />
                    )}
                  </button>
                </div>

                {/* Share */}
                <div className="relative">
                  <button
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 rounded-xl text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  >
                    <Icon icon={Icons.share} className="w-5 h-5" width={20} height={20} />
                    {t('blog.share')}
                  </button>

                  {isShareOpen && (
                    <>
                      <div className="fixed inset-0 z-[1040]" onClick={() => setIsShareOpen(false)} />
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 z-[1050] animate-fade-in p-2">
                        <button
                          onClick={copyLink}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        >
                          <Icon icon={Icons.link} className="w-4 h-4" width={16} height={16} />
                          {t('blog.copy_link')}
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                          <Icon icon={Icons.brandTwitter} className="w-4 h-4" width={16} height={16} />
                          {t('blog.share_twitter')}
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                          <Icon icon={Icons.brandFacebook} className="w-4 h-4" width={16} height={16} />
                          {t('blog.share_facebook')}
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                          <Icon icon={Icons.brandLinkedin} className="w-4 h-4" width={16} height={16} />
                          {t('blog.share_linkedin')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Post Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost && (
              <button
                onClick={() => navigate(`/app/blog/${prevPost.slug}`)}
                className="card group rounded-xl p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 mb-2">
                  <Icon icon={Icons.chevronLeft} className="w-4 h-4" width={16} height={16} />
                  {t('blog.previous_post')}
                </div>
                <p className="font-semibold text-secondary-900 dark:text-white line-clamp-2 group-hover:text-theme-primary transition-colors">
                  {prevPost.title}
                </p>
              </button>
            )}
            {nextPost && (
              <button
                onClick={() => navigate(`/app/blog/${nextPost.slug}`)}
                className="card group rounded-xl p-4 text-right transition-colors sm:col-start-2"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-secondary-500 dark:text-secondary-400 mb-2">
                  {t('blog.next_post')}
                  <Icon icon={Icons.chevronRight} className="w-4 h-4" width={16} height={16} />
                </div>
                <p className="font-semibold text-secondary-900 dark:text-white line-clamp-2 group-hover:text-theme-primary transition-colors">
                  {nextPost.title}
                </p>
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div className="card rounded-xl p-6">
            <h3 className="heading-5 text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
              <Icon icon={Icons.message} className="w-5 h-5" width={20} height={20} />
              {t('blog.comments')} ({post.comments})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <FormField className="mb-3">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('blog.write_comment')}
                  rows={3}
                />
              </FormField>
              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  {t('blog.post_comment')}
                </Button>
              </div>
            </form>

            {/* Sample Comments */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <img
                    src={`https://i.pravatar.cc/150?img=${10 + i}`}
                    alt="Commenter"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-secondary-900 dark:text-white text-sm">
                        User {i}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {i} {i > 1 ? t('blog.days_ago_plural') : t('blog.days_ago_singular')}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Great article! This really helped me understand the concepts better. Looking forward to more content like this.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-secondary-500 hover:text-theme-primary transition-colors">
                        Reply
                      </button>
                      <button className="flex items-center gap-1 text-xs text-secondary-500 hover:text-danger-500 transition-colors">
                        <Icon icon={Icons.heart} className="w-3.5 h-3.5" width={14} height={14} />
                        {5 - i}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="card rounded-xl p-6">
            <div className="text-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-surface-100 dark:ring-surface-700"
              />
              <h3 className="heading-5 text-secondary-900 dark:text-white">
                {post.author.name}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                {post.author.role}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                Passionate writer and developer sharing insights about technology and design.
              </p>
              <Button type="button" fullWidth>
                {t('blog.follow_author')}
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="card rounded-xl p-6">
              <h3 className="heading-5 text-secondary-900 dark:text-white mb-4">
                {t('blog.related_posts')}
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <button
                    key={relatedPost.id}
                    onClick={() => navigate(`/app/blog/${relatedPost.slug}`)}
                    className="w-full flex gap-3 p-2 -m-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-left group"
                  >
                    <img
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary-900 dark:text-white text-sm line-clamp-2 group-hover:text-theme-primary transition-colors">
                        {relatedPost.title}
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        {formatDate(relatedPost.publishedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags Cloud */}
          <div className="card rounded-xl p-6">
            <h3 className="heading-5 text-secondary-900 dark:text-white mb-4">
              {t('blog.popular_tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(blogPosts.flatMap(p => p.tags))).slice(0, 12).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-surface-100 dark:bg-surface-800 text-secondary-600 dark:text-secondary-400 rounded-lg text-sm hover:bg-surface-200 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage

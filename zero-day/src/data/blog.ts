/**
 * Blog Mock Data
 * Contains sample blog posts for the Blog app
 */

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  readTime: number
  views: number
  likes: number
  comments: number
  status: 'published' | 'draft' | 'scheduled'
}

export const blogCategories = [
  'All',
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Development',
  'Lifestyle',
]

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with React 19: A Comprehensive Guide',
    slug: 'getting-started-with-react-19',
    excerpt: 'Explore the new features and improvements in React 19, including the new compiler, server components, and enhanced hooks.',
    content: `
      <p>React 19 brings a wealth of new features and improvements that make building modern web applications easier and more efficient than ever before. In this comprehensive guide, we'll explore everything you need to know to get started.</p>
      
      <h2>The New React Compiler</h2>
      <p>One of the most exciting additions in React 19 is the new compiler. This compiler automatically optimizes your React code, eliminating the need for manual memoization in most cases. The compiler analyzes your code and applies optimizations that previously required manual intervention with useMemo, useCallback, and React.memo.</p>
      
      <h2>Server Components</h2>
      <p>Server Components have been refined and are now production-ready. They allow you to render components on the server, reducing the JavaScript bundle size sent to the client and improving initial page load performance.</p>
      
      <h2>Enhanced Hooks</h2>
      <p>React 19 introduces several new hooks and improvements to existing ones:</p>
      <ul>
        <li><strong>useOptimistic</strong> - Handle optimistic UI updates with ease</li>
        <li><strong>useFormStatus</strong> - Track form submission states</li>
        <li><strong>use</strong> - A new way to read resources in render</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>React 19 represents a significant step forward for the framework, making it easier to build fast, efficient, and maintainable applications. Whether you're starting a new project or upgrading an existing one, these new features will help you deliver better user experiences.</p>
    `,
    coverImage: '/assets/blogs/blog_1.webp',
    category: 'Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    author: {
      name: 'Sarah Johnson',
      avatar: '/assets/avatars/avatar1.jpg',
      role: 'Senior Developer',
    },
    publishedAt: '2025-11-28',
    readTime: 8,
    views: 2450,
    likes: 186,
    comments: 24,
    status: 'published',
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS: Tips and Tricks for Pro Developers',
    slug: 'mastering-tailwind-css-tips-tricks',
    excerpt: 'Level up your Tailwind CSS skills with these advanced techniques, custom configurations, and best practices.',
    content: `
      <p>Tailwind CSS has revolutionized the way we write CSS. In this article, we'll dive deep into advanced techniques that will take your Tailwind skills to the next level.</p>
      
      <h2>Custom Theme Configuration</h2>
      <p>One of Tailwind's greatest strengths is its customizability. Learn how to extend the default theme with your brand colors, custom spacing scales, and typography settings.</p>
      
      <h2>Component Patterns</h2>
      <p>Discover effective patterns for creating reusable components while maintaining the utility-first approach that makes Tailwind so powerful.</p>
      
      <h2>Performance Optimization</h2>
      <p>Learn how to optimize your Tailwind builds for production, including proper purging configuration and minimizing bundle size.</p>
    `,
    coverImage: '/assets/blogs/blog_2.webp',
    category: 'Design',
    tags: ['CSS', 'Tailwind', 'Frontend', 'Styling'],
    author: {
      name: 'Michael Chen',
      avatar: '/assets/avatars/avatar3.jpg',
      role: 'UI/UX Designer',
    },
    publishedAt: '2025-11-25',
    readTime: 6,
    views: 1820,
    likes: 142,
    comments: 18,
    status: 'published',
  },
  {
    id: 3,
    title: 'Building Scalable APIs with Node.js and Express',
    slug: 'building-scalable-apis-nodejs-express',
    excerpt: 'Learn how to design and build production-ready APIs that can handle millions of requests with Node.js.',
    content: `
      <p>Building APIs that can scale is a crucial skill for modern backend developers. This guide covers everything from architecture decisions to implementation details.</p>
      
      <h2>Architecture Patterns</h2>
      <p>Explore different architectural patterns including MVC, Clean Architecture, and microservices to find the right fit for your project.</p>
      
      <h2>Performance Considerations</h2>
      <p>Learn about caching strategies, database optimization, and horizontal scaling to ensure your API can handle growth.</p>
    `,
    coverImage: '/assets/blogs/blog_3.webp',
    category: 'Development',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    author: {
      name: 'David Miller',
      avatar: '/assets/avatars/avatar4.jpg',
      role: 'Backend Engineer',
    },
    publishedAt: '2025-11-22',
    readTime: 10,
    views: 3200,
    likes: 245,
    comments: 32,
    status: 'published',
  },
  {
    id: 4,
    title: 'The Future of AI in Software Development',
    slug: 'future-of-ai-software-development',
    excerpt: 'Discover how artificial intelligence is transforming the way we write, test, and deploy software.',
    content: `
      <p>Artificial intelligence is no longer just a buzzword—it's actively changing how software is developed. From code completion to automated testing, AI tools are becoming indispensable.</p>
      
      <h2>AI-Powered Code Assistants</h2>
      <p>Tools like GitHub Copilot and similar AI assistants are revolutionizing the coding experience, helping developers write code faster and with fewer errors.</p>
      
      <h2>Automated Testing</h2>
      <p>AI is making it possible to automatically generate test cases, identify edge cases, and even predict where bugs are likely to occur.</p>
    `,
    coverImage: '/assets/blogs/blog_4.webp',
    category: 'Technology',
    tags: ['AI', 'Machine Learning', 'Future Tech', 'Automation'],
    author: {
      name: 'Emily Roberts',
      avatar: '/assets/avatars/avatar5.jpg',
      role: 'Tech Lead',
    },
    publishedAt: '2025-11-20',
    readTime: 7,
    views: 4100,
    likes: 312,
    comments: 45,
    status: 'published',
  },
  {
    id: 5,
    title: 'Effective Marketing Strategies for SaaS Products',
    slug: 'effective-marketing-strategies-saas',
    excerpt: 'Learn proven marketing techniques to grow your SaaS business and acquire more customers.',
    content: `
      <p>Marketing a SaaS product requires a unique approach. In this guide, we'll cover strategies that have proven effective for growing subscription-based businesses.</p>
      
      <h2>Content Marketing</h2>
      <p>Creating valuable content that attracts and engages your target audience is crucial for SaaS success.</p>
      
      <h2>Product-Led Growth</h2>
      <p>Learn how to let your product do the marketing through freemium models, viral features, and excellent user experiences.</p>
    `,
    coverImage: '/assets/blogs/blog_5.webp',
    category: 'Marketing',
    tags: ['SaaS', 'Marketing', 'Growth', 'Business'],
    author: {
      name: 'Jessica Taylor',
      avatar: '/assets/avatars/avatar6.jpg',
      role: 'Marketing Director',
    },
    publishedAt: '2025-11-18',
    readTime: 5,
    views: 1650,
    likes: 98,
    comments: 12,
    status: 'published',
  },
  {
    id: 6,
    title: 'Design Systems: Building Consistency at Scale',
    slug: 'design-systems-building-consistency',
    excerpt: 'How to create and maintain a design system that keeps your product consistent as your team grows.',
    content: `
      <p>Design systems are essential for maintaining consistency across large products and teams. This article covers the fundamentals of building and scaling a design system.</p>
      
      <h2>Core Components</h2>
      <p>Learn what elements should be included in your design system, from color palettes to complex components.</p>
      
      <h2>Documentation</h2>
      <p>Effective documentation is key to adoption. We'll cover best practices for documenting your design system.</p>
    `,
    coverImage: '/assets/blogs/blog_6.webp',
    category: 'Design',
    tags: ['Design Systems', 'UI', 'UX', 'Components'],
    author: {
      name: 'Alex Thompson',
      avatar: '/assets/avatars/avatar7.jpg',
      role: 'Design Lead',
    },
    publishedAt: '2025-11-15',
    readTime: 9,
    views: 2100,
    likes: 167,
    comments: 21,
    status: 'published',
  },
  {
    id: 7,
    title: 'Remote Work Best Practices for Development Teams',
    slug: 'remote-work-best-practices-dev-teams',
    excerpt: 'Tips and tools for running effective remote development teams and maintaining productivity.',
    content: `
      <p>Remote work is here to stay. This guide provides practical advice for managing and participating in remote development teams effectively.</p>
      
      <h2>Communication</h2>
      <p>Effective communication is the foundation of successful remote work. Learn strategies for staying connected without constant meetings.</p>
      
      <h2>Tools and Workflows</h2>
      <p>Discover the best tools and workflows for remote collaboration, from async communication to pair programming.</p>
    `,
    coverImage: '/assets/blogs/blog_7.webp',
    category: 'Lifestyle',
    tags: ['Remote Work', 'Productivity', 'Team Management', 'Work-Life Balance'],
    author: {
      name: 'Ryan Cooper',
      avatar: '/assets/avatars/avatar8.jpg',
      role: 'Engineering Manager',
    },
    publishedAt: '2025-11-12',
    readTime: 6,
    views: 1890,
    likes: 134,
    comments: 28,
    status: 'published',
  },
  {
    id: 8,
    title: 'TypeScript Best Practices in 2025',
    slug: 'typescript-best-practices-2025',
    excerpt: 'Stay up to date with the latest TypeScript features and coding patterns for cleaner, safer code.',
    content: `
      <p>TypeScript continues to evolve, and staying current with best practices is essential for writing maintainable code.</p>
      
      <h2>Type Safety</h2>
      <p>Learn advanced typing techniques to catch more bugs at compile time and improve your development experience.</p>
      
      <h2>Modern Patterns</h2>
      <p>Explore modern TypeScript patterns including discriminated unions, template literal types, and conditional types.</p>
    `,
    coverImage: '/assets/blogs/blog_8.webp',
    category: 'Development',
    tags: ['TypeScript', 'JavaScript', 'Best Practices', 'Coding'],
    author: {
      name: 'Sarah Johnson',
      avatar: '/assets/avatars/avatar1.jpg',
      role: 'Senior Developer',
    },
    publishedAt: '2025-11-10',
    readTime: 8,
    views: 2780,
    likes: 201,
    comments: 35,
    status: 'published',
  },
  {
    id: 9,
    title: 'Understanding Microservices Architecture',
    slug: 'understanding-microservices-architecture',
    excerpt: 'A deep dive into microservices: when to use them, how to implement them, and common pitfalls to avoid.',
    content: `
      <p>Microservices architecture has become the go-to pattern for building large-scale applications. But is it right for your project?</p>
      
      <h2>When to Use Microservices</h2>
      <p>Not every application needs microservices. Learn when the added complexity is worth it.</p>
      
      <h2>Implementation Strategies</h2>
      <p>Discover different approaches to implementing microservices and the trade-offs involved.</p>
    `,
    coverImage: '/assets/blogs/blog_9.webp',
    category: 'Technology',
    tags: ['Microservices', 'Architecture', 'Backend', 'Scalability'],
    author: {
      name: 'David Miller',
      avatar: '/assets/avatars/avatar4.jpg',
      role: 'Backend Engineer',
    },
    publishedAt: '2025-11-08',
    readTime: 11,
    views: 3450,
    likes: 278,
    comments: 42,
    status: 'published',
  },
  {
    id: 10,
    title: 'Startup Funding: A Guide for Tech Founders',
    slug: 'startup-funding-guide-tech-founders',
    excerpt: 'Navigate the fundraising landscape with this comprehensive guide to startup funding rounds and investor relations.',
    content: `
      <p>Raising funds for your startup can be challenging. This guide breaks down the different funding stages and what investors look for.</p>
      
      <h2>Funding Stages</h2>
      <p>From pre-seed to Series A and beyond, understand what each funding round involves.</p>
      
      <h2>Pitch Preparation</h2>
      <p>Learn how to prepare a compelling pitch that resonates with investors.</p>
    `,
    coverImage: '/assets/blogs/blog_10.webp',
    category: 'Business',
    tags: ['Startup', 'Funding', 'Entrepreneurship', 'Investment'],
    author: {
      name: 'Jessica Taylor',
      avatar: '/assets/avatars/avatar6.jpg',
      role: 'Marketing Director',
    },
    publishedAt: '2025-11-05',
    readTime: 7,
    views: 1420,
    likes: 89,
    comments: 15,
    status: 'published',
  },
]

// Category colors for badges
export const categoryColors: Record<string, { bg: string; text: string }> = {
  Technology: { bg: 'bg-primary-100 dark:bg-primary-900/30', text: 'text-primary-700 dark:text-primary-300' },
  Design: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  Business: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-700 dark:text-success-300' },
  Marketing: { bg: 'bg-warning-100 dark:bg-warning-900/30', text: 'text-warning-700 dark:text-warning-300' },
  Development: { bg: 'bg-info-100 dark:bg-info-900/30', text: 'text-info-700 dark:text-info-300' },
  Lifestyle: { bg: 'bg-danger-100 dark:bg-danger-900/30', text: 'text-danger-700 dark:text-danger-300' },
}

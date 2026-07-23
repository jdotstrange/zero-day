import { createBrowserRouter, Navigate } from 'react-router'
import { lazy, Suspense } from 'react'

// Layouts - Keep these eagerly loaded for fast initial render
import { RootLayout } from '@/layouts/RootLayout'
import { BlankLayout } from '@/layouts/BlankLayout'
import { FullLayout } from '@/layouts/FullLayout'
import { AuthLayout, AuthCardLayout } from '@/layouts/AuthLayout'

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// ============================
// Lazy-loaded Pages
// ============================

// Home & Landing — kit pages kept on disk; `/` redirects to dashboard

// Dashboards
const DashboardPage = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.DashboardPage })))
const AnalyticsDashboard = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.AnalyticsDashboard })))
const EcommerceDashboard = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.EcommerceDashboard })))
const CRMDashboard = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.CRMDashboard })))

// Apps
const ContactsPage = lazy(() => import('@/pages/apps/contacts').then(m => ({ default: m.ContactsPage })))
const EmailPage = lazy(() => import('@/pages/apps/email').then(m => ({ default: m.EmailPage })))
const CalendarPage = lazy(() => import('@/pages/apps/calendar').then(m => ({ default: m.CalendarPage })))
const BlogListPage = lazy(() => import('@/pages/apps/blog').then(m => ({ default: m.BlogListPage })))
const BlogDetailPage = lazy(() => import('@/pages/apps/blog').then(m => ({ default: m.BlogDetailPage })))
const BlogCreatePage = lazy(() => import('@/pages/apps/blog').then(m => ({ default: m.BlogCreatePage })))
const ChatPage = lazy(() => import('@/pages/apps/chat').then(m => ({ default: m.ChatPage })))
const VoiceCallPage = lazy(() => import('@/pages/apps/chat').then(m => ({ default: m.VoiceCallPage })))
const VideoCallPage = lazy(() => import('@/pages/apps/chat').then(m => ({ default: m.VideoCallPage })))
const ProductsPage = lazy(() => import('@/pages/apps/ecommerce').then(m => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('@/pages/apps/ecommerce').then(m => ({ default: m.ProductDetailPage })))
const ProductCreatePage = lazy(() => import('@/pages/apps/ecommerce').then(m => ({ default: m.ProductCreatePage })))
const CheckoutPage = lazy(() => import('@/pages/apps/ecommerce').then(m => ({ default: m.CheckoutPage })))
const NotesPage = lazy(() => import('@/pages/apps/notes').then(m => ({ default: m.NotesPage })))
const KanbanPage = lazy(() => import('@/pages/apps/kanban').then(m => ({ default: m.KanbanPage })))

// Forms
const FormLayoutPage = lazy(() => import('@/pages/forms').then(m => ({ default: m.FormLayoutPage })))
const FormValidationPage = lazy(() => import('@/pages/forms').then(m => ({ default: m.FormValidationPage })))
const EditorPage = lazy(() => import('@/pages/forms').then(m => ({ default: m.EditorPage })))

// Tables
const SimpleTablePage = lazy(() => import('@/pages/tables').then(m => ({ default: m.SimpleTablePage })))
const DataTablePage = lazy(() => import('@/pages/tables').then(m => ({ default: m.DataTablePage })))
const CrudTablePage = lazy(() => import('@/pages/tables').then(m => ({ default: m.CrudTablePage })))

// Charts
const LineChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.LineChartsPage })))
const AreaChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.AreaChartsPage })))
const ColumnChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.ColumnChartsPage })))
const PieDoughnutChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.PieDoughnutChartsPage })))
const RadarChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.RadarChartsPage })))
const CandlestickChartsPage = lazy(() => import('@/pages/charts').then(m => ({ default: m.CandlestickChartsPage })))

// Features (Complex Logic)
const RuleEnginePage = lazy(() => import('@/pages/features').then(m => ({ default: m.RuleEnginePage })))
const QueryBuilderPage = lazy(() => import('@/pages/features').then(m => ({ default: m.QueryBuilderPage })))
const SimulationPage = lazy(() => import('@/pages/features').then(m => ({ default: m.SimulationPage })))
const InsightsPage = lazy(() => import('@/pages/features').then(m => ({ default: m.InsightsPage })))
const WorkflowBuilderPage = lazy(() => import('@/pages/features').then(m => ({ default: m.WorkflowBuilderPage })))
const TaskSchedulerPage = lazy(() => import('@/pages/features').then(m => ({ default: m.TaskSchedulerPage })))

// Pages
const PricingPage = lazy(() => import('@/pages/pages').then(m => ({ default: m.PricingPage })))
const AccountSettingsPage = lazy(() => import('@/pages/pages').then(m => ({ default: m.AccountSettingsPage })))
const GalleryPage = lazy(() => import('@/pages/pages').then(m => ({ default: m.GalleryPage })))
const FaqPage = lazy(() => import('@/pages/pages').then(m => ({ default: m.FaqPage })))
const TypographyGuidePage = lazy(() => import('@/pages/pages').then(m => ({ default: m.TypographyGuidePage })))

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))

// Errors
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// Lazy wrapper helper
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

/**
 * Application Router Configuration
 * Using createBrowserRouter for data APIs and better performance
 * 
 * Layout Types:
 * - BlankLayout: For frontend pages (auth, landing, errors) - No admin UI
 * - FullLayout: For admin pages - Has sidebar, header, footer
 * - AuthLayout: Side-by-side auth layout
 * - AuthCardLayout: Centered card auth layout
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: withSuspense(NotFoundPage),
    children: [
      // ============================
      // Blank Layout Routes
      // (Frontend: Landing, Auth, etc.)
      // ============================
      {
        element: <BlankLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          // Auth - Side Layout (default)
          {
            path: 'auth',
            element: <AuthLayout />,
            children: [
              {
                path: 'login',
                element: withSuspense(LoginPage),
              },
              {
                path: 'register',
                element: withSuspense(RegisterPage),
              },
              {
                path: 'forgot-password',
                element: withSuspense(ForgotPasswordPage),
              },
            ],
          },
          // Auth - Centered Card Layout (alternative)
          {
            path: 'auth-card',
            element: <AuthCardLayout />,
            children: [
              {
                path: 'login',
                element: withSuspense(LoginPage),
              },
              {
                path: 'register',
                element: withSuspense(RegisterPage),
              },
              {
                path: 'forgot-password',
                element: withSuspense(ForgotPasswordPage),
              },
            ],
          },
        ],
      },
      // ============================
      // Full Layout Routes
      // (Admin: Dashboard, Apps, Management, etc.)
      // ============================
      {
        element: <FullLayout />,
        children: [
          // Dashboards
          {
            path: 'dashboard',
            element: withSuspense(DashboardPage),
          },
          {
            path: 'dashboard/analytics',
            element: withSuspense(AnalyticsDashboard),
          },
          {
            path: 'dashboard/ecommerce',
            element: withSuspense(EcommerceDashboard),
          },
          {
            path: 'dashboard/crm',
            element: withSuspense(CRMDashboard),
          },
          // Apps
          {
            path: 'app/email',
            element: withSuspense(EmailPage),
          },
          {
            path: 'app/calendar',
            element: withSuspense(CalendarPage),
          },
          {
            path: 'app/blog',
            element: withSuspense(BlogListPage),
          },
          {
            path: 'app/blog/create',
            element: withSuspense(BlogCreatePage),
          },
          {
            path: 'app/blog/:slug',
            element: withSuspense(BlogDetailPage),
          },
          {
            path: 'app/contacts',
            element: withSuspense(ContactsPage),
          },
          {
            path: 'app/chat',
            element: withSuspense(ChatPage),
          },
          {
            path: 'app/chat/voice-call',
            element: withSuspense(VoiceCallPage),
          },
          {
            path: 'app/chat/video-call',
            element: withSuspense(VideoCallPage),
          },
          // E-commerce
          {
            path: 'app/ecommerce/products',
            element: withSuspense(ProductsPage),
          },
          {
            path: 'app/ecommerce/products/create',
            element: withSuspense(ProductCreatePage),
          },
          {
            path: 'app/ecommerce/products/:id',
            element: withSuspense(ProductDetailPage),
          },
          {
            path: 'app/ecommerce/products/:id/edit',
            element: withSuspense(ProductCreatePage),
          },
          {
            path: 'app/ecommerce/checkout',
            element: withSuspense(CheckoutPage),
          },
          // Notes
          {
            path: 'app/notes',
            element: withSuspense(NotesPage),
          },
          // Kanban
          {
            path: 'app/kanban',
            element: withSuspense(KanbanPage),
          },
          // From
          {
            path: 'forms/layout',
            element: withSuspense(FormLayoutPage),
          },
          {
            path: 'forms/validation',
            element: withSuspense(FormValidationPage),
          },
          {
            path: 'forms/editor',
            element: withSuspense(EditorPage),
          },
          // Table
          {
            path: 'tables/simple',
            element: withSuspense(SimpleTablePage),
          },
          {
            path: 'tables/data',
            element: withSuspense(DataTablePage),
          },
          {
            path: 'tables/crud',
            element: withSuspense(CrudTablePage),
          },
          // Charts
          {
            path: 'charts',
            element: <Navigate to="/charts/line" replace />,
          },
          {
            path: 'charts/line',
            element: withSuspense(LineChartsPage),
          },
          {
            path: 'charts/area',
            element: withSuspense(AreaChartsPage),
          },
          {
            path: 'charts/columns',
            element: withSuspense(ColumnChartsPage),
          },
          {
            path: 'charts/pie',
            element: withSuspense(PieDoughnutChartsPage),
          },
          {
            path: 'charts/radar',
            element: withSuspense(RadarChartsPage),
          },
          {
            path: 'charts/candlestick',
            element: withSuspense(CandlestickChartsPage),
          },
          // Pages
          {
            path: 'pages/pricing',
            element: withSuspense(PricingPage),
          },
          {
            path: 'pages/account-settings',
            element: withSuspense(AccountSettingsPage),
          },
          {
            path: 'pages/gallery',
            element: withSuspense(GalleryPage),
          },
          {
            path: 'pages/faq',
            element: withSuspense(FaqPage),
          },
          {
            path: 'pages/typography',
            element: withSuspense(TypographyGuidePage),
          },
          // Features (Complex Logic)
          {
            path: 'features/rule-engine',
            element: withSuspense(RuleEnginePage),
          },
          {
            path: 'features/query-builder',
            element: withSuspense(QueryBuilderPage),
          },
          {
            path: 'features/simulation',
            element: withSuspense(SimulationPage),
          },
          {
            path: 'features/insights',
            element: withSuspense(InsightsPage),
          },
          {
            path: 'features/workflow-builder',
            element: withSuspense(WorkflowBuilderPage),
          },
          {
            path: 'features/task-scheduler',
            element: withSuspense(TaskSchedulerPage),
          },
        ],
      },
    ],
  },
])

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import LiveChatPage from './pages/LiveChatPage';
import CannedResponsesPage from './pages/CannedResponsesPage';
import SLAConfigPage from './pages/SLAConfigPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ROICalculatorPage from './pages/ROICalculatorPage';
import ResponseCheckerPage from './pages/ResponseCheckerPage';
import SupportTemplatesPage from './pages/SupportTemplatesPage';
import EmbedPage from './pages/EmbedPage';
import ToolsIndexPage from './pages/ToolsIndexPage';
import FAQGeneratorPage from './pages/FAQGeneratorPage';
import KBTemplatePage from './pages/KBTemplatePage';
import TicketPriorityMatrixPage from './pages/TicketPriorityMatrixPage';
import BlogLayout, { BlogIndex } from './pages/BlogLayout';
import ResponseTimeGuide from './pages/blog/ResponseTimeGuide';
import KnowledgeBaseGuide from './pages/blog/KnowledgeBaseGuide';
import SupportMetricsGuide from './pages/blog/SupportMetricsGuide';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout><Outlet /></Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/portal" element={<CustomerPortalPage />} />
      <Route path="/checker" element={<ResponseCheckerPage />} />
      <Route path="/templates-gallery" element={<SupportTemplatesPage />} />
      <Route path="/calculator" element={<ROICalculatorPage />} />
      <Route path="/embed" element={<EmbedPage />} />
      <Route path="/tools" element={<ToolsIndexPage />} />
      <Route path="/tools/faq-generator" element={<FAQGeneratorPage />} />
      <Route path="/tools/kb-template" element={<KBTemplatePage />} />
      <Route path="/tools/priority-matrix" element={<TicketPriorityMatrixPage />} />
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogIndex />} />
        <Route path="customer-support-response-time-guide" element={<ResponseTimeGuide />} />
        <Route path="building-a-knowledge-base-that-works" element={<KnowledgeBaseGuide />} />
        <Route path="support-metrics-csat-nps-ces" element={<SupportMetricsGuide />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/chat" element={<LiveChatPage />} />
        <Route path="/canned-responses" element={<CannedResponsesPage />} />
        <Route path="/sla" element={<SLAConfigPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

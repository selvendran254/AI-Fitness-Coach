import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { useTheme } from '@/hooks/useTheme';
import { useApplySettings } from '@/hooks/useApplySettings';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  useTheme();
  useApplySettings();
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

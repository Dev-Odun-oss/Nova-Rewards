import { WalletProvider } from '../context/WalletContext';
import { AuthProvider } from '../context/AuthContext';
import { TourProvider } from '../context/TourContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/Toast';
import { SocketProvider } from '../context/SocketContext';
import { NotificationProvider } from '../context/NotificationContext';
import OnboardingTour from '../components/OnboardingTour';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <NotificationProvider>
              <WalletProvider>
                <TourProvider>
                  <Component {...pageProps} />
                  <OnboardingTour />
                </TourProvider>
              </WalletProvider>
            </NotificationProvider>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

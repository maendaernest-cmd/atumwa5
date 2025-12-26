import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { addToast } = useToast();

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      addToast('App Installed', 'Atumwa has been installed on your device!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast]);

  // Online/Offline Status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast('Back Online', 'You are now connected to the internet.', 'success');
    };

    const handleOffline = () => {
      setIsOffline(true);
      addToast('Offline Mode', 'You are currently offline. Some features may be limited.', 'alert');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  // Notification Permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      addToast('Installing...', 'Atumwa is being installed...', 'message');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      addToast('Not Supported', 'Notifications are not supported in this browser.', 'alert');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      addToast('Permission Denied', 'Notification permission was previously denied. Please enable it in your browser settings.', 'alert');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      addToast('Notifications Enabled', 'You will now receive updates about your deliveries!', 'success');
      return true;
    } else {
      addToast('Permission Denied', 'Notifications are disabled. You can enable them later in settings.', 'info');
      return false;
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Atumwa Test', {
        body: 'This is a test notification from Atumwa!',
        icon: '/atumwa-logo.jpeg',
        badge: '/atumwa-logo.jpeg'
      });
      addToast('Test Notification Sent', 'Check your notifications.', 'message');
    } else {
      addToast('Permission Required', 'Please enable notifications first.', 'alert');
    }
  };

  return {
    isInstallable,
    isOffline,
    notificationPermission,
    installPWA,
    requestNotificationPermission,
    sendTestNotification
  };
};

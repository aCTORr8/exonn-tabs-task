export interface Tab {
  id: string;
  title: string;
  url: string;
  icon: string;
  isPinned: boolean;
}

export const initialTabs: Tab[] = [
  { id: '1', title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard', isPinned: true },
  { id: '2', title: 'Banking', url: '/banking', icon: 'Landmark', isPinned: false },
  { id: '3', title: 'Calls', url: '/calls', icon: 'Phone', isPinned: false },
  { id: '4', title: 'Profile', url: '/profile', icon: 'User', isPinned: false },
  { id: '5', title: 'Orders', url: '/orders', icon: 'ShoppingCart', isPinned: false },
  { id: '6', title: 'Messages', url: '/messages', icon: 'Mail', isPinned: false },
  { id: '7', title: 'Settings', url: '/settings', icon: 'Settings', isPinned: false },
  { id: '8', title: 'Help Center', url: '/help', icon: 'HelpCircle', isPinned: false },
  { id: '9', title: 'Calendar', url: '/calendar', icon: 'CalendarDays', isPinned: false },
  { id: '10', title: 'Analytics', url: '/analytics', icon: 'ChartNoAxesCombined', isPinned: false },
  { id: '11', title: 'Documents', url: '/documents', icon: 'FileText', isPinned: false },
  { id: '12', title: 'Notifications', url: '/notifications', icon: 'Bell', isPinned: false },
];

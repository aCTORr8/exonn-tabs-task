export interface Tab {
  id: string;
  title: string;
  url: string;
  icon: string;
  isPinned: boolean;
}

export const initialTabs: Tab[] = [
  { id: '1', title: 'Lagerverwaltung', url: '/lagerverwaltung', icon: 'Package', isPinned: true },
  { id: '2', title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard', isPinned: false },
  { id: '3', title: 'Banking', url: '/banking', icon: 'Landmark', isPinned: false },
  { id: '4', title: 'Telefonie', url: '/telefonie', icon: 'Phone', isPinned: false },
  { id: '5', title: 'Accounting', url: '/accounting', icon: 'UserCheck', isPinned: false },
  { id: '6', title: 'Verkauf', url: '/verkauf', icon: 'Store', isPinned: false },
  { id: '7', title: 'Statistik', url: '/statistik', icon: 'PieChart', isPinned: false },
  { id: '8', title: 'Post Office', url: '/post-office', icon: 'Mail', isPinned: false },
  { id: '9', title: 'Administration', url: '/administration', icon: 'Settings', isPinned: false },
  { id: '10', title: 'Help', url: '/help', icon: 'HelpCircle', isPinned: false },
  { id: '11', title: 'Warenbestand', url: '/warenbestand', icon: 'Box', isPinned: false },
  { id: '12', title: 'Auswahllisten', url: '/auswahllisten', icon: 'ListOrdered', isPinned: false },
  { id: '13', title: 'Einkauf', url: '/einkauf', icon: 'ShoppingCart', isPinned: false },
  { id: '14', title: 'Rechn', url: '/rechn', icon: 'Receipt', isPinned: false },
  { id: '15', title: 'Kunden', url: '/kunden', icon: 'Users', isPinned: false },
  { id: '16', title: 'Kalender', url: '/kalender', icon: 'Calendar', isPinned: false },
  { id: '17', title: 'Berichte', url: '/berichte', icon: 'FileText', isPinned: false },
  { id: '18', title: 'Integrationen', url: '/integrationen', icon: 'Link', isPinned: false },
];

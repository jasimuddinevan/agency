export interface Application {
  id: string;
  business_name: string;
  website_url: string;
  business_description: string;
  industry: string;
  monthly_revenue: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  preferred_contact: string;
  status: 'new' | 'in_progress' | 'contacted' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login: string | null;
}

export interface DashboardStats {
  total: number;
  new: number;
  in_progress: number;
  contacted: number;
  approved: number;
  rejected: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ConfirmationModalProps extends ModalProps {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}
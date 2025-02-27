import { FieldError, UseFormRegister, UseFormTrigger } from "react-hook-form";
export interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Add onClick prop type
}

export interface NavbarProps {
  logo: string;
  companyName: string;
}

export interface HeroSectionProps {
  title: string;
  description: string;
  image: string;
}

export interface FooterProps {
  logo: string;
  companyName: string;
}

export interface FormInputProps {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  error?: any;
  roles?: Role[]; // Change from string[] to Role[]
  loading?: boolean;
  fetchError?: string | null;
  trigger: UseFormTrigger<any>;
}

export interface GenderSelectProps {
  label: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}

export interface Role {
  id: number;
  roleName: string;
  status?: number;
}
export interface OverviewCardProps {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
}

export interface SectionProps {
  tagline: string;
  heading: string;
  description: string;
  cards: OverviewCardProps[];
}

export interface Client {
  id: number;
  clientName: string;
  address: string;
  numberOfEmployees: number;
  emailId: string;
  contactNumber: string;
  status: number;
  startDate: string;
  endDate?: string | null;
}
export interface ClientFormProps {
  client: Client | null;
  onClientSaved: () => void;
  isEditing: boolean;
  isCreatingClient: boolean;
  isViewing: boolean;
  handleUpdate: (client: Client) => Promise<void>;
  handleCreate: (client: Client) => Promise<void>;
}

export interface ClientFormValues {
  clientName: string;
  address: string;
  emailId: string;
  contactNumber: string;
  numberOfEmployees: number;
  startDate: string;
  endDate?: string | null;
  status: number;
}

export interface RoleFormProps {
  role: Role | null;
  onRoleSaved: () => void;
  isEditing: boolean;
  isCreatingRole: boolean;
  isViewing: boolean;
  handleUpdate: (role: Role) => Promise<void>;
  handleCreate: (role: Role) => Promise<void>;
}
export interface RoleFormValues {
  roleName: string;
  status: number;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  emailId: string;
  roleId: string;
  contactNumber: string;
  status: number;
  dob: string;
  password: string;
}
export interface UserFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  emailId: string;
  contactNumber: string;
  status: number;
  roleId: string;
  dob: string;
  password: string;
}

export interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
}
export interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number, status: number) => void;
  onHandleUserClick: (id: number) => void;
  // onHandleUserCreate: (role: Role) => Promise<void>;
  onHandleUserUpdate: (user: User) => Promise<void>;
}
export interface UserFormProps {
  user: User | null;
  onUserSaved: () => void;
  isEditing: boolean;
  isViewing: boolean;
  handleUpdate: (user: User) => Promise<void>;
}
export interface ClientTableProps {
  clients: Client[];
  totalCount: number;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: number, status: number) => void;
  onHandleClientClick: (id: number) => void;
  onHandleClientCreate: (client: Client) => Promise<void>;
  onHandleClientUpdate: (client: Client) => Promise<void>;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}
export interface RoleTableProps {
  roles: Role[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (id: number, status: number) => void;
  onHandleRoleClick: (id: number) => void;
  onHandleRoleCreate: (role: Role) => Promise<void>;
  onHandleRoleUpdate: (role: Role) => Promise<void>;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export interface UserTableProps {
  users: User[];
  roles: Role[];
  totalCount: number;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number, status: number) => void;
  onHandleUserClick: (id: number) => void;
  // onHandleUserCreate: (user: User) => Promise<void>;
  onHandleUserUpdate: (user: User) => Promise<void>;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  hideDeleteButton?: boolean;
}
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearchSubmit: (term: string) => void;
  className?: string;
}

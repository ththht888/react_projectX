export interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onRegisterClick: () => void;
  onLoginSuccess: (name: string) => void;
}

export interface RegisterModalProps {
  open: boolean;
  onCancel: () => void;
  onRegisterSuccess: (name: string) => void;
}

export interface RegisterInput {
  login: string;
  password: string;
  email: string;
  phone: string;
}

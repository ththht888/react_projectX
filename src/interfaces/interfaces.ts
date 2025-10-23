export type Props = {
  open: boolean;
  onCancel: () => void;
  onRegisterClick: () => void;
  onLoginSuccess: (name: string) => void;
};
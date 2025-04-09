export interface FlyoutProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  body: string;
  buttons?: FlyoutButtonProps[];
}

export interface FlyoutButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
}
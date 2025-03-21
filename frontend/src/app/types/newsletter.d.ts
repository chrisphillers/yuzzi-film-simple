export interface NewsletterFormValue {
  email: string;
}

export interface FormSubmitEvent {
  value: NewsletterFormValue;
}

export interface NewsletterButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export interface NewsletterModalProps {
  setShowNewsletterModal: React.Dispatch<React.SetStateAction<boolean>>;
}

import * as React from 'react';
import { Button as GrommetButton } from 'grommet';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text-underline';
  size?: 'small' | 'medium' | 'large';
  asChild?: boolean;
  children?: React.ReactNode;
  [key: string]: any; // Allow other props from GrommetButton
}

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  asChild = false,
  ...props
}: ButtonProps) {
  // Map variant to Grommet props
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return { primary: true };
      case 'secondary':
        return { color: 'accent-1' };
      case 'outline':
        return { color: 'brand', plain: true, border: { color: 'brand', size: 'small' } };
      case 'text-underline':
        return {
          plain: true,
          color: 'brand',
          style: { textDecoration: 'underline', textUnderlineOffset: '4px' },
        };
      default:
        return { primary: true };
    }
  };

  // Map size to Grommet props
  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { size: 'small' };
      case 'large':
        return { size: 'large' };
      default:
        return { size: 'medium' };
    }
  };

  // If asChild is true, we would normally use Slot from @radix-ui
  // Since we're removing Shadcn, we'll just render the children directly
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...getVariantProps(),
      ...getSizeProps(),
    });
  }

  return <GrommetButton {...props} {...getVariantProps()} {...getSizeProps()} label={children} />;
}

export { Button };

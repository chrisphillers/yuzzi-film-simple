import * as React from 'react';
import { Card as GrommetCard } from 'grommet';
import styled from 'styled-components';
import { Box } from 'grommet';

// Card component
export const Card = ({ children, ...props }: React.ComponentProps<typeof GrommetCard>) => {
  return (
    <GrommetCard elevation="small" pad="medium" round="small" {...props}>
      {children}
    </GrommetCard>
  );
};

// Custom styled component example
// eslint-disable-next-line
const CustomElement = styled(Box)`
  border-radius: 12px;
  transform: rotate(5deg);
  background-color: ${(props) => props.theme.global.colors['brand-primary']};
  &:hover {
    opacity: 0.8;
  }
`;

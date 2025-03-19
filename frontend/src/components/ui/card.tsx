import * as React from 'react';
import {
  Box,
  Card as GrommetCard,
  CardHeader as GrommetCardHeader,
  CardBody,
  CardFooter as GrommetCardFooter,
  Text,
  Heading,
} from 'grommet';

// Card component
function Card({ children, ...props }: React.ComponentProps<typeof GrommetCard>) {
  return (
    <GrommetCard
      background="light-1"
      elevation="small"
      pad="medium"
      round="small"
      border={{ color: 'light-3', size: 'xsmall' }}
      {...props}
    >
      {children}
    </GrommetCard>
  );
}

// CardHeader component
function CardHeader({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <GrommetCardHeader gap="small" {...props}>
      {children}
    </GrommetCardHeader>
  );
}

// CardTitle component
function CardTitle({ children, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading level={3} margin="none" size="small" {...props}>
      {children}
    </Heading>
  );
}

// CardDescription component
function CardDescription({ children, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text size="small" color="dark-4" {...props}>
      {children}
    </Text>
  );
}

// CardAction component
function CardAction({ children, ...props }: React.ComponentProps<typeof Box>) {
  return <Box {...props}>{children}</Box>;
}

// CardContent component
function CardContent({ children, ...props }: React.ComponentProps<typeof CardBody>) {
  return <CardBody {...props}>{children}</CardBody>;
}

// CardFooter component
function CardFooter({ children, ...props }: React.ComponentProps<typeof GrommetCardFooter>) {
  return <GrommetCardFooter {...props}>{children}</GrommetCardFooter>;
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };

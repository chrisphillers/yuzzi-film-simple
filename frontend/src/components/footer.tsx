import { Footer as GrommetFooter, Box, Anchor } from 'grommet';

const navItems = [
  { name: 'INSTAGRAM', href: 'https://instagram.com/chrisphillers' },
  { name: 'TWITTER', href: 'https://x.com/chrisphillers' },
  { name: 'FACEBOOK', href: '/about' },
];

export const Footer = () => {
  return (
    <GrommetFooter
      background={{
        light: 'black',
        dark: 'white',
      }}
      pad="small"
      direction="row"
      justify="center"
      margin={{ top: 'medium' }}
    >
      <Box direction="row" gap="medium">
        {navItems.map((item) => (
          <Anchor key={item.name} label={item.name} size="medium" href={item.href} />
        ))}
      </Box>
    </GrommetFooter>
  );
};

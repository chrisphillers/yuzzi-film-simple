import Link from 'next/link';
import { Footer as GrommetFooter, Box, Anchor } from 'grommet';

const navItems = [
  { name: 'INSTAGRAM', href: '/journal' },
  { name: 'TWITTER', href: '/archives' },
  { name: 'FACEBOOK', href: '/about' },
];

export const Footer = () => {
  return (
    <GrommetFooter
      background="brand"
      pad="small"
      direction="row"
      justify="center"
      margin={{ top: 'medium' }}
    >
      <Box direction="row" gap="medium">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} passHref legacyBehavior>
            <Anchor
              label={item.name}
              size="small"
              // color="light-1"
              // style={{
              //   letterSpacing: '0.05em',
              //   textDecoration: 'none',
              //   transition: 'opacity 0.2s',
              // }}
              // hoverIndicator={{ opacity: 0.8 }}
            />
          </Link>
        ))}
      </Box>
    </GrommetFooter>
  );
};

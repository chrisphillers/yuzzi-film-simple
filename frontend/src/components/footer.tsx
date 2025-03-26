import { Footer as GrommetFooter, Box, Anchor } from 'grommet';

const socialItems = [
  { name: 'INSTAGRAM', href: 'https://instagram.com/chrisphillers' },
  { name: 'TWITTER', href: 'https://x.com/chrisphillers' },
  { name: 'FACEBOOK', href: '/about' },
];

export const Footer = ({ gridArea, ...rest }: { gridArea: string }) => {
  return (
    <GrommetFooter
      gridArea={gridArea}
      background={{
        light: 'black',
        dark: 'white',
      }}
      pad="small"
      direction="row"
      justify="center"
      margin={{ top: 'medium' }}
      {...rest}
    >
      <Box direction="row" gap="medium" id="socialmedia">
        {socialItems.map((item) => (
          <Anchor key={item.name} label={item.name} size="medium" href={item.href} />
        ))}
      </Box>
    </GrommetFooter>
  );
};

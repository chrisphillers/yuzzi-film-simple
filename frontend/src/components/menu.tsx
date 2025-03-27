'use client';
import Link from 'next/link';
import {
  Header,
  Box,
  Anchor,
  Nav,
  Button,
  Heading,
  BoxExtendedProps,
  ResponsiveContext,
  Grid,
  Layer,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useState, useEffect, useContext } from 'react';
import { Menu as MenuIcon } from 'grommet-icons';
import { Newsletter } from './newsletter/newsletter';

const menuItems = [
  { name: 'ARTICLES', href: '/articles' },
  { name: 'ARCHIVES', href: '/archives' },
  { name: 'ABOUT', href: '/about' },
  { name: 'SUBMIT', href: '/submit' },
];

const socialItems = [
  { name: 'INSTAGRAM', href: '#' },
  { name: 'ONLYFANS', href: '#' },
];

const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
  width: { max: '1200px' },
  margin: 'auto',
  pad: { horizontal: 'medium' },
  fill: 'horizontal',
};

export const Menu = ({ gridArea, ...rest }: { gridArea?: string }) => {
  const [showNewsletter, setShowNewsletter] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [active, setActive] = useState<string | null>(null);

  // Size from Grommet context
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    const isSmall = size === 'small';
    if (isSmall && showNewsletter) {
      setShowNewsletter(false);
    }
  }, [size, showNewsletter]);

  useEffect(() => {
    // on rerender close
    setShowSidebar(false);
  }, []);

  const isSmall = size === 'small';

  return (
    <Header gridArea={gridArea} width="full" {...rest}>
      <Box {...CONTENT_WIDTH_PROPS}>
        {isSmall ? (
          // Mobile layout
          <>
            {showSidebar && <MobileMenu onClose={() => setShowSidebar(false)}></MobileMenu>}
            <Box direction="row" align="center" width="full" style={{ position: 'relative' }}>
              <YuzziHeading label="LE YUZZI" align={'center'} weight="heavy" href="/" />
              <Box style={{ position: 'absolute', right: 0 }}>
                <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
              </Box>
            </Box>
          </>
        ) : showNewsletter ? (
          <Newsletter setShowNewsletter={setShowNewsletter} />
        ) : (
          // Desktop layout
          <Grid
            fill="horizontal"
            columns={['1/4', '2/4', '1/4']}
            rows={['auto']}
            areas={[['brand', 'menu', 'newsletter']]}
            align="center"
          >
            <YuzziHeading align={'left'} label="LE YUZZI" href="/" weight="heavy" />
            <Box gridArea="menu" align="center">
              <Nav direction="row" gap="medium">
                {menuItems.map((item) => (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <Anchor
                      size="medium"
                      label={item.name}
                      weight="light"
                      active={item.name === active}
                      onClick={() => setActive(item.name)}
                    />
                  </Link>
                ))}
              </Nav>
            </Box>
            <Box gridArea="newsletter" align="end">
              <Anchor
                label="NEWSLETTER"
                size="medium"
                weight="light"
                onClick={() => setShowNewsletter(true)}
              />
            </Box>
          </Grid>
        )}
      </Box>
    </Header>
  );
};

export const YuzziHeading = ({
  align,
  color,
  href,
  label,
  weight,
}: {
  align: 'center' | 'left';
  color?: string;
  href: string;
  label: string;
  weight?: 'heavy';
}) => {
  return (
    <Box
      width="100%"
      align={align}
      gridArea="brand"
      data-testid="brand-link"
      style={{ cursor: 'pointer' }}
    >
      <Link href={href} passHref legacyBehavior>
        <Heading
          level={4}
          margin="none"
          label={label}
          weight={weight === 'heavy' ? 800 : 400}
          color={color}
        >
          {label}
        </Heading>
      </Link>
    </Box>
  );
};

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  // const [active, setActive] = useState<string | null>(null);

  return (
    <Layer
      background={'black'}
      full="vertical"
      animate={false}
      onEsc={() => {
        onClose();
      }}
      // position="right" animate={true}
    >
      {/* <Box
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        backgroundColor: 'black',
        zIndex: 2,
      }}
    > */}
      <Box fill direction="column" pad={{ horizontal: 'medium', vertical: 'medium' }} gap="large">
        <Box direction="row" justify="between" align="center" pad={{ bottom: 'medium' }}>
          <Box flex />
          <Heading level={2} margin="none" color="white" textAlign="center">
            LE YUZZI
          </Heading>
          <Box flex align="end">
            <Button plain icon={<Close color="white" size="medium" />} onClick={onClose} />
          </Box>
        </Box>
        {/* Menu Section*/}
        <Nav gap="medium">
          {menuItems.map((menuItem) => {
            return (
              <Anchor
                // active={menuItem.name === active}
                href={menuItem.href}
                key={menuItem.name}
                color="white"
                weight="medium"
                size="medium"
                // onClick={setActive(menuItem.name)}
              >
                {menuItem.name}
              </Anchor>
            );
          })}
        </Nav>
        {/* Social Section*/}
        <Box margin={{ top: 'xlarge' }}>
          <Nav gap="medium">
            {socialItems.map((socialItem) => {
              return (
                <Anchor
                  key={socialItem.name}
                  href={socialItem.href}
                  color="white"
                  weight="medium"
                  size="medium"
                >
                  {socialItem.name}
                </Anchor>
              );
            })}

            <Anchor href="#" color="white" weight="bold" size="medium">
              NEWSLETTER - TBD
            </Anchor>
          </Nav>
        </Box>
      </Box>
      {/* </Box> */}
    </Layer>
  );
};

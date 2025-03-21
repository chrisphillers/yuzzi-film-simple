'use client';
import Link from 'next/link';
import {
  Header,
  Box,
  Anchor,
  Nav,
  Button,
  BoxExtendedProps,
  ResponsiveContext,
  Grid,
} from 'grommet';
import { Layer, Menu } from 'grommet-icons';
import { useState, useEffect, useContext } from 'react';
import { Menu as MenuIcon } from 'grommet-icons';
import { Newsletter } from './newsletter/newsletter';

const navItems = [
  { name: 'JOURNAL', href: '/journal' },
  { name: 'ARCHIVES', href: '/archives' },
  { name: 'ABOUT', href: '/about' },
  { name: 'SHOP', href: '/shop' },
];

const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
  width: { max: '1200px' },
  margin: 'auto',
  pad: { horizontal: 'medium' },
  fill: 'horizontal',
};

export const NavBar = ({ gridArea, ...rest }: { gridArea?: string }) => {
  const [showNewsletter, setShowNewsletter] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Size from Grommet context
  const size = useContext(ResponsiveContext);

  useEffect(() => {
    const isSmall = size === 'small';
    if (isSmall && showNewsletter) {
      setShowNewsletter(false);
    }
  }, [size, showNewsletter]);

  const isSmall = size === 'small';

  return (
    <Header gridArea={gridArea} width="full" {...rest}>
      <Box {...CONTENT_WIDTH_PROPS}>
        {isSmall ? (
          // Mobile layout
          <Box direction="row" align="center" width="full" style={{ position: 'relative' }}>
            <BrandLink align={'center'} />
            <Box style={{ position: 'absolute', right: 0 }}>
              <Button icon={<MenuIcon />} onClick={() => setShowSidebar(true)} />
            </Box>
          </Box>
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
            <BrandLink align={'left'} />
            <Box gridArea="menu" align="center">
              <Nav direction="row" gap="medium">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <Anchor size="medium" label={item.name} weight="light" />
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

      {showSidebar && <Layer>{/* ...sidebar content... */}</Layer>}
    </Header>
  );
};

const BrandLink = ({ align }: { align: 'center' | 'left' }) => {
  return (
    <Box width="100%" align={align} gridArea="brand">
      <Link href="/" passHref legacyBehavior>
        <Anchor label="LE YUZZI" size="medium" onClick={() => console.log('CLICK')} />
      </Link>
    </Box>
  );
};

export const FullLayer = () => {
  const [showLayer, setShowLayer] = useState(false);

  return (
    <Box pad="small" fill background="dark-3" align="center" justify="center">
      <Button primary color="accent-3" label="Show" onClick={() => setShowLayer(true)} />
      {showLayer && (
        <Layer full animation="fadeIn">
          <Box fill background="light-4" align="center" justify="center">
            <Button primary label="Close" onClick={() => setShowLayer(false)} />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export const ModalMenu = () => {
  const [show, setShow] = useState(false);
  return (
    <Box height="full" color="hotpink">
      <Menu onClick={() => setShow(true)} />
      Hello
      {/* <Button label="show" onClick={() => setShow(true)} /> */}
      {show && (
        <Layer
          animation="slide"

          // onEsc={() => setShow(false)}
          // onClickOutside={() => setShow(false)}
        >
          <Button label="close" onClick={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

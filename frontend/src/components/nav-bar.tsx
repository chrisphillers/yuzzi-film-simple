'use client';
import Link from 'next/link';
import { Header, Box, Anchor, Nav, Button } from 'grommet';
import { Layer, Menu } from 'grommet-icons';
import { useState } from 'react';

const navItems = [
  { name: 'JOURNAL', href: '/journal' },
  { name: 'ARCHIVES', href: '/archives' },
  { name: 'ABOUT', href: '/about' },
  { name: 'SHOP', href: '/shop' },
];

export const NavBar2 = () => {
  return (
    <div>
      <Nav direction="row" responsive>
        {navItems.map((item) => {
          return <Anchor key={item.name}>{item.name}</Anchor>;
        })}

        {/* <Menu></Menu> */}
      </Nav>
      {/* < ModalMenu></ModalMenu> */}
    </div>
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

export const NavBar = () => {
  return (
    <Box pad={{ horizontal: 'medium' }}>
      <Header
        pad={{ vertical: 'medium' }}
        width="large"
        margin={{ horizontal: 'auto' }}
        // gap={"large"}
      >
        {/* <Box> */}
        <Link href="/" passHref legacyBehavior>
          <Anchor
            label="LE YUZZI"
            weight="bold"
            size="medium"
            color="brand"
            style={{
              // letterSpacing: '-0.05em',
              textDecoration: 'none',
              // transition: 'opacity 0.2s',
            }}
            // hoverIndicator={{ opacity: 0.8 }}
          />
        </Link>

        {/* </Box> */}

        <Box direction="row" gap="small">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref legacyBehavior>
              <Anchor
                label={item.name}
                size="medium"
                color="brand"
                weight="light"
                style={{
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                hoverIndicator={{ opacity: 0.8 }}
              />
            </Link>
          ))}
        </Box>

        <Box>
          <Link href="/newsletter" passHref legacyBehavior>
            <Anchor
              label="NEWSLETTER"
              size="medium"
              color="brand"
              weight="light"
              style={{
                letterSpacing: '0.05em',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              hoverIndicator={{ opacity: 0.8 }}
            />
          </Link>
        </Box>
      </Header>
    </Box>
  );
};

'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { Grommet, Button } from 'grommet';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { grommetTheme, cssVariables } from '../../lib/theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return (
      <>
        {styles}
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      </>
    );
  });

  const [dark, darkToggle] = useState(false);

  // Client-side rendering
  if (typeof window !== 'undefined') {
    return (
      <Grommet theme={grommetTheme} full themeMode={dark ? 'dark' : 'light'}>
        <Button
          style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
          onClick={() => {
            darkToggle(!dark);
          }}
        >
          {!dark ? 'DARKSIDE' : 'FEELING BREEZY?'}
        </Button>

        {children}
      </Grommet>
    );
  }

  // Server-side rendering
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <Grommet theme={grommetTheme} full themeMode={dark ? 'dark' : 'light'}>
        <Button
          style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
          onClick={() => {
            darkToggle(!dark);
          }}
        >
          {!dark ? 'DARKSIDE' : 'FEELING BREEZY?'}
        </Button>
        {children}
      </Grommet>
    </StyleSheetManager>
  );
};

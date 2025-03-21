'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { Grommet } from 'grommet';
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

  // const [dark, darkToggle] = useState(true);

  // Client-side rendering
  if (typeof window !== 'undefined') {
    return (
      <Grommet theme={grommetTheme} full themeMode="dark">
        {/* <Button
          style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
          onClick={() => {
            darkToggle(!dark);
            console.log('nowindow');
          }}
        >
          DARKSIDE
        </Button>
        {dark ? 'its dark' : 'itslightt'} */}
        {children}
      </Grommet>
    );
  }

  // Server-side rendering
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <Grommet theme={grommetTheme} full themeMode="dark">
        {/* <Button
          style={{ zIndex: 4, position: 'absolute', top: 0, left: 0 }}
          onClick={() => {
            darkToggle(!dark);
            console.log('window');
          }}
        >
          DARKSIDE
        </Button> */}
        {children}
      </Grommet>
    </StyleSheetManager>
  );
};

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

  // Client-side rendering
  if (typeof window !== 'undefined') {
    return (
      <Grommet theme={grommetTheme} full themeMode="light">
        {children}
      </Grommet>
    );
  }

  // Server-side rendering
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <Grommet theme={grommetTheme} full themeMode="light">
        {children}
      </Grommet>
    </StyleSheetManager>
  );
};

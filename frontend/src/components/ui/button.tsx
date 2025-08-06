'use client';
import { useState } from 'react';
import { Button as GrommetButton, Paragraph, Anchor, Text, Box } from 'grommet';

export const Button = () => {
  return <GrommetButton></GrommetButton>;
};

export const MoreInfo = () => {
  const [isOpen, isOpenSet] = useState(false);

  return (
    <Box height="140px">
      <Paragraph margin={{ vertical: 'medium' }} fill>
        {/* {isOpen ? ( */}
        <Paragraph margin={{ vertical: 'medium' }} fill>
          <Text weight="bold">LAST SUMMER</Text> follows Anne, a brilliant lawyer who lives with her
          husband Pierre and their daughters. Anne gradually engages in a passionate relationship
          with Theo, Pierre's son from a previous marriage, putting her career and family life in
          danger.
        </Paragraph>
        {/* ) : null} */}
        <Anchor
          onClick={() => isOpenSet(!isOpen)}
          style={{
            textDecoration: 'underline',

            fontWeight: '400',
          }}
        >
          MORE INFO
        </Anchor>
      </Paragraph>
    </Box>
  );
};

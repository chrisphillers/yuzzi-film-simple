import { getAbout } from '@/lib/data';
import { Box, Text, Paragraph, Button, Page, Anchor } from 'grommet';

// const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
//   width: { max: '1200px' },
//   margin: 'auto',
//   pad: { horizontal: 'medium' },
//   fill: 'horizontal',
// };

export default async function About() {
  // Server-side fetch the feature film data
  const aboutUs = await getAbout();

  const { content } = aboutUs;
  console.log(content);

  return (
    <Box>
      {/* TODO: Sort html/Grommet semantics paragraph/page etc */}

      <Paragraph margin={{ top: 'small', bottom: 'none' }} fill>
        {content.map((para) => (
          <Text key={para}>{para}</Text>
        ))}
      </Paragraph>

      <Box align="end" margin={{ vertical: 'small' }}>
        <Button
          plain
          hover={{ color: 'blue' }}
          style={{
            textDecoration: 'underline',
            size: '24px',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          READ MORE
        </Button>
      </Box>
      <Box alignContent="center" justify="center" align="center">
        <Page
          style={{ maxWidth: '650px' }}
          // margin={{ horizontal: 'xxlarge' }}
        >
          {/* <FilmArticleContent article={featureFilm}></FilmArticleContent> */}

          <Box>
            <Text>Contact</Text>
            <Anchor>hello@lecinemaclub.com</Anchor>
          </Box>
        </Page>
      </Box>
    </Box>
  );
}

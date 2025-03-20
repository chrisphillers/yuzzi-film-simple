import { getFeatureFilm } from '@/lib/data';
import { Box, Text, BoxExtendedProps, Anchor, Paragraph } from 'grommet';
import { Hero } from '../components/hero';

const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
  width: { max: '1000px' },
  margin: 'auto',
  pad: { horizontal: 'medium' },
  fill: 'horizontal',
};

export default async function Home() {
  // Server-side fetch the feature film data
  const featureFilm = await getFeatureFilm();

  const { film, content } = featureFilm;

  return (
    <Box {...CONTENT_WIDTH_PROPS}>
      <Hero title={film.title} />

      {/* TODO: Sort html/Grommet semantics paragraph/page etc */}

      <Paragraph margin={{ top: 'small', bottom: 'none' }} fill>
        <Text weight="bold">LUTTE JEUNESSE</Text> a film by{' '}
        <Text weight="bold">THIERRY DE PERETTI</Text>. 2018. 55 min. A simple casting process
        becomes a sociological inquiry into Corsican nationalism in this short film by the acclaimed
        French filmmaker.
      </Paragraph>

      <Box align="end" margin={{ vertical: 'small' }}>
        {/* TODO: Fix Link issue */}
        {/* <Link href={'/somewhere'} passHref legacyBehavior> */}
        <Anchor
          size="medium"
          weight={'light'}
          hover={{ textDecoration: 'underline', color: 'brand' }}
        >
          READ MORE
        </Anchor>
        {/* </Link> */}
      </Box>
      <Box alignContent="center" justify="center" align="center">
        <Paragraph fill={true} margin={{ horizontal: 'xlarge' }}>
          {content}
        </Paragraph>
      </Box>
    </Box>
  );
}

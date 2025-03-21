import { getFeatureFilm } from '@/lib/data';
import { Box, Text, BoxExtendedProps, Paragraph, Button } from 'grommet';
import { Hero } from '../components/hero';

const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
  width: { max: '1200px' },
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
        <Paragraph fill={true} margin={{ horizontal: 'xlarge' }}>
          {content}
        </Paragraph>
      </Box>
    </Box>
  );
}

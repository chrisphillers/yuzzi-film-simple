import { type Film } from '@/lib/data';
// import { Button } from '@/components/ui/button';
import { Box, Text, Button } from 'grommet';
import { Hero } from './hero';

interface FilmFeatureProps {
  film: Film;
  content: React.ReactNode;
}

export function FilmFeature({ film, content }: FilmFeatureProps) {
  return (
    <Box width="900px" margin={{ horizontal: 'auto' }} gap="small">
      <Hero title={film.title} />
      <Box>
        <Text>
          <Text weight="bold">LUTTE JEUNESSE</Text> a film by{' '}
          <Text weight="bold">THIERRY DE PERETTI</Text>. 2018. 55 min. A simple casting process
          becomes a sociological inquiry into Corsican nationalism in this short film by the
          acclaimed French filmmaker.
        </Text>
      </Box>

      <Box align="end" margin={{ vertical: 'small' }}>
        {/* <GrommetButton variant="text-underline" >READ MORE</GrommetButton> */}
        <Button variant="text-underline" size="large" type="button">
          READ MORE
        </Button>
      </Box>

      <Box alignContent="center" justify="center" align="center">
        {content}
      </Box>
    </Box>
  );
}

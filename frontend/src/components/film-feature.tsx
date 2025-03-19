import { type Film } from '@/lib/data';
// import { Button } from '@/components/ui/button';
import { Box, Text, Button } from 'grommet';

interface FilmFeatureProps {
  film: Film;
  content: React.ReactNode;
}

export function FilmFeature({ film, content }: FilmFeatureProps) {
  return (
    <Box
      width="700px"
      // maxWidth="500px"
      // alignContent='center'
      margin={{ horizontal: 'auto' }}
    >
      <Box margin={{ bottom: 'medium' }}>
        {/* Film placeholder with background color */}
        <Box
          height="medium"
          background={{ color: film.backgroundColor || '#333' }}
          style={{ position: 'relative', aspectRatio: '16/9' }}
        >
          {/* Filmstrip design elements for cinematic feel */}
          <Box fill align="center" justify="center" style={{ position: 'absolute' }}>
            <Text size="xlarge" weight="bold" color="white" opacity="0.3">
              {film.title}
            </Text>
          </Box>
        </Box>
      </Box>

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

      <Box
        alignContent="center"
        justify="center"
        align="center"

        // width="medium"
        // margin={{ horizontal: 'auto' }}
      >
        {content}
      </Box>
    </Box>
  );
}

import { getFeatureFilm } from '@/lib/data';
import { Box, Text, Page, Paragraph, Anchor } from 'grommet';
import { Hero } from '../components/hero';
import { FilmArticleContent } from '../components/film-article';
// import { Watch } from '../components/modals/watch';

export default async function Home() {
  // Server-side fetch the feature film data
  const featureFilm = await getFeatureFilm();

  const { film } = featureFilm;

  return (
    <section>
      <Box margin={{ top: 'medium' }}>
        <Box height="100vh">
          <Hero title={film.title} />

          {/* TODO: Sort html/Grommet semantics paragraph/page etc */}

          <Paragraph margin={{ vertical: 'medium' }} fill>
            <Text weight="bold">LUTTE JEUNESSE</Text> a film by{' '}
            <Text weight="bold">THIERRY DE PERETTI</Text>. 2018. 55 min. A simple casting process
            becomes a sociological inquiry into Corsican nationalism in this short film by the
            acclaimed French filmmaker.
          </Paragraph>

          <Box align="end" margin={{ vertical: 'small' }}>
            <Anchor
              style={{
                textDecoration: 'underline',

                fontWeight: '400',
              }}
            >
              READ MORE
            </Anchor>
          </Box>
        </Box>
        <Box alignContent="center" justify="center" align="center">
          <Page
            kind="narrow"
            style={{ maxWidth: '650px' }}
            // margin={{ horizontal: 'xxlarge' }}
          >
            <FilmArticleContent article={featureFilm}></FilmArticleContent>
          </Page>
        </Box>
      </Box>
      {/* <Watch /> */}
      {/* <ScrollTestOverride />
      <ScrollDebugger /> */}
    </section>
  );
}

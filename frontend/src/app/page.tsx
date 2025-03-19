import { getFeatureFilm } from '@/lib/data';
import { FilmFeature } from '@/components/film-feature';
import { FilmArticleContent } from '@/components/film-article';
import { Box, ThemeContext } from 'grommet';
import { ModalMenu } from '@/components/nav-bar';

export default async function Home() {
  // Server-side fetch the feature film data
  const featureFilm = await getFeatureFilm();

  return (
    <Box
      width="large"
      margin={{ horizontal: 'auto', top: 'medium' }}
      // alignContent="center"
    >
      <FilmFeature film={featureFilm.film} content={<FilmArticleContent article={featureFilm} />} />

      <ModalMenu></ModalMenu>
    </Box>
  );
}

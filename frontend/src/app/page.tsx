import { getFeatureFilm } from '@/lib/data';
import { FilmFeature } from '@/components/film-feature';
import { FilmArticleContent } from '@/components/film-article';

export default async function Home() {
  // Server-side fetch the feature film data
  const featureFilm = await getFeatureFilm();

  return (
    <div className="mx-auto w-full max-w-5xl pt-8">
      <FilmFeature film={featureFilm.film} content={<FilmArticleContent article={featureFilm} />} />
    </div>
  );
}

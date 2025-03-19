import { type Film } from '@/lib/data';
import { Button } from '@/components/ui/button';

interface FilmFeatureProps {
  film: Film;
  content: React.ReactNode;
}

export function FilmFeature({ film, content }: FilmFeatureProps) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4">
        {/* Film placeholder with background color */}
        <div
          className="relative aspect-[16/9] w-full"
          style={{ backgroundColor: film.backgroundColor || '#333' }}
        >
          {/* Filmstrip design elements for cinematic feel */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-white opacity-30">{film.title}</div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm">
          <span className="font-bold">LUTTE JEUNESSE</span> a film by{' '}
          <span className="font-bold">THIERRY DE PERETTI</span>. 2018. 55 min. A simple casting
          process becomes a sociological inquiry into Corsican nationalism in this short film by the
          acclaimed French filmmaker.
        </p>
      </div>

      <div className="mb-4 text-right">
        <Button variant="text-underline">READ MORE</Button>
      </div>

      <div className="prose mx-auto max-w-[500px]">{content}</div>
    </div>
  );
}

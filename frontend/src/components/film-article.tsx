import { type FilmArticle } from '@/lib/data';

interface FilmArticleContentProps {
  article: FilmArticle;
}

export function FilmArticleContent({ article }: FilmArticleContentProps) {
  return (
    <div className="mx-auto max-w-3xl">
      {article.content.map((paragraph, index) => (
        <p key={index} className="mb-4 text-base leading-relaxed">
          {paragraph}
        </p>
      ))}

      {article.quotes.map((quote, index) => (
        <div key={index} className="my-4 py-4">
          <blockquote className="mb-2 font-medium">
            "{quote.text} {quote.author}"
          </blockquote>
        </div>
      ))}
    </div>
  );
}

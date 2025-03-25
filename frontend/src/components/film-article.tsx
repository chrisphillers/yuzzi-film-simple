import { type FilmArticle } from '@/lib/data';
import { Paragraph, Text, Box } from 'grommet';
import Image from 'next/image';

interface FilmArticleContentProps {
  article: FilmArticle;
}

// const featureFilm = await getAllFilms();

export function FilmArticleContent({ article }: FilmArticleContentProps) {
  return (
    <Box margin={'small'}>
      {article.content.map((paragraph, index) => (
        <Paragraph key={index} fill={true}>
          {paragraph}
        </Paragraph>
      ))}
{/* TODO: Replace with Grommet when fixed */}
      <Image
        src="/yuzzi-test.png"
        objectFit="cover"
        width={530}
        height={300}
        alt="Picture of the author"
      />
      {article.quotes.map((quote, index) => (
        <Paragraph key={index} pad={{ vertical: 'medium' }} fill>
          <Text weight="bold">
            "{quote.text} {quote.author}"
          </Text>
        </Paragraph>
      ))}
      {article.content.map((paragraph, index) => (
        <Paragraph key={index} fill={true}>
          {paragraph}
        </Paragraph>
      ))}
    </Box>
  );
}

import { type FilmArticle } from '@/lib/data';
import { Box, Paragraph, Text } from 'grommet';

interface FilmArticleContentProps {
  article: FilmArticle;
}

export function FilmArticleContent({ article }: FilmArticleContentProps) {
  return (
    <Box align="center" margin={'large'}>
      {article.content.map((paragraph, index) => (
        <Paragraph margin={'small'} key={index} fill={true}>
          {paragraph}
        </Paragraph>
      ))}

      {article.quotes.map((quote, index) => (
        <Box key={index} margin={{ vertical: 'medium' }} pad={{ vertical: 'medium' }}>
          <Text weight="bold">
            "{quote.text} {quote.author}"
          </Text>
        </Box>
      ))}
    </Box>
  );
}

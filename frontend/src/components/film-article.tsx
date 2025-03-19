import { type FilmArticle } from '@/lib/data';
import { Box, Paragraph, Text } from 'grommet';

interface FilmArticleContentProps {
  article: FilmArticle;
}

export function FilmArticleContent({ article }: FilmArticleContentProps) {
  return (
    <Box
      // width="large"
      // margin={{ horizontal: 'auto' }}
      align="center"
      margin={'large'}
      // maxWidth="400px"
    >
      {article.content.map((paragraph, index) => (
        <Paragraph
          margin={'small'}
          //  alignSelf='stretch'
          key={index}
          fill={true}

          //  margin={{ bottom: 'medium' }}
          // size="large"
        >
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

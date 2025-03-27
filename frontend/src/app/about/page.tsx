import { getAbout } from '@/lib/data';
import { Carousel, Copy, AboutNav, Contact } from './components';
import { Page, PageContent, Box } from 'grommet';

// const CONTENT_WIDTH_PROPS: BoxExtendedProps = {
//   width: { max: '1200px' },
//   margin: 'auto',
//   pad: { horizontal: 'medium' },
//   fill: 'horizontal',
// };

export default async function About() {
  // Server-side fetch the feature film data
  const aboutUs = await getAbout();

  const { content, nav } = aboutUs;

  return (
    <section>
      <Box align="center" margin={{ vertical: 'large' }}>
        <Page kind="narrow">
          <PageContent gap={'xlarge'}>
            {/* TODO: Sort html/Grommet semantics paragraph/page etc */}

            <Copy content={content}></Copy>
            <Carousel></Carousel>
            <Contact></Contact>
            <AboutNav aboutUsNav={nav}></AboutNav>
          </PageContent>
        </Page>
      </Box>
    </section>
  );
}

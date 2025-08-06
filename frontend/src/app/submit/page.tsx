import { Heading, Page, Box } from 'grommet';
import { getAbout } from '@/lib/data';
// import { Metadata } from 'next';
import { FilmSubmissionForm } from '../about/components';

//TODO - dynamic metadata
// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//   const product = await fetch(`https://.../${params.id}`).then((res) => res.json());

//   return {
//     title: product.title,
//     openGraph: {
//       images: [`https://example.com/products/${params.id}.jpg`],
//     },
//   };
// }

// OR

// export async function generateMetadata({ params }, parent): Promise<Metadata> {
//   const parentMetadata = await parent();
//   return {
//     ...parentMetadata,
//     title: `Yuzzi - ${params.id}`,
//   };
// }
const { nav } = await getAbout();
export default async function Submit() {
  return (
    <section>
      <Box align="center" margin={{ top: 'large' }}>
        <Heading level={2} margin="none" textAlign="center">
          SUBMIT A FILM
        </Heading>
        <Page kind="narrow" width={'small'}>
          {/* @ts-expect-error: Typescript error - just a placeholder so no need to fix now */}
          <FilmSubmissionForm content={nav[0].content}></FilmSubmissionForm>
        </Page>
      </Box>
    </section>
  );
}

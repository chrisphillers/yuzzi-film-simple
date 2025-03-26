import { Header } from 'grommet';
import { SidebarLayout } from '../layout';
// import { Metadata } from 'next';

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
//     title: `Le Yuzzi - ${params.id}`,
//   };
// }

export default async function Articles() {
  return (
    <SidebarLayout>
      <Header>Articles</Header>
    </SidebarLayout>
  );
}

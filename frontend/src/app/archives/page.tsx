import { Heading, Page, Box, Anchor, Paragraph } from 'grommet';

// Define the Director type first (before it's used)
type Director = {
  director: string;
  link: string;
};

const directors: Director[] = [
  { director: 'Alex Garland', link: '/alex-garland' },
  { director: 'Gaspar Noe', link: '/gaspar-noe' },
  { director: 'Albert Serra', link: '/albert-serra' },
  { director: 'Alex Ross Perry', link: '/alex-ross-perry' },
  { director: 'Alice Rohrwacher', link: '/alice-rohrwacher' },
  { director: 'Andrew Bujalski', link: '/andrew-bujalski' },
  { director: 'Andrew Haigh', link: '/andrew-haigh' },
  { director: 'Animal Collective', link: '/animal-collective' },
  { director: 'Antonio Campos', link: '/antonio-campos' },
  { director: 'Apichatpong Weerasethakul', link: '/apichatpong-weerasethakul' },
  { director: 'Ari Aster', link: '/ari-aster' },
  { director: 'Arnaud Desplechin', link: '/arnaud-desplechin' },
  { director: 'Ayo Akingbade', link: '/ayo-akingbade' },
  { director: 'Benh Zeitlin', link: '/benh-zeitlin' },
  { director: 'Benny Safdie', link: '/benny-safdie' },
  { director: 'Bertrand Bonello', link: '/bertrand-bonello' },
  { director: 'Bong Joon-Ho', link: '/bong-joon-ho' },
  { director: 'Brady Corbet', link: '/brady-corbet' },
  { director: 'Catherine Breillat', link: '/catherine-breillat' },
  { director: 'Chloë Sevigny', link: '/chloe-sevigny' },
  { director: 'Christian Petzold', link: '/christian-petzold' },
  { director: 'Chiara Mastroianni', link: '/chiara-mastroianni' },
  { director: 'Christophe Honoré', link: '/christophe-honore' },
  { director: 'Christopher Abbott', link: '/christopher-abbott' },
  { director: 'Claire Denis', link: '/claire-denis' },
  { director: 'Clément Cogitore', link: '/clement-cogitore' },
  { director: 'Corneliu Porumboiu', link: '/corneliu-porumboiu' },
  { director: 'Dennis Lim', link: '/dennis-lim' },
  { director: 'Daniel Lopatin', link: '/daniel-lopatin' },
  { director: 'Darius Khondji', link: '/darius-khondji' },
  { director: 'Dasha Nekrasova', link: '/dasha-nekrasova' },
  { director: 'David Lowery', link: '/david-lowery' },
  { director: 'David Raboy', link: '/david-raboy' },
  { director: 'Debra Granik', link: '/debra-granik' },
  { director: 'Dustin Guy Defa', link: '/dustin-guy-defa' },
  { director: 'Ezra Koenig', link: '/ezra-koenig' },
  { director: 'Emmanuel Mouret', link: '/emmanuel-mouret' },
  { director: 'Frederick Wiseman', link: '/frederick-wiseman' },
  { director: 'Frank Lebon', link: '/frank-lebon' },
  { director: 'Gabrielle Chanel', link: '/gabrielle-chanel' },
  { director: 'Garrett Bradley', link: '/garrett-bradley' },
  { director: 'Gio Escobar', link: '/gio-escobar' },
  { director: 'Griffin Dunne', link: '/griffin-dunne' },
  { director: 'Hildur Guðnadóttir', link: '/hildur-gudnadottir' },
  { director: 'Harmony Korine', link: '/harmony-korine' },
  { director: 'Hoyte van Hoytema', link: '/hoyte-van-hoytema' },
  { director: 'Ira Sachs', link: '/ira-sachs' },
  { director: 'Isabelle Huppert', link: '/isabelle-huppert' },
  { director: 'Jean-Pierre and Luc Dardenne', link: '/jean-pierre-and-luc-dardenne' },
  { director: 'James Gray', link: '/james-gray' },
  { director: 'Jane Schoenbrun', link: '/jane-schoenbrun' },
  { director: 'Janicza Bravo', link: '/janicza-bravo' },
  { director: 'Jean-Paul Civeyrac', link: '/jean-paul-civeyrac' },
  { director: 'Jessica Beshir', link: '/jessica-beshir' },
  { director: 'Joachim Trier', link: '/joachim-trier' },
  { director: 'John Carpenter', link: '/john-carpenter' },
  { director: 'John Wilson', link: '/john-wilson' },
  { director: 'Jon Dieringer', link: '/jon-dieringer' },
  { director: 'Jonah Hill', link: '/jonah-hill' },
  { director: 'Josephine Decker', link: '/josephine-decker' },
  { director: 'Josh Safdie', link: '/josh-safdie' },
  { director: 'Joshua Citarella', link: '/josua-citarella' },
  { director: 'Justine Triet', link: '/justine-triet' },
  { director: 'Kelly Reichardt', link: '/kelly-reichardt' },
  { director: 'Kim Gordon', link: '/kim-gordon' },
  { director: 'Kiyoshi Kurosawa', link: '/kiyoshi-kurosawa' },
  { director: 'Louis Garrel', link: '/louis-garrel' },
  { director: 'Luca Guadagnino', link: '/luca-guadagnino' },
  { director: 'Lynne Ramsay', link: '/lynne-ramsay' },
  { director: 'Léa Seydoux', link: '/lea-seydoux' },
  { director: 'Mark Jenkin', link: '/mark-jenkin' },
  { director: 'Mary Bronstein', link: '/mary-bronstein' },
  { director: 'Martine Syms', link: '/martine-syms' },
  { director: 'Matías Piñeiro', link: '/matias-pineiro' },
  { director: 'Michael Almereyda', link: '/michael-almereyda' },
  { director: 'Michael Lindsay-Hogg', link: '/michael-lindsay-hogg' },
  { director: 'Monte Hellman', link: '/monte-hellman' },
  { director: 'Nathan Silver', link: '/nathan-silver' },
  { director: 'Nicholas Britell', link: '/nicholas-britell' },
  { director: 'Nadav Lapid', link: '/nadav-lapid' },
  { director: 'Nick Pinkerton', link: '/nick-pinkerton' },
  { director: 'Olivier Assayas', link: '/olivier-assayas' },
  { director: 'Olympia Le-Tan', link: '/olympia-le-tan' },
  { director: 'Owen Kline', link: '/owen-kline' },
  { director: 'Paris Patrick Radden Keefe', link: '/paris-patrick-radden-keefe' },
  { director: 'Pierre Rissient', link: '/pierre-rissient' },
  { director: 'Pietro Marcello', link: '/pietro-marcello' },
  { director: 'Radu Jude', link: '/radu-jude' },
  { director: 'Rebecca Zlotowski', link: '/rebecca-zlotowski' },
  { director: 'Richard Misek', link: '/richard-misek' },
  { director: "Ricky D'Ambrose", link: '/ricky-dambrose' },
  { director: 'Robert Eggers', link: '/robert-eggers' },
  { director: 'Robert Pattinson', link: '/robert-pattinson' },
  { director: 'Ryusuke Hamaguchi', link: '/ryusuke-hamaguchi' },
  { director: 'Sofia Coppola', link: '/sofia-coppola' },
  { director: 'Su Friedrich', link: '/su-friedrich' },
  { director: 'Sean Baker', link: '/sean-baker' },
  { director: 'Sean Durkin', link: '/sean-durkin' },
  { director: 'Sean Price Williams', link: '/sean-price-williams' },
  { director: 'Sebastián Silva', link: '/sebastian-silva' },
  { director: 'Sigrid Bouaziz', link: '/sigrid-bouaziz' },
  { director: 'Simon Cahn', link: '/simon-cahn' },
  { director: 'Ted Fendt', link: '/ted-fendt' },
  { director: 'Trey Edward Shults', link: '/trey-edward-shults' },
  { director: 'Tsai Ming-Liang', link: '/tsai-ming-liang' },
  { director: 'Ulrich Köhler', link: '/ulrich-kohler' },
  { director: 'Vicky Krieps', link: '/vicky-krieps' },
  { director: 'Virgil Vernier', link: '/virgil-vernier' },
  { director: 'Whit Stillman', link: '/whit-stillman' },
  { director: 'Wim Wenders', link: '/wim-wenders' },
  { director: 'Wes Anderson', link: '/wes-anderson' },
  { director: 'Yann Gonzalez', link: '/yann-gonzalez' },
  { director: 'Yorgos Lanthimos', link: '/yorgos-lanthimos' },
];

// Main component
export default async function Archives() {
  return (
    <section>
      <Box align="center" margin={{ top: 'medium' }}>
        <Heading level={2}>ARCHIVES</Heading>
        <Paragraph fill>A small selection of our previously screened Directors.</Paragraph>
        <Page margin={{ top: 'medium' }}>
          <Box flex direction="row" wrap>
            {directors.map((directorInfo) => (
              <ArchiveItem key={directorInfo.link} directorInfo={directorInfo} />
            ))}
          </Box>
        </Page>
      </Box>
    </section>
  );
}

// ArchiveItem component with proper typing
const ArchiveItem: React.FC<{ directorInfo: Director }> = ({ directorInfo }) => {
  const { director } = directorInfo;
  return (
    <Box
      align="center"
      justify="center"
      flex="grow"
      basis="1/3"
      pad={'medium'}
      style={{ minWidth: '400px' }}
      // background={'yellow'}
    >
      <Anchor
        label={director.toUpperCase()}
        style={{
          fontSize: '36px',
          // backgroundColor: 'red'
        }}
      ></Anchor>
    </Box>
  );
};

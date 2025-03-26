export type Film = {
  title: string;
  director: string;
  year: number;
  length: string;
  description: string;
  backgroundColor?: string; // For placeholder styling
  isFeature?: boolean;
};

export type FilmArticle = {
  film: Film;
  content: string[];
  quotes: {
    text: string;
    author: string;
  }[];
};

export type AboutUs = {
  title: string;
  content: string[];
};

// Dummy data for server-side rendering
export async function getFeatureFilm(): Promise<FilmArticle> {
  return {
    film: {
      title: 'LUTTE JEUNESSE',
      director: 'THIERRY DE PERETTI',
      year: 2018,
      length: '55 min',
      description:
        'A simple casting process becomes a sociological inquiry into Corsican nationalism in this short film by the acclaimed French filmmaker.',
      backgroundColor: '#6c5b7b', // Purple-ish tone for feature film
      isFeature: true,
    },
    content: [
      "Filmmaker Thierry de Peretti has made his native island of Corsica (a French region that has long sought sovereignty) the subject of his directorial career. To celebrate the presentation of his newest film, A Son Image, at this year's edition of Rendez-Vous with French Cinema — Film at Lincoln Center's annual showcase of French cinema — we're proud to present his interview-based featurette Lutte jeunesse.",
      'Ahead of his sophomore film, Une vie violente, Peretti and his casting director, Julie Allione, staged a "wild casting call" in which they plastered posters all over Corsica to gather actors for the project. Lutte jeunesse collects these interviews, transforming a simple pre-production process into a sociological inquiry on the relationship between the island\'s youth and nationalism.',
      'Peretti regularly works with non-professional actors and Lutte jeunesse provides viewers with a window into his collaborative and research intensive approach to filmmaking. In an interview with Débordements, he noted that, "the idea is that all the people who come to the casting are in the film, even in smaller roles." Even if a prospective actor is not cast in the film, Peretti\'s growing body of work attests to the fact that their concerns and ideas about the state of Corsican culture and politics remain onscreen. Through its combination of interviews and its focus on how young Corsican men feel about their island, Lutte jeunesse compresses Peretti\'s interests into a 55-minute mosaic that reflects the politics of his fellow Corsicans and his own people-driven approach to filmmaking.',
    ],
    quotes: [
      {
        text: "I really like groups, gangs. It's very cinematic. A group is, in a snapshot, a condensation, a piece of society.",
        author: 'THIERRY DE PERETTI',
      },
    ],
  };
}

export async function getAbout(): Promise<AboutUs> {
  return {
    title: 'About',
    content: [
      'Le Cinéma Club is a uniquely curated streaming platform screening one film every week, for free. Available for seven days to all visitors globally, selections vary in genre and length, with special attention given to short formats',
      'Founded in 2015, the platform acts as a dynamic online cinema space, providing exciting access to diverse and original voices. Screenings celebrate a new generation of filmmakers, alongside rare gems and other inspiring discoveries. Our Journal features curated film lists, exclusive interviews and image galleries. With roots in New York and Paris, Le Cinéma Club is a weekly rendezvous for movie lovers and filmmakers around the world.',
      'Le Cinéma Club is presented with the support of CHANEL.',
    ],
  };
}

export async function getAllFilms(): Promise<Film[]> {
  // In a real application, this would fetch from an API
  return [
    {
      title: 'LUTTE JEUNESSE',
      director: 'THIERRY DE PERETTI',
      year: 2018,
      length: '55 min',
      description:
        'A simple casting process becomes a sociological inquiry into Corsican nationalism in this short film by the acclaimed French filmmaker.',
      backgroundColor: '#6c5b7b',
      isFeature: true,
    },
    {
      title: 'A Son Image',
      director: 'THIERRY DE PERETTI',
      year: 2021,
      length: '110 min',
      description:
        "An adaptation of Jérôme Ferrari's award-winning novel of the same name, tracing the history of political radicalism in '90s Corsica.",
      backgroundColor: '#355c7d',
    },
    {
      title: 'Les Apaches',
      director: 'THIERRY DE PERETTI',
      year: 2013,
      length: '82 min',
      description:
        "Premiered in Cannes Director's Fortnight, following a crime drama set in Corsica.",
      backgroundColor: '#2c3e50',
    },
    {
      title: 'Une vie violente',
      director: 'THIERRY DE PERETTI',
      year: 2017,
      length: '107 min',
      description: 'A drama about Corsican nationalism and violence.',
      backgroundColor: '#4a4e4d',
    },
  ];
}

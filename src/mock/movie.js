import { getRandomInteger } from '../utils.js';

const ages = [6, 12, 18, 21];
const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller'];

const getMovies = () => ({
  'Made for each other': 'made-for-each-other.jpg',
  'Popeye meets sinbad': 'popeye-meets-sinbad.jpg',
  'Sagebrush trail': 'sagebrush-trail.jpg',
  'Santa claus conquers the martians': 'santa-claus-conquers-the-martians.jpg',
  'The dance of life': 'the-dance-of-life.jpg',
  'The great flamarion': 'the-great-flamarion.jpg',
  'The man with the golden arm': 'the-man-with-the-golden-arm.jpg',
});

const getCommentsIds = () => {
  const ids = new Set();

  for (let i = 0; i <= getRandomInteger(1, 5); i++) {
    ids.add(getRandomInteger(1, 5));
  }

  return ids;
};

const getTitle = () => {
  const values = Object.keys(getMovies());

  return values[getRandomInteger(0, values.length - 1)];
};

const getGenres = () => {
  const genresReturned = new Set();

  for (let i = 0; i <= getRandomInteger(1, 3); i++) {
    genresReturned.add(genres[getRandomInteger(0, genres.length - 1)]);
  }

  return Array.from(genresReturned);
};

const getRandomBoolean = () => getRandomInteger() === 1;

export const generateMovie = () => {
  const title = getTitle();

  return ({
    'id': getRandomInteger(1, 5),
    'comments': Array.from(getCommentsIds()),
    'film_info': {
      'title': title,
      'alternative_title': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'total_rating': getRandomInteger(1, 9) + 0.5,
      'poster': `./images/posters/${getMovies()[title]}`,
      'age_rating': `${ages[getRandomInteger(0, ages.length - 1)]}+`,
      'director': 'Director Directorovich',
      'writers': ['Biba', 'Boba'].join(', '),
      'actors': ['Leonardo DiCaprio', 'Leonardo DiCaprio', 'Leonardo DiCaprio', 'Leonardo DiCaprio'].join(', '),
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'release_country': 'USA',
      },
      'runtime': '1h 55m',
      'genre': getGenres().join(', '),
      'description': 'Nullam tortor velit, aliquam sed semper quis, posuere ac felis. Etiam tempus cursus ante id dapibus. Curabitur et dictum felis, in ullamcorper sapien. Nulla non eros vel mi blandit tincidunt et ut nibh.',
    },
    'user_details': {
      'watchlist': getRandomBoolean(),
      'already_watched': getRandomBoolean(),
      'watching_date': '2019-04-12T16:12:32.554Z',
      'favorite': getRandomBoolean(),
    }
  });
};

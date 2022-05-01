import { getRandomInteger, humanizeFullDate } from '../utils.js';
import dayjs from 'dayjs';

const getNames = () => ['Jacob', 'Emily', 'Michael', 'Emma', 'Joshua'];
const getEmotion = () => ['smile', 'sleeping', 'puke', 'angry'];

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generateComment = () => {
  let date = generateDate();

  switch (dayjs().diff(date, 'day')) {
    case 0:
      date = 'Today';
      break;
    case 1:
      date = 'Yesterday';
      break;
    case 2:
      date = '2 days ago';
      break;
    default:
      date = humanizeFullDate(date);
      break;
  }

  return {
    'id': getRandomInteger(1, 5),
    'author': getNames()[getRandomInteger(0, getNames().length - 1)],
    'comment': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'date': date,
    'emotion': getEmotion()[getRandomInteger(0, getEmotion().length - 1)],
  };
};

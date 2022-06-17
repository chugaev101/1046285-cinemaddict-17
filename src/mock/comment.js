import { getRandomInteger } from '../utils.js';
import dayjs from 'dayjs';

const getNames = () => ['Jacob', 'Emily', 'Michael', 'Emma', 'Joshua'];
const getEmotion = () => ['smile', 'sleeping', 'puke', 'angry'];

const generateDate = () => {
  const maxDaysGap = 7;
  const maxHoursGap = 23;
  const maxMinutesGap = 59;
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  const hoursGap = getRandomInteger(0, maxHoursGap);
  const minutesGap = getRandomInteger(0, maxMinutesGap);

  return dayjs().add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute').toDate();
};

export const generateComment = () => ({
  'id': getRandomInteger(1, 15),
  'author': getNames()[getRandomInteger(0, getNames().length - 1)],
  'comment': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'date': generateDate(),
  'emotion': getEmotion()[getRandomInteger(0, getEmotion().length - 1)],
});

require('dotenv').config();

export const requestOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-rapidapi-key': process.env.API_KEY,
  },
  redirect: 'follow',
};

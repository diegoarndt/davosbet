$(document).ready(function () {
  generateEventDates();

  getFixtures();

  $('.event-date').click(function () {
    const selectedDate = $(this).data('date');
    const leagueId = $('.country.selected').data('id');

    getFixtures(selectedDate, leagueId);
  });

  $('#includedContent').load('/pages/england.html');

  $('.country').click((e) => {
    $('.country.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    const country = e.target.name;
    $('#includedContent').load(`/pages/${country}.html`);

    const leaguesByCountry = {
      england: 39,
      spain: 140,
      argentina: 113,
      italy: 135,
      brazil: 118,
      france: 61,
      usa: 1996,
      germany: 78,
    };
    const selectedDate = $('.event-dates').find('.selected').data('date');
    const leagueId = leaguesByCountry[country];

    getFixtures(selectedDate, leagueId);
  });
});

const generateEventDates = () => {
  const today = dayjs();

  for (let i = 0; i < 7; i++) {
    const date = today.add(i, 'day');
    const formattedDate = date.format('ddd, DD MMM').toUpperCase();

    const listItem = $('<li class="list-inline-item"></li>');
    const displayDateFormatted = date.format('YYYY-MM-DD');

    if (i === 0) {
      listItem.append(
        '<button type="button" class="btn btn-light event-date selected" data-date="' +
          displayDateFormatted +
          '">Live</button>'
      );
    } else {
      listItem.append(
        '<a href="#" class="btn btn-outline-secondary event-date" data-date="' +
          displayDateFormatted +
          '">' +
          formattedDate +
          '</a>'
      );
    }

    $('.event-dates').append(listItem);
  }

  $('.event-date').click(function () {
    $('.event-date.selected').removeClass('selected');
    $(this).addClass('selected');
  });
};

const getFixtures = (
  date = $('.event-dates').find('.selected').data('date'),
  league = '39'
) => {
  //spare api key = 6ee2887d8ef0af49a956931ffac86c0b
  const apiKey = '4b98045c42932f028e130bfc111e4ea4';

  const requestOptions = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': apiKey,
    },
    redirect: 'follow',
  };

  const endpoint = 'fixtures';
  const season = '2022';

  fetch(
    `https://v3.football.api-sports.io/${endpoint}?league=${league}&season=${season}&date=${date}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      addFixturesToPage(data.response);
    })
    .catch((error) => console.log('error', error));
};

const addFixturesToPage = (fixtures) => {
  const matches = fixtures;

  if (matches.length === 0) {
    $('.matches').html(`
        <div class="d-flex flex-grow-1 justify-content-center align-items-center p-5">
          <span class="text-muted">No live match happening at the moment</span>
        </div>
      `);
  } else {
    $('.matches').empty();

    matches.forEach((match) => {
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeScore = match.goals.home ?? '';
      const awayScore = match.goals.away ?? '';
      const date = dayjs(match.fixture.date).format('ddd, MMM DD, hh:mm A');
      const referee = match.fixture.referee || 'To be defined';
      const stadium = match.fixture.venue.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;

      const card = `
            <div class="card bg-black text-white mb-3">
              <div class="card-body">
                <h5 class="card-title">
                  <div class="d-flex justify-content-center align-items-center">
                    <img src="${homeLogo}" width="25" alt="${homeTeam} logo" class="team-logo mr-2">
                    <span>${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}</span>
                    <img src="${awayLogo}" width="25" alt="${awayTeam} logo" class="team-logo ml-2">
                  </div>
                </h5>
              </div>
              <div class="card-footer text-center">
                <p class="card-text">${date}</p>
                <p class="card-text">Referee: ${referee}</p>
                <p class="card-text">Stadium: ${stadium}</p>
              </div>
            </div>
          `;

      $('.matches').append(card);
    });
  }
};

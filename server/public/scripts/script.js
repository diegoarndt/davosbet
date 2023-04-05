import { requestOptions } from './../config/config.js';

$(function () {
  if (!localStorage.getItem('user')) {
    // Redirect the user to the login page if they are not logged in
    window.location.href = '/';
  }

  console.log('User is logged in');

  $('#signout-button').click(() => {
    // Clear the user's ID token from local storage
    localStorage.removeItem('user');
    // Redirect the user to the login page
    window.location.href = '/';
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const displayName = user.displayName;
  if (displayName) {
    $('#dropdownMenuButton').text(displayName);
  }

  generateEventDates();
  getSoccerFixtures();

  $('#sideMenu').load(`/pages/soccerSideMenu.html`);
  $('#includedContent').load(`/pages/fixtures.html`);
});

$(document).on('click', '.event-date', function () {
  const selectedDate = $(this).data('date');

  getSoccerFixtures(selectedDate);
});

$(document).on('click', '.country', function (e) {
  const currentPage = window.location.pathname;
  const targetPage = '/pages/home.html';

  if (currentPage !== targetPage) {
    window.location.href = targetPage;
  }

  $('.country.selected').removeClass('selected');
  $(e.currentTarget).addClass('selected');
  getSoccerFixtures();
});

$(document).on('click keydown', '#search-engine, #query', function (e) {
  if (
    e.type === 'click' ||
    (e.type === 'keydown' && e.key === 'Enter' && e.target.id === 'query')
  ) {
    const query = document.getElementById('query').value;
    if (query) {
      e.preventDefault();
      $('#includedContent').load(`/pages/searchResult.html`);

      $.get('/pages/searchResult.html', function (data) {
        $('.col-9').html(data);
      });

      getTeam(query);
    }
  }
});

const generateEventDates = () => {
  const today = dayjs();
  const qtyOfDays = 7;

  for (let i = 0; i < qtyOfDays; i++) {
    const date = today.add(i, 'day');
    const formattedDate = date.format('ddd, DD MMM').toUpperCase();

    const listItem = $('<li class="list-inline-item"></li>');
    const displayDateFormatted = date.format('YYYY-MM-DD');

    if (i === 0) {
      listItem.append(
        '<button type="button" class="btn btn-light event-date selected" data-date="' +
          displayDateFormatted +
          '">Today</button>'
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

const getTeam = (query) => {
  fetch('https://v3.football.api-sports.io/teams?name=' + query, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const data = result;

      if (data.results === 0) {
        $('#team').html(
          `<span class="text-white">No team found or API is down :(</span>`
        );
        $('#stadium-section').hide();
        return;
      }
      $('#team').html(
        `<span class="text-white">Team: </span>${data.response[0].team.name}`
      );
      $('#venue').html(
        `<span class="text-white">Venue: </span>${data.response[0].venue.name}`
      );
      $('#capacity').html(
        `<span class="text-white">Capacity: </span>${data.response[0].venue.capacity}<span class="text-white"> seats</span>`
      );
      $('#logo').attr('src', data.response[0].venue.image);
    })
    .catch((error) => console.log('error', error));
};

const getSoccerFixtures = (
  date = $('.event-dates').find('.selected').data('date')
) => {
  const endpoint = 'fixtures';
  const league = $('.country.selected').data('id');
  const season = $('.country.selected').data('season');

  console.log(date, league, season);

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

  const countryFlags = {
    england: 'flag-icon-gb',
    spain: 'flag-icon-es',
    italy: 'flag-icon-it',
    germany: 'flag-icon-de',
    france: 'flag-icon-fr',
    netherlands: 'flag-icon-nl',
    portugal: 'flag-icon-pt',
    argentina: 'flag-icon-ar',
    brazil: 'flag-icon-br',
    usa: 'flag-icon-us',
  };

  $('.country-flag').removeClass(function (_, className) {
    return (className.match(/\bflag-icon-\S+/g) || []).join(' ');
  });
  $('.country-flag').addClass(countryFlags[$('.country.selected')[0].name]);
  $('.league-name').text($('.country.selected').data('league'));
  $('.country-name').text($('.country.selected')[0].innerText);

  if (matches.length === 0) {
    $('.matches').html(`
        <div class="d-flex flex-grow-1 justify-content-center align-items-center p-5">
          <span class="text-muted">No matches for today</span>
        </div>
      `);
  } else {
    $('.matches').empty();

    matches.forEach((match) => {
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeScore = match.goals.home ?? '';
      const awayScore = match.goals.away ?? '';

      const referee = match.fixture.referee || 'To be defined';
      const stadium = match.fixture.venue.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;

      const fixtureDate = dayjs(match.fixture.date);
      const formattedTime = fixtureDate.format('ddd, MMM DD, hh:mm A');
      const formattedDate = `${fixtureDate
        .add(1, 'day')
        .format('ddd, MMM DD')} (Not informed)`;
      const timeOrDate = match.fixture.date.split('T')[1].startsWith('00:')
        ? formattedDate
        : formattedTime;
      const date = `${timeOrDate}`;

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
                <p class="card-text">${date}<span></span></p>
                <p class="card-text">Referee: ${referee}</p>
                <p class="card-text">Stadium: ${stadium}</p>
              </div>
            </div>
          `;

      $('.matches').append(card);
    });
  }
};

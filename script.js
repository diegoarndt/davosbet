$(document).ready(function () {
  generateEventDates();

  $('.event-date').click(function () {
    const clickedDate = $(this).text().trim();

    console.log(clickedDate);
  });

  $('#includedContent').load('/pages/england.html');

  $('.btn-container button').click(function (e) {
    $('#includedContent').load(`/pages/${e.target.name}.html`);
  });
});

const generateEventDates = () => {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    const formattedDate = date
      .toLocaleDateString('en-US', options)
      .toUpperCase();

    const listItem = $('<li class="list-inline-item"></li>');
    if (i === 0) {
      listItem.append(
        '<button type="button" class="btn btn-light event-date">Live</button>'
      );
    } else {
      listItem.append(
        '<a href="#" class="btn btn-outline-secondary event-date">' +
          formattedDate +
          '</a>'
      );
    }

    $('.event-dates').append(listItem);
  }
};

$(document).ready(function () {
  $('#includedContent').load('/pages/england.html');

  $('.btn-container button').click(function (e) {
    $('#includedContent').load(`/pages/${e.target.name}.html`);
  });
});

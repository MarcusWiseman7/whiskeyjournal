(($) => {
  const pathname = window.location.pathname;

  if (pathname === '/') {
    $('#login').show();
    $('#logout').hide();
    document.getElementById('add').disabled = true;
    $('.modal').on('shown.bs.modal', function () {
      $(this).find('[autofocus]').focus();
    });
  }

  if (pathname === '/homepage') {
    $('#logout').show();
    $('#login').hide();
    document.getElementById('add').disabled = false;

    // GET all user's whiskeys from db to display
    const whiskeysTemplate = $('#whiskeys-template').html();
    const compiledWhiskeysTemplate = Handlebars.compile(whiskeysTemplate);

    $.ajax({
      type: 'GET',
      url: '/whiskeys',
      success: (whiskeys) => {
        $('#whiskeys-in-journal').html(compiledWhiskeysTemplate(whiskeys));
      },
      error: (err) => {
        alert('Error getting whiskeys!');
      },
    });
  }

  // POST new user
  $('#newUser').on('click', () => {
    const userInfo = {
      username: $('#username').val(),
      password: $('#password').val(),
    };

    $.ajax({
      type: 'POST',
      url: '/users',
      data: userInfo,
      success: (user) => {
        window.location.replace('/homepage');
        alert(`Welcome to Whiskey Journal ${user.user.username}!`);
      },
      error: () => {
        alert('Error adding user!');
      },
    });
  });

  // GET whiskey by id to show
  $('#whiskeys-table').delegate('.modalButton', 'click', function () {
    const showWhiskeyTemplate = $('#show-whiskey-template').html();
    const compiledShowWhiskeyTemplate = Handlebars.compile(showWhiskeyTemplate);

    $.ajax({
      type: 'GET',
      url: `/add/${this.id}`,
      success: (whiskey) => {
        $('#show-whiskey').html(compiledShowWhiskeyTemplate(whiskey));
      },
      error: () => {
        alert('Error getting whiskey!');
      },
    });
  });

  // GET whiskey by id to edit
  $('#showWhiskeyModal').delegate('.modalButton', 'click', function () {
    const whiskeyEditTemplate = $('#whiskey-edit-template').html();
    const compiledWhiskeyEditTemplate = Handlebars.compile(whiskeyEditTemplate);

    $.ajax({
      type: 'GET',
      url: `/add/${this.id}`,
      success: (whiskey) => {
        $('#whiskey-modal-form').html(compiledWhiskeyEditTemplate(whiskey));
      },
      error: () => {
        alert('Error getting whiskey!');
      },
    });
  });

  // PATCH whiskey in db
  $('#saveWhiskey').on('click', () => {
    const id = $('#edit-whiskeyId').val();
    const whiskeyInfo = {
      whiskeyName: $('#edit-whiskeyName').val(),
      distillery: $('#edit-distillery').val(),
      style: $('#edit-style').val(),
      country: $('#edit-country').val(),
      age: $('#edit-age').val(),
      price: $('#edit-price').val(),
      location: $('#edit-location').val(),
      rating: $('#edit-rating').val(),
      notes: $('#edit-notes').val(),
    };

    $.ajax({
      type: 'PATCH',
      url: `/add/${id}`,
      data: whiskeyInfo,
      success: (whiskey) => {
        alert(`Updated ${whiskey.whiskey.whiskeyName}`);
        window.location.reload();
      },
      error: () => {
        alert('Error saving whiskey!');
      },
    });
  });

  // DELETE whiskey in db
  $('#deleteWhiskey').on('click', () => {
    const id = $('#edit-whiskeyId').val();

    $.ajax({
      type: 'DELETE',
      url: `/add/${id}`,
      success: (whiskey) => {
        alert(`Deleted ${whiskey.whiskey.whiskeyName}`);
        window.location.reload();
      },
      error: () => {
        alert('Error deleting whiskey!');
      },
    });
  });
})(jQuery);

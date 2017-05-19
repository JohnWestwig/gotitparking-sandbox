

  $(document).ready(function () {
      $(document).on('submit', '.registrationForm', function (e) {
          e.preventDefault();
          $.ajax({
              url: $(this).attr('action'),
              type: "POST",
              data: $(this).serialize(),
              success: function (data) {
                  handleSuccess();
              },
              error: function (jXHR, textStatus, errorThrown) {
                  handleLoginErrors(jXHR.responseJSON.errors);
              }
          });
      });
  });

  function handleSuccess() {
      $(".registrationErrors").empty();
      $(".registrationErrors").append('<p class="text-success">' + 'An email has been sent to you - please confirm your account before proceeding' + '</p>');
  }

  function handleLoginErrors(errors) {
      $(".registrationErrors").empty();
      errors.forEach(function (error, i) {
          $(".registrationErrors").append('<p class="text-danger">' + errors[i].error.msg + '</p>');
      });
  }

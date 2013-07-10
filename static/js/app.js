(function(global, $){
  function xhrSubmit($form, callback) {
    const $textarea = $form.find('textarea[name="assertion"]');
    const formActionUrl = $form.prop('action');
    const $spinner = $form.find('.spinner');
    $form.on('submit', function(e){
      $spinner.show();
      const data = { assertion: $textarea.val() }
      $.post(formActionUrl, data, callback)
        .fail(function(xhr) { 
          alert('[Internal error] ' 
            + xhr.status + ' ' + xhr.statusText 
            + ': ' + xhr.responseText);
        })
        .always(function() {
          $spinner.hide();
        });
      return (e.preventDefault(), false)
    });
  }

  const $resultContainer = $('#js-result-container');
  const $assertionForm = $('#js-assertion-form');

  xhrSubmit($assertionForm, function (data, textStatus, jqXHR) {
    $resultContainer.html(data);
  });

})(window, jQuery);
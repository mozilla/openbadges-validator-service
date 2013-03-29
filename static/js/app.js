(function(global, $, ich, undefined){
"use strict";

function xhrSubmit($form, callback) {
  const $textarea = $form.find('textarea[name="assertion"]');
  const formActionUrl = $form.prop('action');
  $form.on('submit', function(e){
    const data = { assertion: $textarea.val() }
    $.post(formActionUrl, data, callback);
    return (e.preventDefault(), false)
  });
}
const $resultContainer = $('#js-result-container');
const $assertionForm = $('#js-assertion-form');

xhrSubmit($assertionForm, function (data, textStatus, jqXHR) {
  const error = data.error || {};
  const info = data.info || {};
  const isValid = data.status === 'valid';
  const codes = {
    'structure': function (error) {
      const fields = error.extra;
      const errors = Object.keys(fields).map(function (field) {
        return { field: field, message: fields[field].message }
      });
      return ich['js-error-structure']({ errors: errors }).html();
    },
    'verify-hosted': function (error) {
      return ich['js-error-verify-hosted']().html()
    }
  }

  const explanation = codes[data.error.code]
    ? codes[data.error.code](error)
    : '';

  const tplData = {
    'class': data.status,
    'valid?': isValid,
    'validity': (isValid ? 'Valid' : 'Invalid'),
    'rawResponse': JSON.stringify(data, null, '  '),
    'reason': data.reason,
    'explanation': explanation
  };

  tplData['version'] = info.version;
  $resultContainer.html(ich['js-response'](tplData));
});

})(window, jQuery, ich);
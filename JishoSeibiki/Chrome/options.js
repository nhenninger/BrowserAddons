// Saves options to chrome.storage.sync.
function save_options() {
  var dict = document.getElementById('dictionary').value;
  chrome.storage.sync.set({
    dictPref: dict
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    dictPref: 'WWWJDIC'
  }, function(items) {
    document.getElementById('dictionary').value = items.dictPref;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

const echoapp = {};

/**
 * @param {Object} echoService
 * @param {Object} ctors
 */
echoapp.EchoApp = function (echoService, ctors) {
  this.echoService = echoService;
  this.ctors = ctors;
};

echoapp.EchoApp.INTERVAL = 500; // ms
echoapp.EchoApp.MAX_STREAM_MESSAGES = 50;

/**
 * @param {string} message
 * @param {string} cssClass
 */
echoapp.EchoApp.addMessage = function (message, cssClass) {
  $("#first").after(
    $("<div/>").addClass("row").append(
      $("<h2/>").append(
        $("<span/>").addClass("label " + cssClass).text(JSON.stringify(message)))));
};

/**
 * @param {string} message
 */
echoapp.EchoApp.addLeftMessage = function (message) {
  this.addMessage(message, "label-primary pull-left");
};

/**
 * @param {string} message
 */
echoapp.EchoApp.addRightMessage = function (message) {
  this.addMessage(message, "label-default pull-right");
};

echoapp.EchoApp.prototype.Test = function (msg) {
  echoapp.EchoApp.addLeftMessage(msg);
  var addressBook = new this.ctors.AddressBook();
  console.log(addressBook);
  person = addressBook.addPeople()
  person.setId(1234)
  person.setName(msg)
  person.setEmail("kished@gmail.com")
  phone = person.addPhones()
  phone.setNumber("555-43210900")
  phone.setType(1)
  var call = this.echoService.test(addressBook,
    {},
    function (err, response) {
      if (err) {
        echoapp.EchoApp.addRightMessage('Error code: ' + err.code + ' "' +
          err.message + '"');
      } else {
        setTimeout(function () {
          console.log(response.getPeopleList());
          echoapp.EchoApp.addRightMessage(response.getPeopleList()[0].getName() + ': ' + response.getPeopleList()[0].getEmail());
        }, echoapp.EchoApp.INTERVAL);
      }
    });
  call.on('status', function (status) {
    if (status.metadata) {
      console.log("Received metadata");
      console.log(status.metadata);
    }
  });
};

echoapp.EchoApp.prototype.send = function (e) {
  var msg = $("#msg").val().trim();
  $("#msg").val(''); // clear the text box
  if (!msg) return false;
  this.Test(msg)
  return false;
};

/**
 * Load the app
 */
echoapp.EchoApp.prototype.load = function () {
  var self = this;
  $(document).ready(function () {
    // event handlers
    $("#send").click(self.send.bind(self));
    $("#msg").keyup(function (e) {
      if (e.keyCode == 13) self.send(); // enter key
      return false;
    });

    $("#msg").focus();
  });
};

module.exports = echoapp;

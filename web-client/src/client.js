window.$ = require('jquery')
const { AddressBook } = require('./address_book_pb.js')
const { AddressBookServiceClient } = require('./address_book_grpc_web_pb.js')
const { EchoApp } = require('./echoapp.js');
const grpc = {};
grpc.web = require('grpc-web');


var echoService = new AddressBookServiceClient('http://' + window.location.hostname + ':8080', null, null);

var echoApp = new EchoApp(echoService, { AddressBook });

echoApp.load();

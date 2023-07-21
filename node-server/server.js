const path = require('path');
var PROTO_PATH = path.join(__dirname, '../protos/address_book.proto');

var assert = require('assert');
var async = require('async');
var _ = require('lodash');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
var addressBook = protoDescriptor.grpc.gateway.testing;

/**
 * @param {!Object} call
 * @return {!Object} metadata
 */
function copyMetadata (call) {
  var metadata = call.metadata.getMap();
  var response_metadata = new grpc.Metadata();
  for (var key in metadata) {
    response_metadata.set(key, metadata[key]);
  }
  return response_metadata;
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doEcho (call, callback) {
  console.log(call.request);
  callback(null, {
    ...call.request
  }, copyMetadata(call));
}

/**
 * @param {!Object} call
 * @param {function():?} callback
 */
function doEchoAbort (call, callback) {
  callback({
    code: grpc.status.ABORTED,
    message: 'Aborted from server side.'
  });
}

/**
 * @param {!Object} call
 */
function doServerStreamingEcho (call) {
  var senders = [];
  function sender (message, interval) {
    return (callback) => {
      call.write({
        message: message
      });
      _.delay(callback, interval);
    };
  }
  for (var i = 0; i < call.request.message_count; i++) {
    senders[i] = sender(call.request.message, call.request.message_interval);
  }
  async.series(senders, () => {
    call.end(copyMetadata(call));
  });
}

/**
 * Get a new server with the handler functions in this file bound to the
 * methods it serves.
 * @return {!Server} The new server object
 */
function getServer () {
  var server = new grpc.Server();
  server.addService(addressBook.AddressBookService.service, {
    test: doEcho
  });
  return server;
}

if (require.main === module) {
  var echoServer = getServer();
  echoServer.bindAsync(
    '0.0.0.0:9090', grpc.ServerCredentials.createInsecure(), (err, port) => {
      assert.ifError(err);
      echoServer.start();
      console.log('server port 9090 start');
    });
}

exports.getServer = getServer;

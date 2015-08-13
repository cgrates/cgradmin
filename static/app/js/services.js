'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cgradminApp.services', [])
                                            .value('version', '0.1')
                                            .value('idMethods', {
                                                "Timing": {object:"ApierV2", method: "GetTPTimingIds"},
                                                "Destination": {object:"ApierV2", method: "GetTPDestinationIds"},
                                                "Rate": {object:"ApierV2", method: "GetTPRateIds"},
                                                "DestinationRate": {object:"ApierV2", method: "GetTPDestinationRateIds"},
                                                "RatingPlan": {object:"ApierV2", method: "GetTPRatingPlanIds"},
                                                "RatingProfile": {object:"ApierV2", method: "GetTPRatingProfileIds"},
                                                "CdrStats": {object:"ApierV2", method: "GetTPCdrStatsIds"},
                                                "Action": {object:"ApierV2", method: "GetTPActionIds"},
                                                "ActionTrigger": {object:"ApierV2", method: "GetTPActionTriggerIds"},
                                                "ActionPlan": {object:"ApierV2", method: "GetTPActionPlanIds"},
                                                "AccountAction": {object:"ApierV2", method: "GetTPAccountActionIds"},
                                                "SharedGroup": {object:"ApierV2", method: "GetTPSharedGroupIds"},
                                                "DerivedCharger": {object:"ApierV2", method: "GetTPDerivedChargerIds"},
                                                "User":{object:"ApierV2", method: "GetUserIds"},
                                                "Alias":{object:"ApierV2", method: "GetAliasIds"}
                                            })
                                            .value('hasActivateArray',
                                                   ["Destination", "RatingPlan", "RatingProfile", "CdrStats",
                                                    "AccountActions", "SharedGroup", "DerivedChargers"]
                                            )
                                            .value('root_url', '/')
                                            .factory('breadcrumbsFactory', function(){
                                                var factory = {};
                                                factory.crumbs = [];
                                                factory.add = function(crumb){
                                                    crumb = JSON.stringify(crumb);
                                                    var index = factory.crumbs.indexOf(crumb);
                                                    if(index > -1){
                                                        factory.crumbs.splice(index + 1, factory.crumbs.length - index);
                                                    } else {
                                                        factory.crumbs.push(crumb);
                                                    }
                                                };
                                                factory.reset = function(){
                                                    factory.crumbs = [];
                                                }
                                                return factory;
                                            })
                                            .factory('menuFactory', function(){
                                                var factory = {};
                                                factory.menu = 'one';
                                                factory.observerCallbacks = [];

                                                //register an observer
                                                factory.registerObserverCallback = function(callback){
                                                    factory.observerCallbacks.push(callback);
                                                };

                                                //call this when you know 'foo' has been changed
                                                var notifyObservers = function(){
                                                    angular.forEach(factory.observerCallbacks, function(callback){
                                                        callback();
                                                    });
                                                };

                                                factory.setMenu = function(menu){
                                                    factory.menu = menu;
                                                    notifyObservers();
                                                }

                                                factory.getMenu = function(){
                                                    return factory.menu;
                                                }

                                                return factory;
                                            })
                                            .factory('resFactory', function($cookieStore, $timeout, $location, $window, $q, root_url) {
                                                var factory = {};
                                                factory.alerts = [];
                                                var callbacks = {};
                                                var current_cb_id = 0;
                                                var ready = false;
                                                var connecting = false;
                                                var param = {TPid : $cookieStore.get('tpid')};
                                                var connect = function(){
                                                    connecting = true;
                                                    ws = new WebSocket("ws://localhost:8080/ws");

                                                    ws.onerror = function (event) {
                                                        console.error("WSError: ", event.data);
                                                        ready = false;
                                                    };
                                                    ws.onopen = function(){
                                                        ready = true;
                                                        connecting = false;
                                                        //console.log("Connected!");
                                                        if (typeof(factory.initCallback) !== "undefined") {
                                                            factory.initCallback();
                                                        }
                                                    };
                                                    ws.onmessage = function(msg) {
                                                        var reply = JSON.parse(msg.data)
                                                            if (!!reply['id']) {
                                                                if(!!reply['error']) {
                                                                    callbacks[reply.id].cb.resolve("ERROR: " + reply.error);
                                                                }

                                                                if(!!reply['result']) {
                                                                    callbacks[reply.id].cb.resolve(reply.result);
                                                                }

                                                                delete callbacks[reply.id];
                                                            } else {
                                                                console.error('Got a reply without ID:', reply)
                                                            }
                                                    };
                                                    return ws;
                                                };

                                                var ws = connect();

                                                factory.call = function(func, finalParam, obj){
                                                    if (!ready && connecting) {
                                                        //ws = connect();
                                                    }
                                                    if (typeof(obj) === "undefined") obj = "ApierV2";
                                                    if(angular.isObject(finalParam)) {
                                                        angular.extend(finalParam, param);
                                                    }
                                                    current_cb_id += 1;
                                                    var request = {
                                                        "jsonrpc": "2.0",
                                                        "id": current_cb_id,
                                                        "method": "CGRConnector.Call",
                                                        "params": [{"ServiceMethod": obj + '.' + func, "Params":finalParam}]
                                                    };

                                                    var deferred = $q.defer();
                                                    callbacks[request.id] = {cb: deferred};

                                                    if (ready) {
                                                        //console.log("Call: ", request);
                                                        ws.send(JSON.stringify(request));
                                                    }
                                                    return deferred.promise;
                                                };

                                                // callback will be called after websocket is connected
                                                factory.addInitCallback = function(callback){
                                                    factory.initCallback = callback;
                                                }

                                                factory.addAlert = function(message, prefix) {
                                                    if(typeof(prefix)==='undefined') {
                                                        prefix = '';
                                                    }

                                                    try {message = JSON.parse(message);} catch(e) {}// leave message as it is
                                                    var error = false;
                                                    if (message.toLowerCase().indexOf('error') > -1){
                                                        error = true;
                                                    }
                                                    if (message['ERROR']) {
                                                        error = true;
                                                        message = message['ERROR'];
                                                    }
                                                    prefix += error ? ' ' : ': ';

                                                    factory.alerts.push({
                                                        type: error ? 'danger' : 'success',
                                                        msg: prefix + message
                                                    });
                                                    $timeout(function(){
                                                        factory.alerts.splice(0, 1);
                                                    }, 10000);
                                                };
                                                return factory;
                                            });

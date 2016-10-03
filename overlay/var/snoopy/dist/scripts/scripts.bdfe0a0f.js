!function(){"use strict";var a=angular.module("regApp",[]);a.directive("myEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.myEnter)}),b.preventDefault())})}}),a.controller("regController",["$http","$timeout",function(a,b){var c=this;c.data={},c.wifis={},c.newssid="",c.wifiup=!1,c.wifiip="",c.tryingconnectwifi=!1,c.scanready=!1,c.resetkey="",c.Register=function(){var b=JSON.stringify({key:c.key});a.post("/register",b).then(function(){c.registered=!0,c.sure=!1,c.Health()},function(a){c.error=a.data.error||"Request failed"})},c.SetNewSsid=function(a){c.newssid=a},c.Reset=function(){c.registered?c.reset=!0:(c.tryingconnectwifi=!0,a.get("/reset/0").success(function(a){c.tryingconnectwifi=!1,c.WifiList(),c.connectedwifi="",c.newssid="",c.wifiup=!1,c.wifiip=""}))},c.DoReset=function(){var d="/reset/"+c.resetkey,e=function(){c.resetdone=!0,c.resetting=!1};c.resetting=!0;var f=b(e,5e3);a({method:"GET",url:d}).then(function(){},function(a){b.cancel(f),c.resetting=!1,c.reset=!1})},c.CancelReset=function(){c.reset=!1},c.ConnectSsid=function(){c.tryingconnectwifi=!0;var b=JSON.stringify({ssid:c.newssid,password:c.wifipwd});a.post("/wificonnect",b).then(function(a){c.tryingconnectwifi=!1,c.WifiList(),c.newssid="",c.wifiup=!0,c.wifiip=a.data.ip},function(a){c.tryingconnectwifi=!1,c.ssiderror=a.data.error||"Request failed",c.newssid=""})},c.Health=function(){a.get("/health").success(function(a){c.registered=a.token,c.resetinit=a.req,c.keylocation=a.keylocation,""!=a.scanready&&(c.scanready=!0),c.data=a,c.wifiip=a.ip,c.cip=a.cip,c.returnurl=window.btoa("http://"+a.localhttp).replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,"")})},c.WifiList=function(){a.get("/wifilist").success(function(a){a.length>20?c.wifis=a.slice(0,19):c.wifis=a,angular.forEach(a,function(a,b){"yes"===a.active&&(c.wifiup=!0,c.connectedwifi=a.ssid)})})},c.Health(),c.WifiList()}]),a.directive("reset",function(){return{restrict:"E",templateUrl:"views/reset.html"}}),a.directive("resetting",function(){return{restrict:"E",templateUrl:"views/resetting.html"}}),a.directive("resetdone",function(){return{restrict:"E",templateUrl:"views/resetdone.html"}}),a.directive("registration",function(){return{restrict:"E",templateUrl:"views/registration.html"}}),a.directive("connections",function(){return{restrict:"E",templateUrl:"views/connections.html"}}),a.directive("status",function(){return{restrict:"E",templateUrl:"views/status.html"}})}(),angular.module("regApp").run(["$templateCache",function(a){"use strict";a.put("views/adminif.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success text-center"> <h4>Awesome! Almost there!  Re-connect to your own wifi Network, and visit...</h4> <h3> <a href="http://{{regCtrl.wifiip}}" target="_new" class="keylocation">http://{{regCtrl.wifiip}}</a> </h3> </div> </div> </div> </div>'),a.put("views/connections.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-default"> <div class="panel-heading" ng-hide="!regCtrl.tryingconnectwifi"> <img src="/images/roller.72e47b5c.gif"> BRB .... </div> <div class="panel-heading" ng-hide="regCtrl.wifiup || regCtrl.tryingconnectwifi"> Connect to WiFi network you want to protect<i class="glyphicon glyphicon-signal"></i> <a href="#" class="pull-right" ng-click="regCtrl.WifiList()">Refresh</a> </div> <div class="list-group" ng-repeat="wifi in regCtrl.wifis track by $index"> <button type="button" class="list-group-item list-group-item-action list-group-item-success" ng-show="wifi.ssid==regCtrl.connectedwifi"> <i class="glyphicon glyphicon-signal"></i> {{wifi.ssid}} CONNECTED <span ng-show="regCtrl.wifiup && regCtrl.registered"> and WATCHED </span> <a ng-show="regCtrl.wifiup && regCtrl.wifiip!=regCtrl.cip" href="#" class="pull-right" ng-click="regCtrl.Reset()">Disconnect</a> </button> <button type="button" class="list-group-item list-group-item-action" ng-click="regCtrl.SetNewSsid(wifi.ssid)" ng-hide="regCtrl.wifiup"><i class="glyphicon glyphicon-lock" ng-hide="wifi.security==\'\' && regCtrl.wifiup"></i> {{wifi.ssid}}</button> <div class="input-group" ng-show="regCtrl.newssid==wifi.ssid"> <input type="text" class="form-control warning" id="wifipwd" placeholder="Enter Password" name="wifipwd" ng-model="regCtrl.wifipwd" ng-hide="wifi.security==\'\'" my-enter="regCtrl.ConnectSsid()"> <span class="input-group-btn"> <button class="btn btn-secondary" type="button" ng-click="regCtrl.ConnectSsid()">Connect</button> </span> </div> </div> <div class="text-center" ng-show="regCtrl.wifiup && regCtrl.wifiip!=regCtrl.cip"> <h3>Connect back to <strong>{{regCtrl.connectedwifi}}</strong> WiFi,<br> and visit the folowing url...</h3> <h3> <a href="http://{{regCtrl.wifiip}}" target="_new" class="keylocation">http://{{regCtrl.wifiip}}</a> </h3> </div> </div> </div> </div> </div>'),a.put("views/goodjob.html",'<div class="panel-body text-center" ng-show="regCtrl.goodjob"> <h2 class="alert alert-success">{{regCtrl.goodjob}}</h2> </div>'),a.put("views/howtokey.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success text-center"> <h4>Woot! Last step!  Get the service key here.. </h4> <h3> <a href="{{regCtrl.keylocation}}" target="_new" class="keylocation">{{regCtrl.keylocation}}</a> </h3> show on internal interface </div> </div> </div> </div>'),a.put("views/howtoreg.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success text-center"> <h4>Awesome! Almost there!  Re-connect to your own wifi Network, and visit...</h4> <h3> <a href="http://{{regCtrl.wifiip}}" target="_new" class="keylocation">http://{{regCtrl.wifiip}}</a> </h3> remove on internal interface </div> </div> </div> </div>'),a.put("views/registered.html",'<div class="container" ng-show="regCtrl.registered"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success"> <div class="panel-heading" ng-hide="regCtrl.scanready"> <img src="/images/roller.72e47b5c.gif"> Scanning... please wait .... </div> <div class="panel-heading" ng-show="regCtrl.scanready"> Results are ready at <a href="https://nopasa.com">http://nopasa.com</a> </div> <div class="panel-heading"> Device is registered {{regCtrl.data.token}} <a href="#" class="pull-right" ng-click="regCtrl.Unregister(1)" ng-show="!regCtrl.sure">Register again</a> </div> </div> </div> </div> </div>'),a.put("views/registration.html",'<div class="container" ng-show="!regCtrl.registered"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success"> <div class="panel-heading text-center"> <h3>Woot! Last step! </h3> <h4>Go to the following url, retrieve Service Key and enter below </h4> <h3> <a href="{{regCtrl.keylocation}}/profile" target="_blank" class="keylocation">{{regCtrl.keylocation}}/profile</a> </h3> </div> <div class="input-group"> <input type="text" class="form-control warning" id="key" placeholder="Enter Service Key" name="key" ng-model="regCtrl.key" my-enter="regCtrl.Register()"> <span class="input-group-btn"> <button class="btn btn-primary" type="button" ng-click="regCtrl.Register()">Register</button> </span> </div> </div> </div> </div> </div> <div class="container" ng-show="regCtrl.registered"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success"> <div class="panel-heading"> Device is registered <a href="http://nopasa.com/faq#registration" class="pull-right">More Info</a> </div> </div> </div> </div> </div>'),a.put("views/reset.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-danger"> <div class="panel-heading text-center"> <h3 class="text-danger">Danger Ahead!</h3> <h4 class="text-danger">This operation can not be undone!</h4> <h4>for reset key visit</h4> <h3> <a href="{{regCtrl.keylocation}}/reset/{{regCtrl.resetinit}}" target="_blank" class="keylocation">{{regCtrl.keylocation}}/reset/{{regCtrl.resetinit}}</a> </h3> </div> <div class="input-group"> <input type="text" class="form-control warning" id="key" placeholder="Enter Reset Key" name="key" ng-model="regCtrl.resetkey" my-enter="regCtrl.Reset()"> <span class="input-group-btn"> <button class="btn btn-danger" type="button" ng-click="regCtrl.DoReset()">Reset</button> <button class="btn btn-success" type="button" ng-click="regCtrl.CancelReset()">Cancel</button> </span> </div> </div> </div> </div> </div>'),a.put("views/resetdone.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success text-center"> <h3>Your device have been reset</h3> <h3>For instructions visit</h3> <h3> <a href="{{regCtrl.keylocation}}/faq" target="_blank" class="keylocation">{{regCtrl.keylocation}}/faq</a> </h3> </div> </div> </div> </div>'),a.put("views/resetting.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success text-center"> <h3>Please wait...</h3> </div> </div> </div> </div>'),a.put("views/status.html",'<div class="container"> <div class="row"> <div class="col-lg-6 col-lg-offset-3"> <div class="panel panel-success"> <div class="panel-heading"> STATUS ACTIVE {{ regCtrl.data.stats.active_hr}} </div> </div> </div> </div> </div>')}]);
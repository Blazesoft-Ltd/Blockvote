/*
** Main App
*/

var App = (function(my) {
    "use strict";


    var conf = {
        assetsPath: "",
        imgPath: "img",
        jsPath: "js",
        libsPath: "lib"
    }

    var init = function() {
        console.log('A inititalized!');
        loadWeb3(setweb3);
    };


    var loadWeb3 = function(callback) {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof Web3 !== 'undefined') {
            // Use the browser's ethereum provider
            console.log('Yeey web3!');
            callback();
        }
        else {
            console.log('No web3!');
            /*$.getScript("/voting/js/web3.min.js", function() {
               console.log("Script loaded.");
               loadWeb3(callback);
            });*/

   $.ajax({
        url: "/voting/js/web3.min.js",
        dataType: 'script',
        async: false,
        success: function(){
               console.log("Script loaded.");
               loadWeb3(callback);
        }
    });


        }        
    }

    var txStatus = function (txHash) {

        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/nW417vI9QlPuilsrRD2B'));
        var result = web3.eth.getTransactionReceipt(txHash);
        if(result && result.status == '0x1'){
          return true;           
        }
        else if(result && result.status == '0x0'){
          return false;
        }
        else{
          return txStatus(txHash);
        }
    }

    var isLoggedIn = function (){
      if(web3.currentProvider.isMetaMask && !web3.isAddress(web3.eth.accounts[0])){
        $('body').html('<h1>Address not detected!</h1><h2>Kindly login into your MetaMask. Then refresh the page</h2>');
        return false;
      }
      else{
        var defaultNetwork = "ropsten";
        if(getNetworkName() === defaultNetwork){
          return true;
        }
        else{
          $('body').html('<h1>Wrong network!</h1><h2>Kindly switch to the '+defaultNetwork+' network in your MetaMask. Then refresh the page</h2>');
        }
        return false;
      } 
    }


    var getUrlParameter = function (sParam){
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++)
      {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
      }
    }

    // Public
    return {...my, ...{
        init : init,
    }};
})(App || {});
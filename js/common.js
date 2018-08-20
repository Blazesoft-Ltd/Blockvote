/*$.getScript('https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js', function()
{
  this.txsitatis = function () {
    var web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/nW417vI9QlPuilsrRD2B'))
    var blockhash = web3.eth.getTransactionReceipt('0x6a2efe025841c2454f0a7ad6202d13d4752fa44ebb0f332faad1abd92444523a').blockHash
    console.log(blockhash)

  };
});*/
/*if (typeof web3 !== 'undefined') {
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/nW417vI9QlPuilsrRD2B'));
}*/

$.fn.txStatus = function (txHash, callback = '') {
    //var web3 = new Web3();
    //web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/nW417vI9QlPuilsrRD2B'));
    var result = web3.eth.getTransactionReceipt(txHash, (err, result) => {
        if(result && result.status == '0x1'){
          callback(true);           
        }
        else if(result && result.status == '0x0'){
          callback(false);
        }
        else{
          $.fn.txStatus(txHash, callback);
        }      
    });
}
    
 $.fn.getContractAddress = function(txHash, address, callback, block = {start: 0, end: 9999999}) {
    console.log('getContractAddress:' + address);
    var api = "https://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=" + address + "&startblock=" + block.start + "&endblock=" + block.end + "&sort=asc&apikey=YourApiKeyToken";
    $.ajax({
        url: api,
        async: true,
        data: 'json',
        success: function(dataJson) {
            if (dataJson.status == '1') {
                var tx = dataJson.result.find(result => result.hash === txHash);
                if (tx && tx.contractAddress) {
                    if (callback) callback(tx);
                    return true;
                } else {
                    setTimeout(function() {
                        $.fn.getContractAddress(txHash, address, callback, block);
                        console.log('no contract address');
                        console.log(txHash);
                    }, 2000);
                }
            }
        }
    });
};

$.fn.isLoggedIn = function (){
  if(web3.currentProvider.isMetaMask && !web3.isAddress(web3.eth.accounts[0])){
    $('#feedback').html('<h1>Address not detected!</h1><h2>Kindly login into your MetaMask. Then refresh the page</h2>');
    return false;
  }
  else{
    var defaultNetwork = "ropsten";
    if($.fn.getNetworkName() === defaultNetwork){
      return true;
    }
    else{
      $('#feedback').html('<h1>Wrong network!</h1><h2>Kindly switch to the '+defaultNetwork+' network in your MetaMask. Then refresh the page</h2>');
    }
    return false;
  } 
}

$.fn.getNetworkName = function (){
  var networkId = web3.version.network;
  switch (networkId) {
    case "1":
      networkName = "main";
      break;
    case "2":
     networkName = "morden";
     break;
    case "3":
      networkName = "ropsten";
      break;
    case "4":
      networkName = "rinkeby";
      break;
    case "42":
      networkName = "kovan";
      break;
    default:
      networkName = "unknown";
  }
  return networkName;
}

$.fn.getUrlParameter = function (sParam){
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
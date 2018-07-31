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

$.fn.txStatus = function (txHash) {

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
      return $.fn.txStatus(txHash);
    }
}

$.fn.internalTransactionAddress = function (contractAddress,txHash,startBlock=0,endBlock=9999999){
  var data = $.ajax({
      url: "http://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address="+contractAddress+"&startblock="+startBlock+"&endblock="+endBlock+"&sort=asc&apikey=YourApiKeyToken",
      async: false,
      data: 'json'
  });

  var dataJson = data.responseJSON;
  //console.log(dataJson);

  if(dataJson.status == '1'){
    var tx = dataJson.result.find(result => result.hash === txHash);
    if(tx && tx.contractAddress){
      return tx.contractAddress;
    }
    else{
      console.log('iterate');
      return $.fn.internalTransactionAddress(txHash);
    }
  }
}

$.fn.isLoggedIn = function (){
  if(web3.currentProvider.isMetaMask && !web3.isAddress(web3.eth.accounts[0])){
    $('body').html('<h1>Address not detected!</h1><h2>Kindly login into your MetaMask. Then refresh the page</h2>');
    return false;
  }
  else{
    var defaultNetwork = "ropsten";
    if($.fn.getNetworkName() === defaultNetwork){
      return true;
    }
    else{
      $('body').html('<h1>Wrong network!</h1><h2>Kindly switch to the '+defaultNetwork+' network in your MetaMask. Then refresh the page</h2>');
    }
    return false;
  } 
}

$.fn.getNetworkName = function (web3){
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
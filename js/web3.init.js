if (typeof web3 !== 'undefined') {
  // Use browser's eth provider (metamask)
  var web3 = new Web3(web3.currentProvider);
} 
else {
  // set the provider you want from Web3.providers
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/'));
}
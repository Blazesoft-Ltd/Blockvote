$.fn.isAdmin = function(contractInstance) {
	contractInstance.admin((err, result) => {
		var adminAddress = result
		console.log(err,'admin address:'+result)
		var currentAddress = web3.eth.accounts[0]
		if(adminAddress !== currentAddress){ 
		  $('body').html('<h1>You are not authorized to access this dashboard!</h1><h2>Kindly change your metamask account then refresh the page.</h2>');
		}
	});
}
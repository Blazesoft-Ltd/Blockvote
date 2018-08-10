window.addEventListener('load', function () {

    const accountAddress = web3.eth.accounts[0];

    if (typeof web3 !== 'undefined') {
        console.log('web3 is enabled');
        if (web3.currentProvider.isMetaMask === true) {
            console.log('MetaMask is active');
            if (!accountAddress) {
                $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>No Address detected!</strong> Kindly unlock your metamask account then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
                return false;
            }

            if ($.fn.getNetworkName() !== 'ropsten') {
                $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>Wrong network detected!</strong> Kindly switch to Ropsten Test Network in your metamask then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
                return false;
            }

        } 
        else {
            console.log('web3 is not found');
            $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>Misssig Dependancy!</strong> Kindly install <a href="https://metamask.io/" target="_blank" class="alert-link">MetaMask</a> then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
            return false;
        }
    } 
    else {
        console.log('web3 is not found');
        $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>Misssig Dependancy!</strong> Kindly install <a href="https://metamask.io/" target="_blank" class="alert-link">MetaMask</a> then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
        return false;
    }

    const electionContractABI = [{ "constant": false, "inputs": [{ "name": "desc", "type": "string" }], "name": "add_Election", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "Voter_Address", "type": "address" }, { "name": "first_name", "type": "string" }, { "name": "second_name", "type": "string" }, { "name": "surname", "type": "string" }, { "name": "id", "type": "uint256" }, { "name": "phone", "type": "uint256" }, { "name": "email", "type": "string" }], "name": "addVoter", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "Voter_Address", "type": "address" }], "name": "removeVoter", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "newPeriod", "type": "uint256" }], "name": "resetPeriod", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "newQuorum", "type": "uint256" }], "name": "resetQuorum", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "pic", "type": "bytes32" }], "name": "setprofilepicture", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "newAdmin", "type": "address" }], "name": "transferAdmin", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "inputs": [{ "name": "name", "type": "string" }, { "name": "minimum_quorum", "type": "uint256" }, { "name": "election_period", "type": "uint256" }, { "name": "is_admin", "type": "address" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [], "name": "admin", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "elections_held", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getEmail", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getFirstName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getID", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getPhone", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getprofilepic", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getSecondName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "getSurName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "institutioName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "test", "type": "address" }], "name": "isVoter", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "numVoters", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "period", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "quorum", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "total_elections", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "voter", "outputs": [{ "name": "firstName", "type": "string" }, { "name": "secondName", "type": "string" }, { "name": "surName", "type": "string" }, { "name": "idNo", "type": "uint256" }, { "name": "phoneNo", "type": "uint256" }, { "name": "emailAddress", "type": "string" }, { "name": "isVoter", "type": "bool" }, { "name": "profilepicture", "type": "bytes32" }], "payable": false, "type": "function", "stateMutability": "view" }];

    const electionFactoryAddress = getUrlParameter('iid');
    const electionFactoryInstance = web3.eth.contract(electionContractABI).at(electionFactoryAddress);    
    electionFactoryInstance.institutioName((err, institutionName) => {
        $('.poll-title h4').text(institutionName);
    });

    const electionABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "name": "candidateID", "type": "uint256" }], "name": "AddedCandidate", "type": "event" }, { "constant": false, "inputs": [{ "name": "vie_post", "type": "string" }, { "name": "candi", "type": "address" }], "name": "addCandidate", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "define", "type": "string" }], "name": "addPosition", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "inputs": [{ "name": "Admin", "type": "address" }, { "name": "details", "type": "string" }], "payable": false, "type": "constructor", "stateMutability": "nonpayable" }, { "constant": false, "inputs": [{ "name": "vie_post", "type": "string" }, { "name": "candi", "type": "address" }], "name": "vote", "outputs": [], "payable": false, "type": "function", "stateMutability": "nonpayable" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }, { "name": "k", "type": "uint256" }], "name": "candidate_votes", "outputs": [{ "name": "y", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }, { "name": "k", "type": "uint256" }], "name": "candidateAddress", "outputs": [{ "name": "y", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "pot", "type": "string" }, { "name": "qq", "type": "address" }], "name": "candiVotes", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "election_details", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }, { "name": "k", "type": "uint256" }], "name": "eligible_candidate", "outputs": [{ "name": "y", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "examine", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }, { "name": "k", "type": "address" }], "name": "has_Voted", "outputs": [{ "name": "y", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "pot", "type": "string" }, { "name": "qq", "type": "address" }], "name": "hasVoted", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "pot", "type": "string" }, { "name": "qq", "type": "address" }], "name": "isCandy", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }], "name": "leader", "outputs": [{ "name": "u", "type": "address" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }], "name": "leaderWins", "outputs": [{ "name": "g", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "ongoing", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "period", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "i", "type": "uint256" }], "name": "position", "outputs": [{ "name": "z", "type": "string" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "registered_categories", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "start_time", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [], "name": "structure_x", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "ie", "type": "uint256" }], "name": "total_candi", "outputs": [{ "name": "i", "type": "uint256" }], "payable": false, "type": "function", "stateMutability": "view" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "vie_positions", "outputs": [{ "name": "name_position", "type": "string" }, { "name": "total_candi", "type": "uint256" }, { "name": "leader", "type": "address" }, { "name": "leaderWins", "type": "bool" }], "payable": false, "type": "function", "stateMutability": "view" }];
        
    const electionAddress = getUrlParameter('eid');
    const electionInstance = web3.eth.contract(electionABI).at(electionAddress);    
    electionInstance.election_details((err, institutionName) => {
        $('.poll-title h1').text(institutionName);
    });
    
    electionInstance.registered_categories((err, numPositions) => {
        console.log(err,numPositions);
        $('#selectPosition').html('<option value="">Select Position or Question</option>');
        for(var i = 0; i < numPositions ; i++){
            electionInstance.position(i,(err, position) => {
                console.log(err,position);
                
                $('#selectPosition').append('<option value="'+position+'">'+position+'</option>')
            });           
        }
        $('#poll').validator();
    });
    
    $('#poll').submit(function(e){
        e.preventDefault();
        var position = $('#selectPosition').val();
        var candidate = $('#inputAddress').val();
        electionInstance.vote(position, candidate,(err, txHash) => {
            $('#feedback').prepend('<div class="alert alert-info"><strong>Well done!</strong> Request was subitted.</div>');
            txStatus(txHash);
            console.clear();
            console.log(err, txHash);
        });
    });
    
    
    function txStatus (txHash) {
      web3.eth.getTransactionReceipt(txHash, (err, result) => {
        var transInfo = 'Transcation id: <a href="https://ropsten.etherscan.io/tx/'+txHash+'" target="_blank"><strong>'+txHash+'</strong></a>';

        if(result && result.status == '0x1'){
            $('#feedback').prepend('<div class="alert alert-success"><strong>Success!</strong> Transaction <a href="https://ropsten.etherscan.io/tx/'+txHash+'" target="_blank">'+txHash.substring(0,5)+'...'+txHash.substring(37,42)+'</a> completed.<br>'+transInfo+'</div>');
        }
        else if(result && result.status == '0x0'){
            $('#feedback').prepend('<div class="alert alert-danger"><strong>Sorry!</strong> Transaction failed. Please try again.<br>'+transInfo+'</div>');
        }
        else{
            setTimeout(function(){
                txStatus(txHash);
            },2000);
        }         
      });
    }
    
    /*for(var i = 0; i < 999 ; i++){
        (function(index){
            console.log(index);
            electionInstance.vie_positions(index-1,(err, result) => {
                var position = result[0];
                var numCandidates = result[1];
                var leader = result[2];
                var leaderWins = result[3];
                if(!position)return false;
                
                if(index === 1){
                    var active = 'active' 
                }                    
                else{
                    var active = '';
                } 
                
                //var pollItems = $();
                
                //$('#poll #pollItems').prepend('<div class="tab-pane '+active+'" id="tab'+index+'"><div class="panel-group" id="help-accordion-'+index+'"><div class="panel panel-default panel-help"> <a href="#poll-container" data-toggle="collapse" data-parent="#help-accordion-'+index+'" aria-expanded="true"><div class="panel-heading"><h4>'+position+'</h4></div> </a><div id="poll-container" class="collapse in" aria-expanded="true"><div class="panel-body"><form data-toggle="validator"> <button type="submit" class="btn btn-success" enabled>Vote</button></form></div></div></div></div></div>');
                
                //$('#poll form').html('<div class="checkbox" data-toggle="buttons"> <label class="btn btn-default"> <input type="radio" name="options" value="option2" autocomplete="off" required> <i class="fa fa-check"></i> </label> Choice 1<p></p> <label class="btn btn-default"> <input type="radio" name="options" value="option2" autocomplete="off" required> <i class="fa fa-check"></i> </label> Choice 2<p></p> <label class="btn btn-default"> <input type="radio" name="options" value="option2" autocomplete="off" required> <i class="fa fa-check"></i> </label> Choice 3<p></p><button type="submit" class="btn btn-success" enabled>Vote</button></div>');
                
                

                console.log(position+numCandidates+leader+leaderWins);
            });
         })(i+1);
    }*/




        //  FOR EACH INSTITUTION

        /*for (var i = 0; i < numInstitutions; i++) {



            var callback = function (electionFactoryAddress) {

                var heading = $('<div class="row"><div class="col-md-12 col-sm-12"><div class="section-title text-center"></div></div></div>');

                var electionFactoryInstance = web3.eth.contract(electionFactoryABI).at(electionFactoryAddress);
                electionFactoryInstance.institutioName((err, institutionName) => {


                    var callback1 = function (totalElections) {

                        if(totalElections > 0) {

                        $('#feedback .poll-status .alert').html('<strong>Loading..</strong>');                                    

                          var content = $('<div class="row"></div>');

                            for (var i = 0; i < totalElections; i++) {

                                    var callback2 = function (electionAddress) {
                                    var electionInstance = web3.eth.contract(electionABI).at(electionAddress);

                                    var callback3 = function (isCandidate) {
                                        if (isCandidate) {

                                            // header
                                            var rowData = $('<h3></h3>').text(institutionName);
                                            heading.find('.section-title').html(rowData);

                                            electionInstance.election_details((err, electionTitle) => {
                                                // content
                                                var item = '<a href="poll.html?id='+electionAddress+'"><div class="col-md-4 col-sm-6 col-xs-12"><div class="feature-2"><div class="media"><div class="pull-left"> <i class="fa fa-user-check"></i><div class="border"></div></div><div class="media-body"><h4 class="media-heading">'+electionTitle+'</h4></div></div></div></div></a>';
                                                content.append(item);
                                                heading.after(content);

                                            });

                                        }

                                        $('#feedback .poll-status').hide();
                                    };
                                    isCandy(electionInstance, callback3);
                                };
                                electionsHeld(i, electionFactoryInstance, callback2);
                            }  
                        }
                    };
                    totalElections(electionFactoryInstance, callback1);

                    container.prepend(heading);
                    $('#service').append(container);
                });

            };
            institute(i, callback);
        }

        // END FOR EACH INSTITUTION

    });


    function institute(index, callback = '') {
        instituteContractInstance.institute(index, (err, electionFactoryAddress) => {
            console.log('institute', err, electionFactoryAddress);
            var str = localStorage.getItem('_institutions') + ' ' + electionFactoryAddress;
            localStorage.setItem('_institutions', str.trim().replace(' ', ','));
            if (callback) callback(electionFactoryAddress);
        });
    }

    function totalElections(electionFactoryInstance, callback = '') {
        electionFactoryInstance.total_elections((err, result) => {
            var totalElections = result.c[0];
            console.log('total elections:', err, totalElections);
            var _total_elections_json = JSON.parse(localStorage._total_elections);
            var electionAddress = electionFactoryInstance.address;
            _total_elections_json[electionAddress] = totalElections;
            localStorage.setItem('_total_elections', JSON.stringify(_total_elections_json));
            if (callback) callback(totalElections);
        });
    }

    function electionsHeld(index, electionFactoryInstance, callback = '') {
        electionFactoryInstance.elections_held(index, (err, electionAddress) => {
            console.log('elections_held:', err, electionAddress);
            if (callback) callback(electionAddress);
        });
    }

    function isCandy(electionInstance, callback = '') {
        electionInstance.isCandy(0, accountAddress, (err, result) => {
            console.log('is_candi:', err, result);
            if (callback) callback(result);
        });
    }*/

    function getUrlParameter(sParam) {       
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1];
            }
       }
    };


});
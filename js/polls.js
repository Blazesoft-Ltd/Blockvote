window.addEventListener('load', function () {
    localStorage.setItem('_institutions', '');
    localStorage.setItem('_total_elections', '{}');

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

    const instituteContractInstance = web3.eth.contract(config.contractABI).at(config.contractAddress);

    instituteContractInstance.registered_institutions((err, result) => {
        var numInstitutions = result.c[0];
        if(numInstitutions < 1){
            $('.poll-status').html('<div class="alert alert-info"><strong>Oops!</strong> There is nothing to show here.</div>');
            return false;
        }
        console.log('registered institutions', err, numInstitutions);
        var container = $('<div id="pollsList" class="container"></div>');

        //  FOR EACH INSTITUTION
        var electionsCount = 0;

        for (var i = 0; i < numInstitutions; i++) {



            var callback = function (electionFactoryAddress) {

                var heading = $('<div class="row"><div class="col-md-12 col-sm-12"><div class="section-title text-center"></div></div></div>');

                var electionFactoryInstance = web3.eth.contract(config.electionFactoryABI).at(electionFactoryAddress);
                electionFactoryInstance.institutioName((err, institutionName) => {


                    var callback1 = function (totalElections) {

                        if (totalElections > 0) {
                            electionsCount++;
                            var content = $('<div class="row"></div>');

                            for (var i = 0; i < totalElections; i++) {

                                var callback2 = function (electionAddress) {
                                    var electionInstance = web3.eth.contract(config.electionABI).at(electionAddress);

                                    var callback3 = function (isCandidate) {
                                        if (isCandidate) {

                                            // header
                                            var rowData = $('<h3></h3>').text(institutionName);
                                            heading.find('.section-title').html(rowData).append('<br>');

                                            electionInstance.election_details((err, electionTitle) => {
                                                electionInstance.start_time((err, startBlock) => {
                                                    web3.eth.getBlockNumber((error, currentBlock) => {
                                                        var blocks = currentBlock - startBlock;
                                                        // content
                                                        var item = '<a href="poll.html?eid=' + electionAddress + '&iid=' + electionFactoryAddress + '"><div class="col-md-4 col-sm-6 col-xs-12"><div class="feature-2"><div class="media"><div class="pull-left"> <i class="fa fa-user-check"></i><div class="border"></div></div><div class="media-body"><h4 class="media-heading">' + electionTitle + '</h4><p>'+getTimeDate(blocks)+'</p></div></div></div></div></a>';
                                                        content.append(item);
                                                        heading.after(content);
                                                    });
                                                });
                                            });

                                        }

                                        $('#feedback .poll-status').hide();
                                    };
                                    isCandy(electionInstance, callback3);
                                };
                                electionsHeld(i, electionFactoryInstance, callback2);
                            }
                            if(i+1 == numInstitutions && electionsCount < 1) $('#feedback .poll-status').html('<div class="alert alert-info"><strong>Sorry</strong> there is nothing to show here.</div>');
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

    function getTimeDate(numBlocks) {
        var t = new Date();
        if(numBlocks) t.setSeconds(t.getSeconds() + (numBlocks * 15));
        //var amPm = t.getHours() >= 12 ? 'PM' : 'AM';
        //var time = ("0" + t.getHours()).slice(-2) + ":" +("0" + t.getMinutes()).slice(-2) + " " + amPm;
        var dateTime = t.toLocaleString();
        return dateTime;
    }


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
    }


});

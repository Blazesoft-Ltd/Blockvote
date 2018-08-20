/*
 ** Dashboard App
 */

var App = (function (my) {
    "use strict";

    const contractABI = config.electionFactoryABI;
    const contractAddress = getUrlParameter('account') || localStorage.getItem("account");
    const contractInstance = web3.eth.contract(contractABI).at(contractAddress);

    const electionContractABI = config.electionABI;
    const electionAddress = getUrlParameter('election');
    const electionContractInstance = web3.eth.contract(electionContractABI).at(electionAddress);

    var conf = {
        //assetsPath: "",
        //imgPath: "img",
        //jsPath: "js",
        //libsPath: "lib",
        etherscanApi: "https://api-ropsten.etherscan.io/"
    };

    var accountAddress = getAddress();

    var init = function () {
        console.log('Dashboard inititalized!');

        if (web3.isAddress(contractAddress)) {
            localStorage.setItem('account', contractAddress);
            authenticate(loadContent);
        } else {
            listAccountByAddress(getAddress());
        }
        // initial page switcher
        window.onhashchange = loadPage;
    };

    var authenticate = function (callback) {
        if (isMetamask()) {
            if (getAddress()) {
                if (config.network === getNetworkName()) {
                    var resolve = function () {
                        console.log('Fully authenticated!');
                        callback();
                    };
                    var reject = function () {
                        $('body').html('<div class="modal fade show" id="mod-danger" tabindex="-1" role="dialog" style="padding-right: 15px;display: block;background-color: #ea4335;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"><div class="text-center"><div class="text-danger"><span class="modal-main-icon mdi mdi-alert-circle-o"></span></div><h3>Access Denied!</h3><h4>You do not have permission to access this account.</h4><p>Kindly switch your metamask account then reload this page.</p><div class="mt-8"><a href=""><button class="btn btn-space btn-success" type="button">Reload</button></a><div class="card-title">OR</div><a href="?account=change"><button class="btn btn-space btn-primary" type="button">Change Address</button></a></div></div></div><div class="modal-footer"></div></div></div></div>');
                    };
                    isAdmin(resolve, reject);
                } else {
                    $('body').html('<div class="modal fade show" id="mod-danger" tabindex="-1" role="dialog" style="padding-right: 15px;display: block;background-color: #ea4335;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"><div class="text-center"><div class="text-danger"><span class="modal-main-icon mdi mdi-alert-circle-o"></span></div><h3>Wrong Network!</h3><h4>This app runs on the ' + config.network + ' network.</h4><p>Kindly switch to ' + config.network + ' network from your metamask then reload this page.</p><div class="mt-8"><a href=""><button class="btn btn-space btn-danger" type="button">Reload</button></a></div></div></div><div class="modal-footer"></div></div></div></div>');
                }
            } else {
                $('body').html('<div class="modal fade show" id="mod-danger" tabindex="-1" role="dialog" style="padding-right: 15px;display: block;background-color: #ea4335;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"><div class="text-center"><div class="text-danger"><span class="modal-main-icon mdi mdi-alert-circle-o"></span></div><h3>No Address!</h3><h4>This app requires your address for authentication.</h4><p>Kindly login to your metamask account then reload this page.</p><div class="mt-8"><a href=""><button class="btn btn-space btn-danger" type="button">Reload</button></a></div></div></div><div class="modal-footer"></div></div></div></div>');
            }
        } else {
            $('body').html('<div class="modal fade show" id="mod-danger" tabindex="-1" role="dialog" style="padding-right: 15px;display: block;background-color: #ea4335;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"><div class="text-center"><div class="text-danger"><span class="modal-main-icon mdi mdi-alert-circle-o"></span></div><h3>MetaMask is missing!</h3><h4>This app requires MetaMask to function properly.</h4><p>Kindly install Metamask then reload this page.</p><div class="mt-8"><a href=""><button class="btn btn-space btn-danger" type="button">Reload</button></a></div></div></div><div class="modal-footer"></div></div></div></div>');
        }
    };

    var loadSnippets = function () {

        (function getAccounts() {

            $.ajax({
                url: "https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=" + accountAddress + "&startblock=0&endblock=9999999&sort=asc&apikey=YourApiKeyToken",
                data: 'json',
                success: function (dataJson) {

                    if (dataJson.status == '1') {
                        var txs = dataJson.result.filter(result => result.to === config.contractAddress);

                        var appendAccount = function (tx) {
                            var address = tx.contractAddress;
                            var tmpContractInstance = web3.eth.contract(contractABI).at(address);
                            tmpContractInstance.institutioName((err, result) => {
                                $('#otherAccounts').append('<li class="notification"><a href="?account=' + address + '"><div class="image"><img src="https://cdn4.iconfinder.com/data/icons/cryptocoins/227/ETH-alt-512.png" alt="Avatar"></div><div class="notification-info"><div class="text"><span class="user-name">' + result + '</span><br>' + address.substring(0, 5) + '...' + address.substring(37, 42) + '</div><span class="date">Active</span></div></a></li>');
                                $('#otherAccountsCount').text($('#otherAccounts li').length);
                            });
                        };

                        for (var i = 0, len = txs.length; i < len; i++) {
                            (function (i) { // self-executed function           
                                setTimeout(function () { // induce asynchronous
                                    var tx = txs[i];
                                    getContractAddress(tx.hash, config.contractAddress, appendAccount);
                                }, 0);
                            })(i);
                        }
                    }
                }
            });
        }());

        (function displayAccountAddress() {
            var address = accountAddress;
            $('.address-display')
                .text(address.substring(0, 5) + '...' + address.substring(37, 42))
                .attr('href', 'https://ropsten.etherscan.io/address/' + address);
        }());

        /*(function getElection() {
          contractInstance.total_elections((err, result) => {
            var numElections = result;
            console.log(err,'num Elections:'+numElections);
            $('#electionCount').html(parseInt(numElections));
          });
        }());*/

        (function accountBalance() {
            web3.eth.getBalance(web3.eth.accounts[0], function (err, result) {
                var balance = web3.fromWei(result);
                $('.balance').text(balance.toFixed(3) + ' ETH');
                $('.balance-exact').text(balance + ' ETH');
                console.log('balance:' + balance);
            });
        }());


        (function displayNetwork() {
            var network = getNetworkName(web3);
            var networkName;
            switch (network) {
                case "main":
                    networkName = "Main Network";
                    $('.network-status').css('color', 'green');
                    break;
                case "morden":
                    networkName = "morden";
                    break;
                case "ropsten":
                    networkName = "Ropsten Test Net";
                    break;
                case "rinkeby":
                    networkName = "Rinkeby Test Net";
                    break;
                case "kovan":
                    networkName = "Kovan Test Net";
                    break;
                default:
                    networkName = "Unknown Network";
            }
            $('.network').text(networkName);
        }());

        (function accountName() {
            if (web3.isAddress(contractInstance.address)) {
                contractInstance.institutioName((err, result) => {
                    var accountName = result;
                    $('title').prepend(accountName + ' | ');
                    $('.page-title').append(': ' + accountName);
                    $('.user-name.account').text(accountName);
                    console.log('name:' + accountName);
                });
            }
        }());

    };

    var loadContent = function () {
        loadSnippets();
        loadPage();
    };

    var isAdmin = function (resolve, reject) {
        contractInstance.admin((err, result) => {
            var adminAddress = result;
            var currentAddress = getAddress();
            if (currentAddress === adminAddress) {
                if (resolve) resolve();
            } else {
                if (reject) reject();
            }
        });
    };

    function getAddress() {
        var address = web3.eth.accounts[0];
        if (web3.isAddress(address)) {
            return address;
        }
        return false;
    };

    var getNetworkName = function () {
        var networkId = web3.version.network;
        var networkName;
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
    };

    var isMetamask = function () {
        if (typeof web3 !== 'undefined') {
            if (typeof web3.currentProvider.isMetaMask !== 'undefined') {
                return true;
            }
        }
        return false;
    };


    var loadPage = function () {
        var loadPageContent = function (file, callback) {
            console.log(file);
            $.ajax({
                url: file,
                type: "get",
                success: function (result, status, xhr) {
                    $('.be-content').html(result);
                    if (callback) callback();
                },
                error: function (result, status, xhr) {
                    console.log('Error:' + result + status + xhr);
                }
            });
        };

        var displayDashboardContent = function () {
            (function displayVoters() {
                contractInstance.numVoters((err, result) => {
                    var numVoters = result['c'][0];
                    console.log(err, 'num voters:' + numVoters);
                    $('#voteCount').html(parseInt(numVoters));
                });
            }());

            (function displayElection() {
                contractInstance.total_elections((err, result) => {
                    var numElections = result;
                    console.log(err, 'num Elections:' + numElections);
                    $('#electionCount').html(parseInt(numElections));
                });
            }());

            $('#sampleCount').html(parseInt(0));
            $('#sampleCount1').html(parseInt(0));
        };

        var displayAddVoterContent = function () {
            var form = $('#addVoterForm');
            form.validator();

            form.on('submit', function (e) {
                e.preventDefault();
                var firstname = $("#firstname").val();
                var secondname = $("#secondname").val();
                var surname = $("#surname").val();
                var id = $("#id").val();
                var phone = $("#phone").val();
                var email = $("#email").val();
                var address = $("#address").val();

                if (!web3.isAddress(address)) {
                    $('#feedback').html('Invalid Ethereum address.');
                    $('#address').focus();
                    return
                }

                contractInstance.addVoter(address, firstname, secondname, surname, id, phone, email, (err, result) => {
                    processTransaction(result);
                    console.log(err, result);
                });

            });
        };

        var displayAddCandidateContent = function () {
            var form = $('#addCandidateForm');
            form.validator();
            $('#candidatePosition').on('change', function () {
                if ($(this).val() == 'new') location.hash = '#add-position';
            });
            //var electionAddress = getUrlParameter('election');
            if (!electionAddress) {
                form.find("input, select").prop("disabled", true);
                $('#feedback').html('<div class="alert alert-danger alert-dismissible" role="alert"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><strong>Oops!</strong> No election has been specified. </div></div>');
            } else {
                $(form).on('submit', function (e) {
                    e.preventDefault();
                    var position = $('#candidatePosition').val();
                    var candidate = $('#candidateAddress').val();
                    var name = $('#candidateName').val();

                    electionContractInstance.addCandidate(position, candidate, name, (err, result) => {
                        processTransaction(result);
                        console.log(err, result);
                    });
                });
                for (var i = 0; i <= 999; i++) {
                    electionContractInstance.position(i, (err, result) => {
                        console.log('Position' + result);
                        if (!result) return false;
                        $('#candidatePosition option:first').after('<option value="' + result + '">' + result + '</option>');
                    });
                }
            }

        };
        var displaySelectAccountContent = function () {
            var form = $('#accountForm');
            form.validator();
            $(form).on('submit', function (e) {
                e.preventDefault();
                var address = $('#accountAddress').val();
                window.location = '?account=' + address;
            });
        };

        var displayAddPositionContent = function () {
            var form = $('#addPositionForm');
            form.validator();
            if (!electionAddress) {
                form.find("input").prop("disabled", true);
                $('#feedback').html('<div class="alert alert-danger alert-dismissible" role="alert"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><strong>Oops!</strong> No election has been specified. </div></div>');
            } else {
                $(form).on('submit', function (e) {
                    e.preventDefault();
                    var title = $('#positionTitle').val();

                    electionContractInstance.addPosition(title, (err, result) => {
                        processTransaction(result);
                        console.log(err, result);
                    });
                });
            }

        };

        var displayPositionsContent = function () {

            electionContractInstance.registered_categories((err, numCategories) => {
                console.log(numCategories['c'][0]);
                if (numCategories['c'][0] < 1) {
                    $('.table-container').html('<div class="alert alert-info alert-icon alert-icon-border alert-dismissible" role="alert"><div class="icon"><span class="mdi mdi-info-outline"></span></div><div class="message"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Info!</strong> There is nothing to show here.</div></div>');
                } else {
                    var table = $('<table id="positionsTable" class="table table-striped table-hover"><thead><tr><th style="width:25%;">Name</th><th style="width:25%;">Choices</th><th style="width:25%;">Leader</th><th style="width:25%;">Leader wins</th></tr></thead><tbody></tbody></table>');

                    for (var i = 0; i < numCategories; i++) {
                        electionContractInstance.vie_positions(i, (err, result) => {

                            table.append('<tr><td>'+result[0]+'</td><td>'+result[1].c[0]+'</td><td>'+result[2]+'</td><td>'+result[3]+'</td></tr>');

                        });


                    }

                    $('.table-container').append(table);
                }
            });
        };

        var displayElectionsContent = function () {
            (function getElections() {
                // fetch election count
                contractInstance.total_elections((err, numElections) => {
                    if (numElections < 1) {
                        $('.table-container').html('<div class="alert alert-info alert-icon alert-icon-border alert-dismissible" role="alert"><div class="icon"><span class="mdi mdi-info-outline"></span></div><div class="message"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Info!</strong> There is nothing to show here.</div></div>');
                    } else {
                        var table = $('<table id="electionsTable" class="table table-striped table-hover"><thead><tr><th style="width:30%;">Title</th><th style="width:15%;">Candidates/Choices</th><th style="width:15%;">Positions/Questions</th><th style="width:15%;">Active</th><th style="width:10%;"></th></tr></thead><tbody></tbody></table>');

                        for (var i = 0; i < numElections; i++) {
                            // fetch address
                            contractInstance.elections_held(i, (err, electionAddress) => {
                                var row = $('<tr></tr>');

                                // fetch title
                                electionContractInstance.election_details((err, result) => {
                                    var rowData = $('<td></td>').text(result);
                                    row.append(rowData);

                                    // fetch candidates
                                    electionContractInstance.total_candi(0, (err, result) => {
                                        var rowData = $('<td></td>').text(result);
                                        row.append(rowData);

                                        // fetch positions
                                        electionContractInstance.registered_categories((err, categories) => {
                                            var rowData = $('<td></td>').text(categories);
                                            row.append(rowData);

                                            // fetch election status
                                            electionContractInstance.ongoing((err, result) => {
                                                var rowData = $('<td></td>').text(result);
                                                row.append(rowData);

                                                var rowData = $('<td class="text-left"></td>').html('<div class="btn-group btn-hspace"><button type="button" data-toggle="dropdown" class="btn btn-secondary dropdown-toggle">Actions <span class="icon-dropdown mdi mdi-chevron-down"></span></button><div role="menu" class="dropdown-menu"><a href="?election=' + electionAddress + '#add-candidate" class="dropdown-item">Add Candidates</a><a href="?election=' + electionAddress + '#positions" class="dropdown-item">Manage Positions</a><!--<a href="#" class="dropdown-item">Deactivate</a><div class="dropdown-divider"></div><a href="#" class="dropdown-item">Delete</a>--></div></div>');
                                                rowData.bind('click', function () {
                                                    localStorage.setItem("election", contractAddress);
                                                });
                                                row.append(rowData);
                                            });
                                        });
                                    });
                                });
                                table.append(row);
                            });
                        }

                        $('.table-container').append(table);
                    }
                });

                var setQuorum = function () {
                    var hours = $('#electionQuorum').val();
                    var secs = hours * 3600;
                    var blocks = secs / config.seconds_per_block;
                    console.log(blocks);
                    contractInstance.resetQuorum(blocks, (err, result) => {
                        var txHashRegex = /^0x([A-Fa-f0-9]{64})$/
                        if (txHashRegex.test(result)) {
                            var status = txStatus(result);
                            if (status) {
                                $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-success alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Success!</strong> Quorum was updated. <a target="blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result.substring(0, 10) + '...</a></div></div>');
                            } else {
                                $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-danger alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Oops!</strong> Sorry the transaction failed. <a target="blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result.substring(0, 10) + '...</a></div></div>');
                            }
                        } else {
                            $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-danger alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Oops!</strong> Sorry the transaction could not be completed. </div></div>');
                        }
                    });
                };

                var setPeriod = function () {
                    var hours = $('#electionPeriod').val();
                    var secs = hours * 3600;
                    var blocks = secs / config.seconds_per_block;
                    contractInstance.resetPeriod(blocks, (err, result) => {
                        var txHashRegex = /^0x([A-Fa-f0-9]{64})$/
                        if (txHashRegex.test(result)) {
                            var status = txStatus(result);
                            if (status) {
                                $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-success alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Success!</strong> Period was updated. <a target="blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result.substring(0, 10) + '...</a></div></div>');
                            } else {
                                $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-danger alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Oops!</strong> Sorry the transaction failed. <a target="blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result.substring(0, 10) + '...</a></div></div>');
                            }
                        } else {
                            $('#feedbackMsg').html('<div role="alert" class="alert alert-contrast alert-danger alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Oops!</strong> Sorry the transaction could not be completed. </div></div>');
                        }
                    });
                };

                $('#setQuorum').bind('click', function () {
                    setQuorum()
                });
                $('#setPeriod').bind('click', function () {
                    setPeriod()
                });
            }());

            (function getElectionInfo() {
                contractInstance.period((err, result) => {
                    var hours = (result * config.seconds_per_block)/3600;
                    $('#electionPeriod').val(parseInt(hours));
                });
                contractInstance.quorum((err, result) => {
                    var hours = (result * config.seconds_per_block)/3600;
                    $('#electionQuorum').val(parseInt(hours));
                });
            }());

        };

        var displayAddElectionContent = function () {
            // Initialize the form wizard plugin
            Theme.wizard();
            $('#addElectionForm, #addPositionForm, #addCandidateForm').validator();
            $('form').on('submit', function (e) {
                e.preventDefault();
                var action = $(this).attr('data-attr-action');
                switch (action) {
                    case "addElection":
                        var desc = $("#pollTitle").val();

                        contractInstance.add_Election(desc, (err, result) => {
                            var callback = {
                                'init': function () {
                                    var nxtBtns = $('.wizard-next, .btn-next');
                                    nxtBtns.prop('disabled', false);
                                    /*nxtBtns.bind('click', function(){
                                      nxtBtns.prop('disabled', true);
                                    });*/
                                },
                                'getAddress': function (tx) {
                                    console.log('get contract address finished!!!:' + tx.contractAddress);
                                    $('#electionAddress').val(tx.contractAddress);
                                }
                            }
                            processTransaction(result, callback);
                            console.log(err, result);
                        });

                        break;
                    case "addPosition":
                        var position = $("#positionTitle").val();
                        var electionContractAddress = $('#electionAddress').val();

                        var addPositionToList = function (title) {
                            $('#positionList ol').prepend('<li>' + title + '</li>');
                            $('#candidatePosition').append('<option value="' + title + '">' + title + '</option>');
                        };

                        if (electionContractAddress) {
                            var electionContractInstance = web3.eth.contract(electionContractABI).at(electionContractAddress);
                            electionContractInstance.addPosition(position, (err, result) => {
                                var callback = function () {
                                    $('#positionList .alert').hide();
                                    addPositionToList(position);
                                }
                                processTransaction(result, callback);
                                console.log(err, result);
                            });
                        } else {
                            $('#feedback').html('<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Oops!</strong> Election contract Address could not be established. Please try again.</div></div>');
                        }
                        break;
                    case "addCandidate":
                        var electionContractAddress = $('#electionAddress').val();
                        if (electionContractAddress) {
                            var position = $('#candidatePosition').val();
                            var candidate = $('#candidateAddress').val();
                            var name = $('#candidateName').val();

                            var addPositionToList = function (title) {
                                $('#candidateList ol').prepend('<li>' + title + '</li>');
                            };

                            var addCandidateToList = function (name, position) {
                                $('#candidateList tbody').prepend('<tr><td>' + name + '</td><td>' + position + '</td></tr>');
                            };

                            if (electionContractAddress) {
                                var electionContractInstance = web3.eth.contract(electionContractABI).at(electionContractAddress);
                                electionContractInstance.addCandidate(position, candidate, name, (err, result) => {
                                    var callback = function () {
                                        $('#candidateList .alert').hide();
                                        $('#candidateList table').show();
                                        addCandidateToList(candidate, position);
                                        var nxtBtns = $('.wizard-next, .btn-next');
                                        nxtBtns.prop('disabled', false);
                                    }
                                    processTransaction(result, callback);
                                    console.log(err, result);
                                });
                            }
                        } else {
                            $('#feedback').html('<div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button><strong>Oops!</strong> Election contract Address could not be established. Please try again.</div></div>');
                        }
                        break;
                    default:
                        console.log('nothhhhhiiing!!!');
                }
            });
            // on poll type select
            $("#wizard1").on('change', "#selectPoll input[name='poll-type']", function () {
                console.clear();
                var option = $("#selectPoll input[name='poll-type']:checked").val();
                var content = $('#wizard1 .step-content').html();
                $.each(dict[option], function (key, value) {
                    var regex = new RegExp(key, "g");
                    content = content.replace(regex, value);
                    //console.log(key+' '+value);
                });
                $('#wizard1 .step-content').html(content);
                $("#selectPoll input[value='" + option + "']").prop('checked', true);

                Theme.wizard();
            });

            var dict = {
                'elections': {
                    'Question': 'Position',
                    'Questions': 'Positions',
                    'question': 'position',
                    'Choices': 'Candidates',
                    'choice': 'candidate'
                },
                'polls': {
                    'Positions': 'Questions',
                    'Position': 'Question',
                    'position': 'question',
                    'Candidates': 'Choices',
                    'candidate': 'choice'
                }
            };
        };

        var page = location.hash;
        switch (page) {
            case "#polls":
                loadPageContent('elections.html', displayElectionsContent);
                break;
            case "#results":
                loadPageContent('results.html');
                break;
            case "#add-participant":
                loadPageContent('add-voter.html', displayAddVoterContent);
                break;
            case "#add-election":
                loadPageContent('add-election.html', displayAddElectionContent);
                break;
            case "#add-candidate":
                loadPageContent('add-candidate.html', displayAddCandidateContent);
                break;
            case "#positions":
                loadPageContent('positions.html', displayPositionsContent);
                break;
            case "#add-position":
                loadPageContent('add-position.html', displayAddPositionContent);
                break;
            case "#no-account":
                loadPageContent('accounts.html', displaySelectAccountContent);
                break;
            case "":
            case "#dashboard":
                loadPageContent('main.html', displayDashboardContent);
                break;
            default:
                window.location = '404.html';
        }

    }

    var txStatus = function (txHash, callback = '') {
        web3.eth.getTransactionReceipt(txHash, (err, result) => {
            if (result && result.status == '0x1') {
                $.gritter.add({
                    title: "Success!",
                    text: 'Transaction <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank">' + txHash.substring(0, 5) + '...' + txHash.substring(37, 42) + '</a> completed.',
                    class_name: "color success"
                });
                if (callback.getAddress) getContractAddress(txHash, contractAddress, callback.getAddress);
                if (callback.init) {
                    callback.init();
                } else {
                    callback();
                }
            } else if (result && result.status == '0x0') {
                $.gritter.add({
                    title: "Oops!",
                    text: 'Transaction <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank">' + txHash.substring(0, 5) + '...' + txHash.substring(37, 42) + '</a> failed.',
                    class_name: "color danger"
                });
            } else {
                txStatus(txHash, callback);
            }
        });
    };

    var processTransaction = function (result, callback = '') {
        var txHashRegex = /^0x([A-Fa-f0-9]{64})$/;
        if (txHashRegex.test(result)) {
            $('#feedback').html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Success!</strong> The request was submitted.</div></div>');
            txStatus(result, callback);
            $('form').trigger('reset');
        } else {
            $('#feedback').append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Oops!</strong> Sorry the request could not be submitted. Please try again.</div></div>');
        }
    };

    var getContractAddress = function (txHash, address, callback, block = {
        start: 0,
        end: 9999999
    }) {
        console.log('getContractAddress:' + address);
        var api = "https://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=" + address + "&startblock=" + block.start + "&endblock=" + block.end + "&sort=asc&apikey=YourApiKeyToken";
        $.ajax({
            url: api,
            async: true,
            data: 'json',
            success: function (dataJson) {
                if (dataJson.status == '1') {
                    var tx = dataJson.result.find(result => result.hash === txHash);
                    if (tx && tx.contractAddress) {
                        if (callback) callback(tx);
                        return true;
                    } else {
                        setTimeout(function () {
                            getContractAddress(txHash, address, callback, block);
                            console.log('no contract address');
                            console.log(txHash);
                        }, 2000);
                    }
                }
            }
        });
    };

    function listAccountByAddress(address) {
        console.log('list by address');
        loadSnippets();
        window.location.hash = "#no-account";
        //$(window).trigger('hashchange');
        $('.be-left-sidebar').hide();
    };

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    // Public
    return { ...my,
        ...{
            dashboard: init
        }
    };
})(App || {});

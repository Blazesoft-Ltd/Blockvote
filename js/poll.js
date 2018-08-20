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
        } else {
            console.log('web3 is not found');
            $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>Misssig Dependancy!</strong> Kindly install <a href="https://metamask.io/" target="_blank" class="alert-link">MetaMask</a> then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
            return false;
        }
    } else {
        console.log('web3 is not found');
        $('#feedback').html('<div class="alert alert-danger" role="alert"><strong>Misssig Dependancy!</strong> Kindly install <a href="https://metamask.io/" target="_blank" class="alert-link">MetaMask</a> then <a href="" class="alert-link">refresh</a> this page to proceed.</div>');
        return false;
    }

    const electionAddress = getUrlParameter('eid');
    const electionInstance = web3.eth.contract(config.electionABI).at(electionAddress);
    
    electionInstance.election_details((err, institutionName) => {
        $('.poll-title h2').text(institutionName);
        $('.poll-result-title h4').text(institutionName);
    });

    electionInstance.registered_categories((err, numPositions) => {
        console.log(err, numPositions);
        $('#selectPosition').html('<option value="">Select Position or Question</option>');
        for (var i = 0; i < numPositions; i++) {
            electionInstance.position(i, (err, position) => {
                console.log(err, position);
                $('#selectPosition').append('<option value="' + position + '">' + position + '</option>');
            });
        }
        $('#vote-form').validator();
    });

    $('#vote-form').submit(function (e) {
        e.preventDefault();
        var position = $('#selectPosition').val();
        var candidate = $('#inputAddress').val();
        electionInstance.candidateAddress(0, candidate, (err, txHash) => {
            $('#feedback').prepend('<div class="alert alert-success"><strong>Well done!</strong> Request was subitted.</div>');
            txStatus(txHash);
            console.clear();
            console.log(err, txHash);
        });
    });

    $('#vote-form #checkResults').click(function () {
        $('#results').show();
        location.hash = '#results';
        showResults();
    });


    function showResults() {
        for (var i = 0; i < 2; i++) {
            (function (index) {

                electionInstance.vie_positions(i, (err, result) => {
                    var position = result[0];
                    var total_candi = result[1];
                    var leader = result[2];
                    var winner = result[3];
                    var icon = (winner)? 'fa-check-circle' : 'fa-times-circle';

                    console.log(position + ':' + total_candi + ':' + leader + ':' + winner);
                    index = index + 1;
                    if (!result) return false;

                    var active = (index === 1)? 'active': '';

                    var pollItems = $('#poll #pollItems');
                    var tabPane = $('<div class="tab-pane ' + active + '" id="tab' + index + '"><div class="panel-group" id="help-accordion-' + index + '"><div class="panel panel-default panel-help"> <a href="#poll-container" data-toggle="collapse" data-parent="#help-accordion-' + index + '" aria-expanded="true"><div class="panel-heading"><h4>'+position+'</h4></div> </a><div id="poll-container" class="collapse in" aria-expanded="true"><div class="panel-body"><form></form></div></div></div></div></div>');

                    //tabPane.find('form').html('<div><div class="row"><!--<div id="chart-'+index+'" class="col-md-6"></div>--><div id="table-'+index+'" class="col-md-6"><div class="col-md-8 col-sm-12"><table class="table table-bordered"><thead><tr><th>Candidates</th><th>Votes</th><th>Winner</th></tr></thead><tbody><tr><th scope="row">Choice 1</th><td>25</td><td><i class="fa fa-check-circle"></i></td></tr><tr><th scope="row">Choice 2</th><td>14</td><td></td></tr><tr><th scope="row">Choice 3</th><td>5</td><td></td></tr></tbody></table></div></div></div></div>');
                    electionInstance.candiVotes(0,leader,(err, candidateVotes) => {

                        tabPane.find('form').html('<div><div class="row"><div id="table-' + index + '" class="col-md-12"><div class="col-md-8 col-sm-12"><table class="table table-bordered"><thead><tr><th>Candidate</th><th>Number of candidate</th><th>Votes</th><th>Winner</th></tr></thead><tbody><tr><td>' + leader + '</td><td>' + total_candi + '</td><td>' + candidateVotes + '</td><td><i class="fa '+icon+'"></i></td></tr></tbody></table></div></div></div> </div');

                        pollItems.append(tabPane);
                        var elemId = 'chart-' + index;
                        
                    });
                    //googleCharts(elemId, electionTitle);

                });

            })(i);
        }
    };

    function googleCharts(elemID, electionTitle) {
        console.clear();
        // Load google charts
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);

        // Draw the chart and set the chart values
        function drawChart() {
            console.log(elemID);

            var data = google.visualization.arrayToDataTable([
                ['Task', 'Votes'],
                ['Choice 1', 25],
                ['Choice 2', 14],
                ['Choice 3', 15]
            ]);

            // Optional; add a title and set the width and height of the chart
            var options = {
                'title': 'Pie Chart',
                'width': 550,
                'height': 400
            };

            // Display the chart inside the <div> element with id="piechart"

            var chart = new google.visualization.PieChart(document.getElementById(elemID));
            chart.draw(data, options);
        }

    }

    function txStatus(txHash) {
        web3.eth.getTransactionReceipt(txHash, (err, result) => {
            var transInfo = 'Transcation id: <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank"><strong>' + txHash + '</strong></a>';

            if (result && result.status == '0x1') {
                $('#feedback').prepend('<div class="alert alert-success"><strong>Success!</strong> Transaction <a href="https://ropsten.etherscan.io/tx/' + txHash + '" target="_blank">' + txHash.substring(0, 5) + '...' + txHash.substring(37, 42) + '</a> completed.<br>' + transInfo + '</div>');
            } else if (result && result.status == '0x0') {
                $('#feedback').prepend('<div class="alert alert-danger"><strong>Sorry!</strong> Transaction failed. Please try again.<br>' + transInfo + '</div>');
            } else {
                setTimeout(function () {
                    txStatus(txHash);
                }, 2000);
            }
        });
    }

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

(function(){
        // vars
        var endpoint = '/results.json';
        var site;
        
        Highcharts.setOptions({
            plotOptions: {
                series: {
                    animation: false
                }
            },
            credits: {
                enabled: false
            }
        });
        // Dashboard class
        var Dashboard = {
            updateMap: function (data) {
                $('#container').highcharts('Map', {
                    title : {
                        text : ''
                    },
                    exporting: { 
                      enabled: false 
                    },

                    chart : {
                        backgroundColor: '#ffffff'
                    },
                    legend : {
                      enabled: false,
                      itemStyle: {
                        color: '#ffffff'
                      }
                    },

                    mapNavigation: {
                        enabled: false,
                        enableButtons: false
                        
                    },

                    colorAxis: {
                       min: 0,
                       minColor: '#D6E685',
                       maxColor: '#1E6823'
                    },

                    series : [{
                        data : data["map-data"],
                        mapData: Highcharts.maps['custom/world-eckert3-highres'],
                        joinBy: 'hc-key',
                        name: 'Where did you travel from?',
                        states: {
                            hover: {
                                color: '#8db25c'
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }]
                });
            },
            update3dPonyPie: function (data) {
                $('#pony-pie').highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45
                        },
                        style: {
                            fontFamily: "caktusfont-bold"
                        }
                    },
                    colors: ['#6c7a78', '#117f89', '#9ec16c'],
                    title: {
                        text: 'Did you travel on a Django pony?',
                        style: {
                            fontSize: '26px',
                            color: '#117f89'
                        }
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 100,
                            depth: 45
                        }
                    },
                    series: [{
                        name: 'Did you travel on a Django pony?',
                        data: [
                            ['No', data['pony-data']['no']],
                            ['Yes', data['pony-data']['yes']],
                            ['I Wish!', data['pony-data']['wish']]
                        ]
                    }]
                });
            },
            updatePopularCountry: function (data) {
                var country_data = data['countries-data'];
                sorted = Object.keys(country_data).sort(function(a,b){return country_data[a]-country_data[b]})
                // console.log(sorted.pop());
                var popularCountry = sorted.pop();
                $("#countries-bar p").html(popularCountry);
            },
            updateSelf: function () {
                _this = this;
                $.ajax({
                    type: "GET",
                    url: endpoint,
                    // url: 'https://31faed 3e.ngrok.io' + endpoint,
                    dataType: 'json'
                })
                    .then(function( json ) {
                        console.log( "JSON Data: ", json['recent-run'] );
                        Dashboard.updateMap(json);
                        Dashboard.update3dPonyPie(json);
                        Dashboard.updatePopularCountry(json);
                    })
                    .fail(function( jqxhr, textStatus, error ) {
                        var err = textStatus + ", " + error;
                        console.log( "Request Failed: " + err );
                        // show fake test page
                    });
                window.setInterval(_this.updateSelf, 1500);
                
            }
        }
        // setup
        if ($('#container').data('env') === 'local') {
            site = 'http://localhost:8080';
            console.log('my environment is local');
        }
        if ($('#container').data('env') === 'staging') {
            site = 'staging site';
            console.log('my environment is staging');
        }
        if ($('#container').data('env') === 'production') {
            site = 'production site';
            console.log('my environment is production');
        }

        Dashboard.updateSelf();
    })($)

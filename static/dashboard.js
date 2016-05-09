(function() {
  var apiURL = '/results.json';

  $(document).ready(function() {
      $.ajax({
          type: "GET",
          url: apiURL,
          dataType: 'json'
      }).then(function(data) {
        /* The code to make the map */
        // Initiate the chart
        $('#container').highcharts('Map', {

            title : {
                text : ''
            },
            credits: {
                enabled: false
            },
            exporting: { 
              enabled: false 
            },

            chart : {
                backgroundColor: '#ffffff',
                width: 1440
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

        /* Make the highcharts pie chart for pony travel */
        var ponyListOfObjects = data["pony-data"]
        ponyData = prepHighChartsData(ponyListOfObjects);
        makeHighchartsPonyChart(ponyData);

        /* Make the highcharts bar chart for country */
        var countriesListOfObjects = data["countries-data"]
        countryData = prepHighChartsData(countriesListOfObjects);
        makeHighchartsCountriesChart(countryData);
      });
  });

  var prepHighChartsData = function(data) {
      // Create Array from JSON
      var prepped_data = [];
      for (var key in data) {
        prepped_data.push(
            {
             'sliced': true,
             'selected': true,
             'y': data[key],
             'name': key
            });
      };
      return prepped_data;
  }

  var makeHighchartsPonyChart = function(dataList) {
    // The highcharts part
    $('#pony-pie').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 55,
                beta: 0
            },
            backgroundColor: '#ffffff'
        },
        credits: {
            enabled: false
        },
        colors: ['#8db25c', '#D6E685', '#1E6823', '#003236'],
        title: {
            text: 'Did you travel in on a Django pony?'
        },
        tooltip: {
            pointFormat: '{point.name}: {point.y} (<b>{point.percentage:.1f}%</b>)',
            style: {
              fontSize: '1.5em'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 85,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                      fontSize: '2em',
                      textShadow: false
                    },
                    color: '#ffffff'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Favorites',
            data: dataList
        }]
    });
  }

  var makeHighchartsCountriesChart = function(dataList) {
    // The highcharts part
    $('#countries-bar').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: '#ffffff'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'What country did you travel from?'
        },
        tooltip: {
            pointFormat: '{point.name}: {point.y} (<b>{point.percentage:.1f}%</b>)',
            style: {
              fontSize: '1.5em'
            }
        },
        series: [{
            type: 'bar',
            data: dataList
        }]
    });
  }


}());

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

            chart : {
                backgroundColor: '#147F89'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
               min: 0,
               minColor: '#ffffff',
               maxColor: '#8db25c'
            },

            series : [{
                data : data["map-data"],
                mapData: Highcharts.maps['countries/us/us-all'],
                joinBy: 'hc-key',
                name: 'Where did you come from?',
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

        /* Make the highcharts pie chart for favorite animals */
        var animalsListOfObjects = data["animal-data"]
        // Add 'sliced': true and 'selected': true for each object (animal)
        for (var i = 0; i < animalsListOfObjects.length; i++) {
          animalsListOfObjects[i]['sliced'] = true;
          animalsListOfObjects[i]['selected'] = true;
        }
        // Make the Highcharts pie chart
        makeHighchartsAnimalChart(animalsListOfObjects);
      });
  });


  var makeHighchartsAnimalChart = function(dataList) {
    // The highcahrts part
    $('#animal-pie').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 55,
                beta: 0
            },
            backgroundColor: '#147F89'
        },
        colors: ['#8db25c', '#D6E685', '#1E6823', '#003236'],
        title: {
            text: 'Cat and dog preferences'
        },
        tooltip: {
            pointFormat: '{series.name}: {point.y} (<b>{point.percentage:.1f}%</b>)'
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
                    color: 'white',
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

}());

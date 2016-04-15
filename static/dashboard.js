var apiURL = '/results.json';
$(document).ready(function() {
    var mapArray = [];
    $.ajax({
        type: "GET",
        url: apiURL,
        dataType: 'json'
    }).then(function(data) {
      // Initiate the chart
      $('#container').highcharts('Map', {

          title : {
              text : ''
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
                      color: '#147F89'
                  }
              },
              dataLabels: {
                  enabled: true,
                  format: '{point.name}'
              }
          }]
      });
      // end map
    });
});

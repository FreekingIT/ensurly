// // 'use strict';
// // $(document).ready(function() {
// //     setTimeout(function() {
// //     // [ Donut-chart ] Start
// //     var graph = Morris.Donut({
// //         element: 'morris-donut-chart',
// //         data: [
// //             {
// //                 value: 80,
// //                 label: 'Authenticated Products'
// //             },
// //             {
// //                 value: 10,
// //                 label: 'Fake Products'
// //             },
// //         ],
// //         colors: [
// //             'rgb(243,121,92)',
// //             'rgb(88,104,255)',
// //         ],
// //         resize: true,
// //         formatter: function(x) {
// //             return "val : " + x
// //         },
// //         // enableInteractivity: false
// //     });    
// //     // [ Donut-chart ] end
// // }, 500);
// // });

// google.charts.load('current',{packages:['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// function drawChart() {
// // Set Data
// var data = google.visualization.arrayToDataTable([
//   ['Price', 'Size'],
//   [50,7],[60,8],[70,8],[80,9],[90,9],
//   [100,9],[110,10],[120,11],
//   [130,14],[140,14],[150,15]
// ]);
// // Set Options
// var options = {
//   title: 'House Prices vs. Size',
//   hAxis: {title: 'Square Meters'},
//   vAxis: {title: 'Price in Millions'},
//   legend: 'none'
// };
// // Draw
// var chart = new google.visualization.LineChart(document.getElementById('morris-donut-chart'));
// chart.draw(data, options);
// }
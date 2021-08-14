function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids; 
    var otu_labels = result.otu_labels.slice(0,10).reverse();
    var sample_values = result.sample_values.slice(0,10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      // x: sample_values, 
      x: sample_values,
      y: yticks,
      type: "bar",
      orientation:"h",
      text: otu_labels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found", 
      xaxis: {title: "Sample Values"},
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


// Deliverable 2: Bubble Chart
 // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otu_ids, 
    y: sample_values,
    text: otu_labels,
    mode: "markers",
     marker: {
       size: sample_values,
       color: sample_values,
       colorscale: "blues" 
     }
  }];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
        hovermode: "closest"
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout)


//Deliverable 3: Gauge Chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
  
    // Create a variable that holds the first sample in the array.
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample); 

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washing_frequency = gaugeResult.wfreq;
    console.log(washing_frequency);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
});
}

// function init() {
//   var selector = d3.select("#selDataset");

//   d3.json("samples.json").then((data) => {
//     console.log(data);
//     var sampleNames = data.names;
//     sampleNames.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });
//   // initialize page with first subject loaded
//   optionChanged(sampleNames[0]);
// })
// }

// // called by 'onchange' in index.html
// function optionChanged(newSample) {
//   buildMetadata(newSample);
//   buildCharts(newSample);
// }

// function buildMetadata(sample) {
//   d3.json("samples.json").then((data) => {
//     var metadata = data.metadata;
//     var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
//     var result = resultArray[0];
//     var PANEL = d3.select("#sample-metadata");

//     PANEL.html("");
//     //PANEL.append("h6").text(result);
//     Object.entries(result).forEach(([key, value]) =>
//       {PANEL.append("h6").text(key.toUpperCase() + ': ' + value);});
//   });
// }

// function buildCharts(sample) {
//   // Create a Bar Chart
//   d3.json("samples.json").then((data) => {
//     var species = data.samples.filter(sampleObj => sampleObj.id == sample)[0];
//     var topTenValues = species.sample_values.slice(0,10);
//     var topTenIDs = species.otu_ids.slice(0,10).map(id => "OTU " + id);
//     var topTenLabels = species.otu_labels.slice(0,10);

//     var trace = {
//       x: topTenValues.reverse(),
//       y: topTenIDs.reverse(),
//       mode: 'markers',
//       text: topTenLabels.reverse(),
//       type: "bar",
//       orientation: "h"
//     };
//     var data = [trace];
//     Plotly.newPlot("bar", data);
//   });

//   // Create Bubble Chart
//   d3.json("samples.json").then((data) => {
//     var species = data.samples.filter(sampleObj => sampleObj.id == sample)[0];
//     var otu_ids = species.otu_ids;
//     var sample_vals = species.sample_values;
//     var labels = species.otu_labels;

//     var desired_maximum_marker_size = 50;
//     var size = sample_vals.map(num => num * 20);

//     var trace = {
//       x: otu_ids,
//       y: sample_vals,
//       text: labels,
//       mode: 'markers',
//       marker: {
//         color: otu_ids,
//         colorscale: [[0, 'rgb(0,0,255)'], [1,'rgb(255,0,0)']],
//         size: size,
//         sizeref: 2.0 * Math.max(sample_vals) / (desired_maximum_marker_size ** 2),
//         sizemode: 'area'
//       }

//     }

//     var data = [trace];
//     var layout = {
//       xaxis: { title: "OTU ID" } 
//     };

//     Plotly.newPlot("bubble", data, layout)
//   });

//   // Create Gauge Chart
//   d3.json("samples.json").then((data) => {
//     var washes = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
//     console.log(washes);
//     var trace = {
//       type: "pie",
//       hole: 0.4,
//       rotation: 90,
//       showlegend: false,
//       values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
//       text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
//       direction: 'clockwise',
//       textinfo: 'text',
//       textposition: 'inside',
//       marker: {
//         colors: ['','','','','','','','','','white'],
//       },
//       labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9', ''],
//       hoverinfo: "label"
//     };

//     var h = 0.5, k = 0.5;
//     var degrees = (180/10 * washes), radius = .3;
//     var radians = degrees * Math.PI / 180;
//     var x = -1 * radius * Math.cos(radians);
//     var y = radius * Math.sin(radians);
    

//     var layout = {
//       shapes: [{
//         type: 'line',
//         x0: h,
//         y0: k,
//         x1: h + x,
//         y1: k + y,
//         line: {
//           color: 'black',
//           width: 3
//         }
//       }],
//       title: "Belly Button Washing Frequency",
//       xaxis: {visible: false, range: [-1, 1]},
//       yaxis: {visible: false, range: [-1, 1]},
//       annotations: [{
//         text: "Scrubs per Week",
//           font: {
//           size: 13,
//           color: 'rgb(116, 101, 130)',
//         },
//         showarrow: false,
//         align: 'center',
//         x: 0.5,
//         y: 1.15,
//         xref: 'paper',
//         yref: 'paper',
//       }]
//     };
//     var data = [trace];
//     Plotly.newPlot("gauge", data, layout);
//   });
// }

// init();
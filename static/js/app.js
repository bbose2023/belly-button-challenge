// Build the metadata panel
function buildMetadata(sample) {
  console.log('Lets build the MetaData');
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    let metaDataArray = data.metadata;

    console.log(`Current Selection: ${sample}`);
    // Filter the metadata for the object with the desired sample number
    filteredMetaData = metaDataArray.filter(function(metaData) {
      return metaData.id == sample;
    });
    console.log(`Current MetaData: ${filteredMetaData}`);
    // Use d3 to select the panel with id of `#sample-metadata`
    sample_metaData_div = d3.select('#sample-metadata');
    console.log(sample_metaData_div);
    // Use `.html("") to clear any existing metadata
    sample_metaData_div.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    
    element = filteredMetaData[0];    
    sample_metaData_div.append("p").text(`ID : ${element.id}`);
    sample_metaData_div.append("p").text(`ETHNICITY : ${element.ethnicity}`);
    sample_metaData_div.append("p").text(`GENDER : ${element.gender}`);
    sample_metaData_div.append("p").text(`AGE : ${element.age}`);
    sample_metaData_div.append("p").text(`LOCATION : ${element.location}`);
    sample_metaData_div.append("p").text(`BBTYPE : ${element.bbtype}`);
    sample_metaData_div.append("p").text(`WFREQ : ${element.wfreq}`);
  });
}

// function to build both charts
function buildCharts(sample) {
  console.log('Lets build the Charts');
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesArray = data.samples;

    console.log(`Current Selection For Chart: ${sample}`);

    // Filter the samples for the object with the desired sample number
    filteredSample = samplesArray.filter(function(item) {
      return item.id == sample;
    });
    console.log(`Filtered Data for chart: ${filteredSample}`);

    element = filteredSample[0];

    
    createBarGraph(element);
    createBubbleChart(element);
    
  });
}

/*
Create Bar Graph
*/
function createBarGraph(sample)
{
    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sample.otu_ids;
    let otuLabels = sample.otu_labels;
    let sampleValues = sample.sample_values;

    console.log(otuIds);    

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yTicks = otuIds.map(otuId => `OTU ${otuId}`);
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: sampleValues.slice(0,10),
      y: yTicks.slice(0,10) ,
      text: otuLabels.slice(0,10),
      type: "bar",
      orientation: "h" 
    };
    
    // Data trace array
    let barData = [trace1];

    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Number of Bacteria' },
      yaxis: {
        autorange: "reversed",
        tickvals: yTicks.slice(0,10),
        ticktext: yTicks.slice(0,10),        
      }
    };
    
   
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, layout);
}

/*
Create Bubble Chart
*/
function createBubbleChart(sample)
{
  let otuIds = sample.otu_ids;
  let otuLabels = sample.otu_labels;
  let sampleValues = sample.sample_values;
  // Build a Bubble Chart
  console.log(otuIds); 
  console.log(sampleValues); 
  console.log(otuLabels); 

  var bubbleTrace = {
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode:"markers",
    marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Earth"
    }
    
  };

  var bubbleData = [bubbleTrace];

  var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{
          title: "OTU ID"
      },
      yaxis:{
        title: "Number of Bacteria"
    }

  };

  // Render the Bubble Chart

  Plotly.newPlot("bubble",bubbleData,bubbleLayout);
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    console.log(data);

    let namesArray = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    namesArray.map(item => {
      // append() method appends a new element as the last child of the element in the current selection
      let newOption = dropDown.append("option").attr("value",item);
      newOption.text(item);
    });

    // Get the first sample from the list
    let firstName = namesArray[0];
    console.log(firstName);
    // Build charts and metadata panel with the first sample
    buildCharts(firstName);
    buildMetadata(firstName);
  });
}

// Function for event listener
function optionChanged(selectedSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(selectedSample);
  buildMetadata(selectedSample);
}

// Initialize the dashboard
init();

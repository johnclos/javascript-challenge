// Add a variable for selecting the data set
var select_controller = d3.select("#selDataset")
console.log("select_controller")
console.log(select_controller)

// Call the data into the inspector console
d3.json("data/samples.json").then(function(data) {
    console.log("data");
    console.log(data);

    var get_names = data.names;
    console.log("get_names");
    console.log(get_names);

    get_names.forEach((name) => {
        select_controller
            .append("option")
            .property("value", name)
            .text(name);
    });
});

// create the function to create the charts and show the demographic info
function optionChanged(selected_id) {
    console.log("selected_id")
    console.log(selected_id)

    d3.json("data/samples.json").then(function(data) {
        var samples = data.samples;
        console.log("samples");
        console.log(samples);   
        
        var results = samples.filter(sampleObj => sampleObj.id == selected_id);
        console.log("results");
        console.log(results); 

        record = results[0];
        console.log("record");
        console.log(record);

        // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Use `sample_values` as the values for the bar chart.
        var sample_values = record.sample_values;

        // Use `otu_ids` as the labels for the bar chart.
        var otu_ids = record.otu_ids;
             
        // * Use `otu_labels` as the hovertext for the chart.
        var otu_labels = record.otu_labels;

        // Create a bubble chart that displays each sample.
        var y_label = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        console.log("y_label: ");
        console.log(y_label);
    
        // * Use`otu_ids` for the x values.
        // * Use`sample_values` for the y values.
        var bar_trace = {
            y: y_label,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        };

        var bar_layout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };
        
        Plotly.newPlot("bar", [bar_trace], bar_layout);
        
    // * Use`sample_values` for the marker size.
    // * Use`otu_ids` for the marker colors.
    // * Use`otu_labels` for the text values.
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };
    var data = [bubble_trace];
    var bubble_layout = {
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };
    Plotly.newPlot("bubble", [bubble_trace], bubble_layout);

    var results = samples.filter(sampleObj => sampleObj.id == selected_id);
    });
    
    // Display the sample metadata, i.e., an individual's demographic information.
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        console.log("metadata");
        console.log(metadata);
        var results = metadata.filter(metadataObj => metadataObj.id == selected_id);
        var result = results[0];
        console.log("results")
        console.log(results)
        console.log("result")
        console.log(result)
        var fig = d3.select("#sample-metadata");
        fig.html("");
        Object.entries(results[0]).forEach(([key, value]) => {
          fig.append("h5").text(`${key}: ${value}`);
        });
    });
}

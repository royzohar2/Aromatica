(() => {
  const token = localStorage.getItem("token");
  // Fetch sales data by date using AJAX
  $.ajax({
    url: "http://localhost:3000/statistic/sales-by-date",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (salesData) {
      // Restructure data for D3
      const formattedData = salesData.map((sale) => ({
        date: new Date(sale._id),
        totalSales: sale.totalSales,
      }));

      const last7DaysData = formattedData.slice(-7);

      // Set up dimensions for the chart
      const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Create SVG element
      const svg = d3
        .select("#salesChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set up scales
      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(d3.extent(last7DaysData, (d) => d.date)); // Set x domain from min to max date
      y.domain([0, d3.max(last7DaysData, (d) => d.totalSales)]);

      // Create line generator
      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.totalSales));

      // Append line to SVG
      svg
        .append("path")
        .datum(last7DaysData)
        .attr("class", "line")
        .attr("d", line) // Generate path for the last 7 days data
        .style("stroke", "#17B169") // Set line color to green
        .style("fill", "none"); // Remove fill

      // Append x-axis and y-axis
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    },
    error: function () {
      console.error("Error fetching sales data.");
    },
  });

  // Fetch orders count by product count data using AJAX
  $.ajax({
    url: "http://localhost:3000/statistic/Product-Count",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (ordersCountData) {
      ordersCountData.sort((a, b) => a._id - b._id);
      // Set up dimensions for the chart
      const margin = { top: 20, right: 20, bottom: 60, left: 60 }, // Adjust bottom margin for x-axis labels
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Create SVG element
      const svg = d3
        .select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set up scales
      const x = d3.scaleBand().range([0, width]).padding(0.1);
      const y = d3.scaleLinear().range([height, 0]);

      // Map product counts to x domain and orders counts to y domain
      x.domain(ordersCountData.map((data) => data._id.toString())); // Convert _id to string for x-axis labels
      y.domain([0, d3.max(ordersCountData, (data) => data.ordersCount)]);

      // Append bars to SVG
      const bars = svg
        .selectAll(".bar")
        .data(ordersCountData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (data) => x(data._id.toString()))
        .attr("width", x.bandwidth())
        .attr("y", (data) => y(data.ordersCount))
        .attr("height", (data) => height - y(data.ordersCount))
        .style("fill", "#17B169");

      // Add labels to bars
      bars
        .append("text")
        .attr("x", (data) => x(data._id.toString()) + x.bandwidth() / 2)
        .attr("y", (data) => y(data.ordersCount) - 5)
        .attr("text-anchor", "middle")
        .text((data) => data.ordersCount);

      // Append x-axis and y-axis
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.15em")
        .attr("transform", "rotate(-65)");

      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    },
    error: function () {
      console.error("Error fetching orders count data.");
    },
  });

  // Fetch product information using AJAX

  $.ajax({
    url: "http://localhost:3000/statistic/product-info", // Update the URL accordingly
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (productsInfo) {
      // Specify the dimensions of the chart.
      const width = 600;
      const height = width;
      const margin = 1; // to avoid clipping the root circle stroke
      const name = (d) => d.name; // Name of the perfume
      const group = (d) => d.brand; // Brand of the perfume

      // Specify the number format for values.
      const format = d3.format(",d");

      // Create a categorical color scale.
      const color = d3.scaleOrdinal(d3.schemeTableau10);

      // Create the pack layout.
      const pack = d3
        .pack()
        .size([width - margin * 2, height - margin * 2])
        .padding(3);

      // Compute the hierarchy from the data; expose the values
      // for each node; apply the pack layout.
      const root = pack(
        d3.hierarchy({ children: productsInfo }).sum((d) => d.price)
      ); // Using the price as the sum value

      // Create the SVG container.
      const svg = d3
        .select("#bubbleChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-margin, -margin, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
        .attr("text-anchor", "middle");

      // Place each (leaf) node according to the layout’s x and y values.
      const node = svg
        .append("g")
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Add a title.
      node
        .append("title")
        .text((d) => `${d.data.name}\n${format(d.data.price)}`); // Displaying the name and price

      // Add a filled circle.
      node
        .append("circle")
        .attr("fill-opacity", 0.7)
        .attr("fill", (d) => color(group(d.data)))
        .attr("r", (d) => d.r);

      // Add a label.
      const text = node
        .append("text")
        .attr("clip-path", (d) => `circle(${d.r})`);

      // Add a tspan for the perfume name.
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", -10) // Adjust the y position for better display
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text((d) => d.data.name);

      // Add a tspan for the perfume price.
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", 10) // Adjust the y position for better display
        .attr("fill-opacity", 0.7)
        .text((d) => format(d.data.price));

      // Create the legend
      const legendContainer = d3.select("#legend");

      const legend = legendContainer
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("div")
        .attr("class", "legend")
        .style("display", "inline-block")
        .style("margin-right", "10px");

      // Add a colored rectangle to the legend
      legend
        .append("div")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color", (d) => color(d))
        .style("display", "inline-block")
        .style("margin-right", "5px");

      // Add the brand name to the legend
      legend
        .append("div")
        .style("display", "inline-block")
        .text((d) => d);

      return Object.assign(svg.node(), { scales: { color } });
    },
    error: function () {
      console.error("Error fetching product information.");
    },
  });
})();

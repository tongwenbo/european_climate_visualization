<script>
  import * as d3 from "d3";
  console.log(d3);

  // prepare the parameters
  const width = 1500;
  const height = 800;
  const margin = {top:100,right: 210, bottom: 100, left: 120};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  let xScale, yScale;
  const xAxisLabel = 'Yearly sunshine of 1961-1990 means (%)';
  const yAxisLabel = 'Yearly precipitation of 1960-1990 means (%)';
  let allyears;
  let sequantial;
  let xValue = d => d['Sunshine dur. (%)'];
  let yValue = d => d['Precipitation %']; 
  let duration = 1500;
  const legend_name = new Array();
  const legend_color = new Array();
  let maxX, maxY;
  
  // prepare the color scheme
  const color = {
    "Zugspitze": "#ff1c12",
    "Stuttgart": "#de5991",
    "Dresden": "#E69D87",
    "Essen": "#be3259",
    "Frankfurt(M)": "green",
    "München": "#9359b1",
    "Helgoland": "#47c0d4",
    "Hamburg-Fu": "#F49F42",
    "Greifswald": "navy",
    "Berlin": "grey",
  }

  for (const i in color)
  {
    legend_name.push(i);
    legend_color.push(color[i]);
  }
  console.log(legend_name)
  console.log(legend_color)  // for debugging

  // append the svg object
  const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr('height', height);
  
  const renderinit = function(data){  // initialization
    xScale = d3.scaleLinear()
    .domain([80, 150]) 
    .range([0, innerWidth])
    .nice();

    yScale = d3.scaleLinear()
    .domain([55, 160].reverse()) // make y-axis start from the bottom; 
    .range([0, innerHeight])
    .nice();

    maxX = xScale(d3.max(data, xValue));
    maxY = yScale(d3.max(data, yValue));

    const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('id', 'maingroup');

    // Adding axes; 
    const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth);
    const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight);

    let yAxisGroup = g.append('g').call(yAxis)
    .attr('id', 'yaxis')
    .attr("font-size", "16px");

    yAxisGroup.append('text')
    .attr('font-size', '2em')
    .attr('transform', `rotate(-90)`)
    .attr('x', -innerHeight / 2)
    .attr('y', -60)
    .attr('fill', '#333333')
    .text(yAxisLabel)
    .attr('text-anchor', 'middle') // Make label at the middle of axis. 
    yAxisGroup.select(":nth-child(8) line")  // highlight the line 100%, which is what i want audience to focus
     .attr("stroke-width","4");

    let xAxisGroup = g.append('g').call(xAxis)
    .attr('transform', `translate(${0}, ${innerHeight})`)
    .attr('id', 'xaxis')
    .attr("font-size", "16px");
    xAxisGroup.append('text')
    .attr('font-size', '2em')
    .attr('y', 60)
    .attr('x', innerWidth / 2)
    .attr('fill', '#333333')
    .text(xAxisLabel);
    xAxisGroup.select(":nth-child(6) line")   // highlight the line 100%, which is what i want audience to focus
     .attr("stroke-width","4");

    var legend = d3.select("#maingroup").selectAll(".legend")
        .data(legend_name)
        // @ts-ignore
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (innerWidth + 10) + "," + (i * 25 + 300) + ")"; });
    
    // draw legend colored rectangles
    legend.append("rect")
    .data(legend_name) 
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 20)
    .style("fill", function (d,i) { return legend_color[i];});

    // draw legend text
    legend.append("text")
    .data(legend_name) 
    .attr('class', 'legend_text')
    .attr("x", 40)
    .attr("y", 9)
    .attr("dy", ".5em")
    .style("text-anchor", "start")
    .text(function (d,i) {return legend_name[i];}); 
  };

  const renderUpdate = function(seq){  // update the sequence for every year
    const g = d3.select('#maingroup');
    let year = seq[0]["Year"];  // set the start point

    g.selectAll('.date_text').remove();
    g.append("text")
    .data(['seq'])
    .attr("class", "date_text")
    .attr("x", innerWidth - 35)
    .attr("y", innerHeight / 10 - 20)
    .attr("dy", ".5em")
    .style("text-anchor", "end")
    .attr("fill", "#504f4f")
    .attr('font-size', '6em')
    .attr('font-weight', 'bold')
    .text(year);

    let circleupdates = g.selectAll('circle').data(seq, d => d['Station city']);

    // @ts-ignore enter()
    let circleenter = circleupdates.enter().append('circle')
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .attr('r', 10)
    .attr('fill', d => color[d['Station city']])
    .attr('opacity', 0.8)
    
    // @ts-ignore merge
    circleupdates.merge(circleenter)
    .transition().ease(d3.easeLinear).duration(duration)
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)));
  }

  d3.csv('../src/assets/europa_weather_2021-2000.csv').then(data=>{
    data = data.filter( d=>d['Station country'] == 'DEU' );
    data.forEach(d => {
      d['Precipitation total (mm)'] =+ (d['Precipitation total (mm)']);
      d['Temperature mean'] =+ (d['Temperature mean']);
      if(d['Station city'] == 'Frankfurt/M.' || d['Station city'] == 'Frankfurt/Main'){
        d['Station city'] = 'Frankfurt(M)'
      }else if(d['Station city'] == 'München-Stadt' || d['Station city'] == 'München (Stadt)'){
        d['Station city'] = 'München'
      }else if(d['Station city'] == 'Berlin-Brandenburg' || d['Station city'] == 'Berlin-Tegel'){
        d['Station city'] = 'Berlin'
      }else if(d['Station city'] == 'Hamburg-Fuhlsb.'){
        d['Station city'] = 'Hamburg-Fu'  // I have checked, it is the official abbreviation
      }
    });

    allyears = Array.from( new Set(data.map( d => d['Year'] )));
    allyears = allyears.sort( (a,b) => {
      return a-b;
    })
    
    // this sequantial is for stroage of each year`s data
    sequantial = [];
    allyears.forEach(d=>{
      sequantial.push([])
    });
    data.forEach(d=>{
      sequantial[ allyears.indexOf(d['Year']) ].push(d);
    })

    renderinit(data);
    
    let c = 0;
    let intervalid = setInterval(()=>{
      if(c >= allyears.length){
        clearInterval(intervalid);
      }else{
        renderUpdate(sequantial[c]);
        c = c + 1;
      }
    }, duration)

  })

</script>

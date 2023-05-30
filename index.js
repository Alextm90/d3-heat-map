const padding = 100
const width = 1400
const height = 700
const tickMonths = ['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 

// create svg + title
const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

svg.append('text')
        .text('D3 heat map')
        .attr('id', 'description')
        .attr('x', width/2)
        .attr('y', padding)
        .attr('font-size', '36px')

// fetch data
const map = async () => {
    await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => {

// create x-axis + scale
const xScale = d3.scaleTime()
       .domain([new Date(d3.min(data.monthlyVariance, (d) => d.year)), new Date(d3.max(data.monthlyVariance, (d) => d.year + 1))])
       .range([padding, width - padding])
    
const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format(""))
        .ticks(30)

svg.append('g')
        .call(xAxis) 
        .attr('id', 'x-axis')
        .attr("transform", 'translate(0,  ' + (height - padding) + ')')

// create y-axis + scale
const yScale = d3.scaleLinear()
       .domain([12.5, 0.5])
       .range([height/1.4, 0])
    
const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d,i) => { 
            return tickMonths[d] // first "d" = 12
        }) 
console.log(data.monthlyVariance.length)
svg.append('g')
        .call(yAxis) 
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')

// add data points

svg.selectAll('rect')
        .data(data.monthlyVariance)
        .join('rect')
        .attr('x', (d, i) => {
            return xScale(new Date(d.year)) 
          })
        .attr('y', (d, i) => {
            return yScale(d.month)  
       })
        .attr("class", "cell")
        .attr('width', 1200/(data.monthlyVariance.length/12))
        .attr('height', (height - padding * 2) / 12)
        .attr('fill', 'red')
        .attr("transform", "translate(0," + 79 + ")")
     })
}
map()
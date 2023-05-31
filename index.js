const padding = 100
const width = 1400
const height = 900
const tickMonths = ['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
const colorArray = ["red", "blue", "orange", "grey", "pink", "green", "black", "purple", "yellow", "aqua", "gold" ] 
const tempArray = [1.6, 2.7, 3.8, 4.9, 6, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7, 13.9]

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
       .domain([d3.min(data.monthlyVariance, (d) => d.year), d3.max(data.monthlyVariance, (d) => d.year + 1)])
       .range([padding, width - padding])
    
const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format(""))
        .ticks(30)

svg.append('g')
        .call(xAxis) 
        .attr('id', 'x-axis')
        .attr("transform", 'translate(0,  ' + (height - (padding * 3)) + ')')

// create y-axis + scale
const yScale = d3.scaleBand()
       .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
       .range([height - padding * 4, 0])
    
const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d,i) => { 
            return tickMonths[d] // first "d" = 12
        }) 

svg.append('g')
        .call(yAxis) 
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')

// create legend
const legendScale = d3.scaleBand()
        .domain(tempArray) 
        .range([0, 300])

const legendAxis = d3.axisBottom()
        .scale(legendScale)
        
const legend = svg.append('g')
        .attr('id', 'legend')
        .call(legendAxis) 
        .attr('transform', 'translate(' + 300 + ', ' + 675 + ')')

 legend.selectAll('.rect')
        .data(tempArray)
        .join('rect')
        .attr('class', 'rect')
        .attr('y', padding)
        .attr('x', (d, i) => {
            console.log(d)
            return legendScale(d)
        })
        .attr('fill', (d, i) => {
                    return colorArray[i] 
        })
        .attr('width', 24.36) 
        .attr('height', 30)
        .style("outline", (d, i) => {
            if (i != 11) return "1px solid black"
        })  
       .attr("transform", 'translate(13,  ' + - 130 + ')')

// add data points
svg.selectAll('.cell')
        .data(data.monthlyVariance)
        .join('rect')
        .attr('x', (d, i) => {
            return xScale(d.year) 
          })
        .attr('y', (d, i) => {
            return yScale(d.month)  
       })
        .attr('width', 1200/(data.monthlyVariance.length/12)) 
        .attr('height', (height - padding * 4) / 12)
        .attr("class", "cell")
        .attr('fill', (d, i) => {
            for (let n = 0; n < tempArray.length; n++) {
            if (data.baseTemperature + d.variance >= tempArray[n] && data.baseTemperature + d.variance < tempArray[n + 1]) {
                return colorArray[n]
            }
            }
        })
        .attr("transform", "translate(0," + padding + ")")
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance)

     })
}
map()
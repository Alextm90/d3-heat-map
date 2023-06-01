const padding = 100
const width = 1400
const height = 700
const round = d3.format(".1f")
const monthArray = ['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] 
const colorArray = ["#004A98", "#0071CE", "#86bce8", "#b6d7eb", "#efe57a", "#ffc846", "#ffa300", "#ff7f00", "#fe4811", "#df231d", "#96262c" ] 
const tempArray = [1.6, 2.7, 3.8, 4.9, 6, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7, 13.9]

// create svg + title
const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr("transform", 'translate(0, 150)')

svg.append('text')
        .text(`Monthly Global Land-Surface Temperature`)
        .attr('id', 'description')
        .attr('x', 490)
        .attr('y', 80)
        .attr('font-size', '36px')
        .attr('transform', 'translate(-100, -50)')

svg.append('text')
        .text(`1753 - 2015: Base Temperature 8.66℃`)
        .attr('id', 'description')
        .attr('x', 510)
        .attr('y', 80)
        .attr('font-size', '26px')
        .attr('transform', 'translate(-10, -10)')

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
        .attr("transform", 'translate(0,  ' + (height - (padding * 2)) + ')')

// create y-axis + scale
const yScale = d3.scaleBand()
        .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
        .range([height - padding * 3, 0])
    
const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d,i) => { 
            return monthArray[d] 
        }) 

svg.append('g')
        .call(yAxis) 
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', ' + padding + ')')

// create legend
const legendScale = d3.scaleBand()
        .domain(tempArray) 
        .range([0, 400])

const legendAxis = d3.axisBottom()
        .scale(legendScale)
        
const legend = svg.append('g')
        .attr('id', 'legend')
        .call(legendAxis) 
        .attr('transform', 'translate(' + padding + ', 600)')

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
        .attr('width', 33) 
        .attr('height', 30)
        .style("outline", (d, i) => {
            if (i != 11) return "1px solid black"
        })  
       .attr("transform", 'translate(17,' + -131 + ')')

// create tooltip
const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')

// add data points to chart
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
        .attr('height', (height - padding * 3) / 12)
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
        .on('mouseover', (event, d) => { 
          tooltip
            .html(` ${monthArray[d.month]} ${d.year} <br> Temp: ${round(data.baseTemperature + d.variance) + "°C"} <br> Variance: ${round(d.variance) + "°C"}`)
            .style('opacity', .9)
            .style('position', 'absolute')
            .style('left', (event.pageX + 25) + 'px')
            .style('top', (event.pageY - 55) + 'px')
            .style('background-color', '#75c6e3')
            .attr('data-year', d.year)
       })
        .on('mouseout', () => {
          tooltip
            .style("opacity", 0)
          })
     })
}
map()
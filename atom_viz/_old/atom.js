let inputData = {};
let catData = {};
let atomData = [];

let output = {};

let maxWidth = screen.availWidth;
let maxHeight = screen.availHeight;

let circWidth = 1000;
let circHeight = 1000;

let width = circWidth/2;
let height = circHeight/2;

let divstyle = {};


reducerSum = (previousValue, currentValue) => previousValue + currentValue;

window.onload = genAtom();

function genAtom(){
    Promise.all([d3.json("test_data.json")]).then(function (data) {
        inputData = data[0]["data"];
        catData = data[0]["categories"];

        console.log(inputData);
        console.log(catData);

        for (var i=0; i<inputData.length; i++) {
            for (var j=0; j<catData.length; j++){
                catData[j].val += inputData[i].score[j];
            }
        };

        let scoreTot = 0;
        for (var i=0; i<catData.length; i++) {
            scoreTot += catData[i].val;
        };

        for (var i=0; i<catData.length; i++) {
            catData[i].ratio = catData[i].val/scoreTot;
        };


        for (var i=0; i<inputData.length; i++) {
            let maxVal = Math.max.apply(Math, inputData[i].score);
            let maxIndex = inputData[i].score.indexOf(maxVal);
            
            let centPos = [catData[maxIndex].position.x*width/4+width/2, catData[maxIndex].position.y*height/4+height/2];
            
            let rand = Math.random();
            

            let arrTot = inputData[i].score.reduce(reducerSum);

            

            atomData.push({
                "id": inputData[i].id,
                "category": catData[maxIndex].name,
                "score": maxVal/arrTot,
                "value": maxVal,
                "color": catData[maxIndex].color,
            });
                
        };

        let nucl = genBubble(atomData);

        let bubble = d3.select('#bubbles')
                    .attr('width', circWidth)
                    .attr('height', circHeight);

        // Draw big surrounding circle
        bubble.append('circle')
                .attr('cx', circWidth/2)
                .attr('cy', circHeight/2)
                .attr('r', (circHeight/2)-2)
                .style("stroke-width", 2)
                .attr('stroke', '#dadada')
                .attr('fill', 'black');
    
        // Percentage
        datTxt = bubble.selectAll('text.title')
                .data(catData).enter()
                .append('text')
                    .text(d => `${(d.ratio*100).toFixed(1)}%`)
                    .attr('transform', function(d) {return `translate(${d.position.x},${d.position.y}) rotate(${d.position.angle})`})
                    .style('fill', d => d.color)
                    .style("font-family", "arial")
                    .style("font-size", "50px")
                    .style("text-anchor", "middle")
    
        // Percentage subtext
        datTxt = bubble.selectAll('text.value')
                .data(catData).enter()
                .append('text')
                    .attr('x', 0)
                    .attr('y', 20)
                    .text(d => d.text)
                    .call(wrap, 250)
                    .attr('transform', function(d) {return `translate(${d.position.x},${d.position.y}) rotate(${d.position.angle})`})
                    .style('fill', d => d.color)
                    .style("font-family", "arial")
                    .style("font-size", "12px")
                    .style("text-anchor", "middle")

        // Generate bubbles
        let node = bubble.selectAll()
                    .data(nucl.children)
                    .attr('width', width)
                    .attr('height', height)
                    .enter().append('g')
                    .attr('transform', function(d) {return `translate(${d.x+width/2}, ${d.y+width/2})`});

        let circle = node.append('circle')
                        .style('fill', d => d.data.color);

        circle.transition()
            .ease(d3.easeExpInOut)
            .duration(1000)
            .attr('r', d => d.r);


    });

};

function genBubble(data) {
    return d3.pack(data, function(d) {return d})
                    .size([width, height])
                    .padding(2)(d3.hierarchy({ children: data}).sum(function(d) {return d.score}))
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
};
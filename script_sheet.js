let wikiData = {};
let allData = {};

function getData(){
    txtIn = document.getElementById("input_txt").value;     // Get text from textbox
        
    Promise.all([d3.json("demo.json")     // Import all data
    ]).then(function (data) {
        allData = data;                        // Get data
        wikiData = allData["0"]["wikiData"];
        txtArray = txtIn.split(" ");
        lenTxtArray = txtArray.length;

        txtDataKeys = Object.keys(wikiData);                // Extract all words with wikilink
        lenTxtData = txtDataKeys.length;                    // Amount of keywords with wikilink

        // Highlight keywords in text
        for(i = 0; i < lenTxtData; i++){
            for(j = 0; j < lenTxtArray; j++){
                wordTxtIn = txtArray[j].toLowerCase().replace(/[.,\s]/g, "");
                if(txtDataKeys[i] === wordTxtIn){
                    txtArray[j] = `<span><mark class="highlight">${txtArray[j]}</mark></span>`;
                };
            };
        };

        document.getElementById("txtCol").innerHTML = txtArray.join(" ");
        
        // Display image and summary when user clicks the highlighted word
        $( "#txtCol span" ).on("click", function(){
            $("#imgBox").attr("src", wikiData[$(this)[0].innerText].Image);                         // Wiki image
            document.getElementById("rowTxt").innerHTML = wikiData[$(this)[0].innerText].Summary;   // Wiki summary
        });

        // Generate network plot
        var svg = d3.select("svg")
        svg.empty()
        width = +svg.attr("width"),
        height = +svg.attr("height");

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        
        var graph = {
            "nodes": allData["0"].wikiId,
            "links": allData["0"].wikiLink
        }

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", 2)
            // .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")

        var circles = node.append("circle")
            .attr("r", 5);
            // .attr("fill", function(d) { return color(d.group); });

        // Create a drag handler and append it to the node object instead
        var drag_handler = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        drag_handler(node);
        
        var lables = node.append("text")
            .text(function(d) {
                return d.label;
            })
            .attr('x', 6)
            .attr('y', 3);

        node.append("title")
            .text(function(d) { return d.id; });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
                })
        }

        function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        }

        function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        }

        function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        }

    });
    
};

define(["d3"], function(d3){

  // TODO: 
  //  Figure out why the animation is not happening.
  //  Provide alternative methods for setting the size of the donut
  //    Derive the height/width/innerRadius based on a radius value.
  //    Derive the radius values based on the provide height and width values.
  //  Need to set color scale based on colors provided by properties
  //    Either extend this or create a new object to include a lookup method
  //    based on provided lookup values: lovibond for grains, hop name for hops.
  //  Derive 'dy' and label 'transform' values based on provided/derived
  //    height/width values so labels will appear within svg area.
  
  var d3Donut = function(props, targetNode){
    try{
      if(!targetNode
        || !targetNode.tagName
        || !targetNode.nodeName){
        throw "Please provide a valid target dom element.";
      }
      // Default propeties.
      this.arc = null;
      this.donut = null;
      this.lines = null;
      this.valueLabels = null;
      this.nameLabels = null;
      this.items = [];
      this.width = 450;
      this.height = 300;
      this.radius = 100;
      this.innerRadius = 60;
      this.textOffset = 14;
      this.tweenDuration = 500;

      // Defaulting to one so there will always at least be a single arc drawn
      this.itemCount = props && props.items ? props.items.length : 1;
      if(!targetNode){
        throw("No target node provided!");
      }
      else{
        if(typeof targetNode == "string"){
          var node = document.getElementById(targetNode);
          if(!node){
            node = document.getElementByClassName(targetNode)[0];
          }
          targetNode = node;
        }

        while (targetNode.firstChild) {
            targetNode.removeChild(targetNode.firstChild);
        }
      }
      this.targetNode = targetNode;

      this.setProperties = function(props){
        for(var prop in props){
          this[prop] = props[prop];
        }
      };

      // Interpolate the arcs in data space.
      this.pieTween = function(d, i) {
        var s0;
        var e0;
        if(this.items[i]){
          s0 = this.items[i].startAngle;
          e0 = this.items[i].endAngle;
        }
        else if (!(this.items[i]) && this.items[i - 1]) {
          s0 = this.items[i - 1].endAngle;
          e0 = this.items[i - 1].endAngle;
        }
        else if(!(this.items[i - 1]) && this.items.length > 0){
          s0 = this.items[this.items.length - 1].endAngle;
          e0 = this.items[this.items.length - 1].endAngle;
        }
        else {
          s0 = 0;
          e0 = 0;
        }

        var inter = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});

        return function(t) {
          var b = inter(t);
          return this.arc(b);
        }.bind(this);
      };
      this.textTween = function(d, i) {
        var a;
        if(this.items[i]){
          a = (this.items[i].startAngle + this.items[i].endAngle - Math.PI) / 2;
        }
        else if (!(this.items[i]) && this.items[i - 1]) {
          a = (this.items[i - 1].startAngle + this.items[i - 1].endAngle - Math.PI) / 2;
        }
        else if(!(this.items[i - 1]) && this.items.length > 0) {
          a = (this.items[this.items.length - 1].startAngle + this.items[this.items.length - 1].endAngle - Math.PI) / 2;
        }
        else {
          a = 0;
        }
        var b = (d.startAngle + d.endAngle - Math.PI) / 2;

        var fn = d3.interpolateNumber(a, b);
        return function(t) {
          var val = fn(t);
          return "translate(" + Math.cos(val) * (this.radius + this.textOffset) + "," + Math.sin(val) * (this.radius + this.textOffset) + ")";
        }.bind(this);
      };

      this.createDonut = function(){
        //D3 helper function to populate pie slice parameters from array data
        this.donut = d3.layout.pie().value(function(d){
          return d.value;
        });

        //D3 helper function to create colors from an ordinal scale of 20 categorical colors
        this.color = d3.scale.category20c();

        this.getColor = function(d, i) {
          return this.color(i); 
        };

        //D3 helper function to draw arcs, populates parameter "d" in path object
        this.arc = d3.svg.arc()
          .startAngle(function(d){
            return d.startAngle;
          })
          .endAngle(function(d){
            return d.endAngle;
          })
          .innerRadius(this.innerRadius)
          .outerRadius(this.radius);

        this.vis = d3.select(this.targetNode).append("svg:svg")
          .attr("width", this.width)
          .attr("height", this.height);

        //GROUP FOR ARCS/PATHS
        this.arc_group = this.vis.append("svg:g")
          .attr("class", "arc")
          .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

        //GROUP FOR LABELS
        this.label_group = this.vis.append("svg:g")
          .attr("class", "label_group")
          .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

        //GROUP FOR CENTER TEXT  
        this.center_group = this.vis.append("svg:g")
          .attr("class", "center_group")
          .attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")");

        //PLACEHOLDER GRAY CIRCLE
        this.paths = this.arc_group.append("svg:circle")
            .attr("fill", this.innerCircleColor || "#EFEFEF")
            .attr("r", this.radius);

        //WHITE CIRCLE BEHIND LABELS
        this.whiteCircle = this.center_group.append("svg:circle")
          .attr("fill", "white")
          .attr("r", this.innerRadius);

        // "TOTAL" LABEL
        this.totalLabel = this.center_group.append("svg:text")
          .attr("class", "label")
          .attr("dy",  - 15)
          .attr("text-anchor", this.labelPlacement || "middle") // text-align: right
          .text(this.totalLabel || "Total");

        //TOTAL VALUE
        this.totalValue = this.center_group.append("svg:text")
          .attr("class", "total")
          .attr("dy", 7)
          .attr("text-anchor", this.loadingMessagePlacement || "middle") // text-align: right
          .text(this.total || "Waiting...");
          // TOOD: if no total value is provided, include waiting message
          // then call a method to derive the total from the values provided
          // in the items array.

        //UNITS LABEL
        this.totalUnits = this.center_group.append("svg:text")
          .attr("class", "units")
          .attr("dy", 21)
          .attr("text-anchor", this.unitsLabelPlacement || "middle") // text-align: right
          .text(this.unitsLabel || "");

        // Set values on items for drawing donut
        this.items = this.donut(this.items);

        //DRAW ARC PATHS
        this.paths = this.arc_group.selectAll("path").data(this.items);

        this.paths.enter().append("svg:path")
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("fill", this.getColor.bind(this))
          .transition()
            .duration(this.tweenDuration)
            .attrTween("d", this.pieTween.bind(this));

        this.paths
          .transition()
            .duration(this.tweenDuration)
            .attrTween("d", this.pieTween.bind(this));

        this.paths.exit()
          .transition()
            .duration(this.tweenDuration)
            .remove();

        //DRAW TICK MARK LINES FOR LABELS
        this.lines = this.label_group.selectAll("line").data(this.items);

        this.lines.enter().append("svg:line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", -this.radius - 3)
          .attr("y2", -this.radius - 8)
          .attr("stroke", "gray")
          .attr("transform", function(d) {
            return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
          }.bind(this));

        this.lines.transition()
          .duration(this.tweenDuration)
          .attr("transform", function(d) {
            return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
          }.bind(this));

        this.lines.exit().remove();

        //DRAW LABELS WITH PERCENTAGE VALUES
        this.valueLabels = this.label_group.selectAll("text.value").data(this.items)
          .attr("dy", function(d){
            if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 
              && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
              ) {
              return 5;
            } else {
              return -7;
            }
          })
          .attr("text-anchor", function(d){
            if ( (d.startAngle + d.endAngle) / 2 < Math.PI ){
              return "beginning";
            } else {
              return "end";
            }
          })
          .text(function(d){
            var percentage = (d.value / this.total) * 100;
            return percentage.toFixed(1) + "%";
          }.bind(this));

        this.valueLabels.enter().append("svg:text")
          .attr("class", "value")
          .attr("transform", function(d) {
            return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (this.radius + this.textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) + ")";
          }.bind(this))
          .attr("dy", function(d){
            if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
              return 5;
            } else {
              return -7;
            }
          })
          .attr("text-anchor", function(d){
            if ( (d.startAngle + d.endAngle) / 2 < Math.PI ){
              return "beginning";
            } else {
              return "end";
            }
          }).text(function(d){
            var percentage = (d.value / this.total) * 100;
            return percentage.toFixed(1) + "%";
          }.bind(this));

        this.valueLabels.transition().duration(this.tweenDuration).attrTween("transform", this.textTween.bind(this));

        this.valueLabels.exit().remove();

        //DRAW LABELS WITH ENTITY NAMES
        this.nameLabels = this.label_group.selectAll("text.units").data(this.items)
          .attr("dy", function(d){
            if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
              return 17;
            } else {
              return 5;
            }
          })
          .attr("text-anchor", function(d){
            if ((d.startAngle + d.endAngle) / 2 < Math.PI ) {
              return "beginning";
            } else {
              return "end";
            }
          }).text(function(d){
            return d.name;
          });

        this.nameLabels.enter().append("svg:text")
          .attr("class", "units")
          .attr("transform", function(d) {
            return "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (this.radius + this.textOffset) + "," + Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) * (this.radius + this.textOffset) + ")";
          }.bind(this))
          .attr("dy", function(d){
            if ((d.startAngle + d.endAngle) / 2 > Math.PI / 2 && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5 ) {
              return 17;
            } else {
              return 5;
            }
          })
          .attr("text-anchor", function(d){
            if ((d.startAngle + d.endAngle) / 2 < Math.PI ) {
              return "beginning";
            } else {
              return "end";
            }
          }).text(function(d){
            return d.name;
          });

        this.nameLabels.transition().duration(this.tweenDuration).attrTween("transform", this.textTween.bind(this));

        this.nameLabels.exit().remove();
      };
      // End this.createDonut() method

      // If properties are provided, set them to override the defaults
      if(props){
        // TODO:
        //    If no total value is provided, derive one from the items array
        this.setProperties(props);
      }

      this.createDonut();
    }
    catch(e){
      return {Error: e};
    }
  }
  return d3Donut;
});
define(["d3"], function(d3){

  var d3Donut = function(props){
    this.setProperties = function(props){
      for(var prop in props){
        this[prop] = props[prop];
      }
    };
    if(d3) this["d3IsLoaded"] = true;
    if(props) this.setProperties(props);
  }
  return d3Donut;
});
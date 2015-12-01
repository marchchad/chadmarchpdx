define([], function(){

  var donutProps = function(props){
    try{

      this.height = 130;
      this.colorKey = "color";
      this.domains = [];
      this.ranges = [];
      this.radius = 33;
      this.innerRadius = (this.radius * 0.6); // Should be 60% of radius for best display results
      this.items = [];
      this.targetProp = null;

      if(props){
        for(var prop in props){
          this[prop] = props[prop];
        }
      }
    }
    catch(e){
      return {Error: e};
    }
  }
  return donutProps;
});
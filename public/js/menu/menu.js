define(['d3Donut', 'domReady'], function (d3Donut, domReady) {

  domReady(function() {

    var donutProps = function(){
      return {
        radius: 33,
        innerRadius: 19.8, // Should be 60% of radius for best display results
        items: []
      }
    };

    // TODO move height/width calculation to within the module.

    var donuts = [];

    var donut1 = new donutProps();    
    donut1.items = [
        {
          "name": "American Pale 2-row",
          "colorValue": 1.8,
          "colorLookup": "lovibond",
          "value": 9
        },
        {
          "name": "Canadian Honey Malt",
          "colorValue": 25,
          "colorLookup": "lovibond",
          "value": 1.5
        }
      ];
    donut1.total = 10.5;
    donut1.totalLabel = "lbs.";
    donuts.push({props: donut1, target: document.getElementsByClassName('grains')[0]});

    var donut2 = new donutProps();
    donut2.items = [
        {
          "name": "American Pale 2-row",
          "colorValue": 1.8,
          "colorLookup": "lovibond",
          "value": 9
        },
        {
          "name": "American Munich 10L",
          "colorValue": 10,
          "colorLookup": "lovibond",
          "value": 2
        },
        {
          "name": "Canadian Honey Malt",
          "colorValue": 25,
          "colorLookup": "lovibond",
          "value": 1.5
        }
      ];
    donut2.total = 12.5;
    donut2.totalLabel = "lbs.";
    donuts.push({props: donut2, target: document.getElementsByClassName('grains')[1]});

    setTimeout(function(){
      for(var i = 0, len = donuts.length; i < len; i ++){
        new d3Donut(donuts[i].props, donuts[i].target);
      }
    }, 300);

    /*
    // pass in url to server that will be emitting data.
    var kegServer = io.connect("http://localhost:3001");
    kegServer.on('pour', function(data){
      var node = document.createElement('H3');
      node.innerHTML = data.message
      node.className = 'right';
      
      var targetKeg = "keg-" + data.keg;

      var parent = document.getElementById(targetKeg);
      parent.insertBefore(node, parent.firstChild);
    
      kegServer.emit('getPourData');
      kegServer.on('pourData', function(data){
        var target = document.querySelector("#" + targetKeg + " .pourData");
        var vol = document.createElement('p');
        vol.innerHTML = 'Volume: ' + data.data.volume + ' oz.';
        target.appendChild(vol);

        var dur = document.createElement('p');
        dur.innerHTML = 'Duration: ' + data.data.duration + " secs.";
        target.appendChild(dur);

        node.innerHTML = "Last Pour";

        setTimeout(function(){
          target.removeChild(vol);
          target.removeChild(dur);
          parent.removeChild(node);
        }, 5000);
      });
    });*/
  });
});
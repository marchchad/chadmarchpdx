define(['d3Donut', 'domReady'], function (d3Donut, domReady) {

  domReady(function() {

    if(window.d3data){

      var grainRanges = ["#FFE699","#FFE699","#FFD878","#FFD878","#FFBF42","#FBB123","#F8A600","#F39C00","#EA8F00","#E58500","#DE7C00","#D77200","#CF6900","#CB6200","#C35900","#BB5100","#B54C00","#B04500","#A63E00","#A13700","#9B3200","#952D00","#8E2900","#882300","#821E00","#7B1A00","#771900","#701400","#6A0E00","#660D00","#5E0B00","#5A0A02","#600903","#520907","#4C0505","#470606","#440607","#3F0708","#3B0607","#3A070B","#36080A"];
      var grainDomains = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];

      var hopRanges = ['#c7e9c0','#a1d99b','#74c476','#31a354','#109618'];
      var hopDomains = [1,2,3,4,5];

      var donutProps = function(targetProp){
        return {
          colorKey: "color",
          radius: 33,
          innerRadius: 19.8, // Should be 60% of radius for best display results
          items: [],
          targetProp: targetProp
        }
      };

      var donuts = [];

      for(var i = 0, len = d3data.length; i < len; i++){
        var donut1 = new donutProps("lbs");
        donut1["domains"] = grainDomains;
        donut1["ranges"] = grainRanges;
        donut1.items = d3data[i].grains;

        donuts.push({
          props: donut1,
          target: d3data[i].target + "-grains"
        });

        var donut2 = new donutProps("oz");
        donut2["domains"] = hopDomains;
        donut2["ranges"] = hopRanges;
        donut2.items = d3data[i].hops;

        donuts.push({
          props: donut2,
          target: d3data[i].target + "-hops"
        });
      }

      setTimeout(function(){
        for(var i = 0, len = donuts.length; i < len; i ++){
          new d3Donut(donuts[i].props, donuts[i].target);
        }
      }, 300);
    }
    else{
      // TODO: handle no data situation
    }

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
    });
    */
  });
});
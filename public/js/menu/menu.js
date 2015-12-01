define(['d3Donut', 'donutProps', 'domReady'], function (d3Donut, donutProps, domReady) {

  domReady(function() {

    if(window.d3data){

      var grainRanges = ["#FFE699","#FFE699","#FFD878","#FFD878","#FFBF42","#FBB123","#F8A600","#F39C00","#EA8F00","#E58500","#DE7C00","#D77200","#CF6900","#CB6200","#C35900","#BB5100","#B54C00","#B04500","#A63E00","#A13700","#9B3200","#952D00","#8E2900","#882300","#821E00","#7B1A00","#771900","#701400","#6A0E00","#660D00","#5E0B00","#5A0A02","#600903","#520907","#4C0505","#470606","#440607","#3F0708","#3B0607","#3A070B","#36080A"];
      var grainDomains = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];

      var hopRanges = ['#c7e9c0','#a1d99b','#74c476','#31a354','#109618'];
      var hopDomains = [1,2,3,4,5];

      var donuts = [];

      for(var i = 0, len = d3data.length; i < len; i++){

        donuts.push({
          props: new donutProps({
            targetProp: "lbs",
            domains: grainDomains,
            ranges: grainRanges,
            items: d3data[i].grains
          }),
          target: d3data[i].target + "-grains"
        });

        donuts.push({
          props: new donutProps({
            targetProp: "oz",
            domains: hopDomains,
            ranges: hopRanges,
            items: d3data[i].hops
          }),
          target: d3data[i].target + "-hops"
        });
      }

      setTimeout(function(){
        for(var i = 0, len = donuts.length; i < len; i ++){
          var donut = new d3Donut(donuts[i].props, donuts[i].target);
          if(donut.Error){
            console.log(donut.Error);
          }
        }
      }, 300);
    }
    else{
      // TODO: handle no data situation
    }

    // pass in url to server that will be emitting data.
    var kegServer = io.connect("127.0.0.1");

    kegServer.on('pour', function(data){
      var node = document.createElement('H3');
      node.innerHTML = data.message
      node.className = 'right';
      
      var targetKeg = "keg" + data.keg;

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
  });
});
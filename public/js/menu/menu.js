define(['d3Donut', 'donutProps', 'domReady'], function (d3Donut, donutProps, domReady) {

  this.clearPourData = function(){
    return setTimeout(function(){
      if(this.targetPourData){
        while(this.targetPourData.hasChildNodes()){
          this.targetPourData.removeChild(this.targetPourData.lastChild);
        }
      }
    }, 5000);
  };

  this.resetClearData = function(){
    this.clearTimeout(this.clearPourData);
  };

  this.buildDonuts = function(d3data){  
    if(d3data){

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
  };

  this.connectSockets = function(){
    // pass in url to server that will be emitting data.
    var kegServer = io.connect(window.location.host);

    // listens to an event from the server called 'pour' that
    // emits a message letting us know that a pour is occurring
    kegServer.on('pour', function(data){
      var targetKegHeader = "keg" + data.keg + "-header";
      var node = document.getElementById(targetKegHeader);
      if(!node){
        node = document.createElement('H3');
        node.innerHTML = data.message
        node.className = 'right';
        node.id = targetKegHeader;

        var parent = document.getElementById(targetKegHeader);
        parent.insertBefore(node, parent.firstChild);

        setTimeout(function(){
          parent.removeChild(node);
        }, 5000);
      }
    });

    // listens to an event from the server called 'pour'
    // that emits the total pour data from a specified keg
    kegServer.on('pourData', function(data){
      // In the event that we initialized the timeout to clear the pour data
      // let's reset it so we let the pouring finish before the timer clears.
      this.resetClearData();

      var targetPourData = document.querySelector("#keg" + data.keg + " .pourData");

      if(targetPourData){
        var vol = document.getElementById(data.targetKeg + "-vol");
        if(!vol){
          vol = document.createElement('p');
          vol.setAttribute("id", data.targetKeg + "-vol");
          vol.innerHTML = data.volume;
          targetPourData.appendChild(vol);
        }
        else{
          vol.innerHTML = parseInt(vol.innerHTML) + data.volume;
        }
        
        var dur = document.getElementById(data.targetKeg + "-dur")
        if(!dur){
          dur = document.createElement('p');
          dur.setAttribute("id", data.targetKeg + "-dur");
          dur.innerHTML = data.duration;
          targetPourData.appendChild(dur);
        }
        else{
          dur.innerHTML = parseInt(dur.innerHTML) + data.duration;
        }
      }

      // It's impossible to know when the end of the pour will happen in this event
      // So in case this is the last data we receive, let's start the timer to clear the data
      this.clearPourData();
    }.bind(this));
  }.bind(this);

  domReady(function () {
    if(io){
      this.connectSockets();
    }
    this.buildDonuts(window.d3data);
  }).bind(this);
});
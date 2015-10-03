document.addEventListener("DOMContentLoaded", function() {
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
});
define(['d3Donut', 'donutProps', 'common', 'domReady'], function (d3Donut, donutProps, C, domReady) {

    this.clearPourData = function (node) {
        return setTimeout(function () {
            if (node) {
                while (node.hasChildNodes()) {
                    node.removeChild(node.lastChild);
                }
            }
        }, 5000);
    };

    this.resetClearData = function () {
        this.clearTimeout(this.clearPourData);
    };

    this.buildDonuts = function (d3data) {
        if (d3data) {

            var grainRanges = ["#FFE699", "#FFE699", "#FFD878", "#FFD878", "#FFBF42", "#FBB123", "#F8A600", "#F39C00", "#EA8F00", "#E58500", "#DE7C00", "#D77200", "#CF6900", "#CB6200", "#C35900", "#BB5100", "#B54C00", "#B04500", "#A63E00", "#A13700", "#9B3200", "#952D00", "#8E2900", "#882300", "#821E00", "#7B1A00", "#771900", "#701400", "#6A0E00", "#660D00", "#5E0B00", "#5A0A02", "#600903", "#520907", "#4C0505", "#470606", "#440607", "#3F0708", "#3B0607", "#3A070B", "#36080A"];
            var grainDomains = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

            var hopRanges = ['#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#109618'];
            var hopDomains = [1, 2, 3, 4, 5];

            var donuts = [];

            for (var i = 0, len = d3data.length; i < len; i++) {
                var _data = d3data[i];
                donuts.push({
                    props: new donutProps({
                        targetProp: "lbs",
                        domains: grainDomains,
                        ranges: grainRanges,
                        items: _data.grains
                    }),
                    target: _data.target + "-grains"
                });

                donuts.push({
                    props: new donutProps({
                        targetProp: "oz",
                        domains: hopDomains,
                        ranges: hopRanges,
                        items: _data.hops
                    }),
                    target: _data.target + "-hops"
                });
            }

            setTimeout(function () {
                for (var i = 0, len = donuts.length; i < len; i++) {
                    var _d = donuts[i];
                    var donut = new d3Donut(_d.props, _d.target);
                    if (donut.Error) {
                        console.log(donut.Error);
                    }
                }
            }, 300);
        }
        else {
            // TODO: handle no data situation
        }
    };

    this.connectSockets = function () {
        // pass in url to server that will be emitting data.
        var kegServer = io.connect(window.location.host);
        var parent = null, nowPourNode = null;

        kegServer.on('success', function (data) {
            if (data.success) {
                // listens to an event from the server called 'pour' that
                // emits a message letting us know that a pour is occurring
                kegServer.on('pour', function (data) {
                    var kegid = parseInt(data.kegid) || 1;
                    // default it to keg 1 for now.
                    var targetKegHeader = "keg" + kegid + "-header";
                    nowPourNode = document.getElementById(targetKegHeader);

                    var targetPourData = document.querySelector("#keg" + kegid + " .pourData");
                    if (!nowPourNode) {
                        nowPourNode = document.createElement('H3');
                        nowPourNode.innerHTML = data.message;
                        nowPourNode.className = 'right';
                        nowPourNode.id = targetKegHeader;

                        targetPourData.insertBefore(nowPourNode, targetPourData.firstChild);
                    }
                });

                // listens to an event from the server called 'pour'
                // that emits the total pour data from a specified keg
                kegServer.on('pourData', function (data) {
                    // default it to keg 1 for now.
                    var kegid = parseInt(data.kegid) || 1;
                    // In the event that we initialized the timeout to clear the pour data
                    // let's reset it so we let the pouring finish before the timer clears.
                    this.resetClearData();

                    targetPourData = document.querySelector("#keg" + kegid + " .pourData");

                    if (targetPourData) {
                        var vol = document.getElementById(kegid + "-vol");
                        if (!vol) {
                            vol = document.createElement('p');
                            vol.setAttribute("id", kegid + "-vol");
                            vol.innerHTML = parseFloat(data.volume).toFixed(2) + " oz.";
                            targetPourData.appendChild(vol);
                        }
                        else {
                            vol.innerHTML = parseFloat(data.volume).toFixed(2) + " oz.";
                        }

                        var dur = document.getElementById(kegid + "-dur");
                        if (!dur) {
                            dur = document.createElement('p');
                            dur.setAttribute("id", kegid + "-dur");
                            dur.innerHTML = parseFloat(data.duration).toFixed(1) + " secs.";
                            targetPourData.appendChild(dur);
                        }
                        else {
                            dur.innerHTML = parseFloat(data.duration).toFixed(1) + " secs.";
                        }
                    }

                    // It's impossible to know when the end of the pour will happen in this event
                    // So in case this is the last data we receive, let's start the timer to clear the data
                    this.clearPourData(targetPourData);
                }.bind(this));
            }
        }.bind(this));
    }.bind(this);

    domReady(function () {
        if (io) {
            this.connectSockets();
        }
        this.buildDonuts(window.d3data);
    }).bind(this);
});
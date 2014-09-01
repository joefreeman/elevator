App.Utils.randFloat = function(start, end) {
  return Math.random() * (end - start) + start;
}

App.Utils.randInt = function(start, end) {
  return Math.floor(App.Utils.randFloat(start, end));
}

App.Utils.randItem = function(list) {
  return list[App.Utils.randInt(0, list.length)];
}

App.Utils.clamp = function(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

App.Utils.runEventLoop = function(fn, interval) {
  var running = true;
  var lastUpdateTime = Date.now();
  var control = {
    stop: function() {
      running = false;
    },
    start: function() {
      lastUpdateTime = Date.now();
      running = true;
    }
  };
  setInterval(function() {
    if (running) {
      var startTime = Date.now();
      fn(startTime - lastUpdateTime);
      lastUpdateTime = startTime;
    }
  }, interval);
  return control;
}

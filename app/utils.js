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

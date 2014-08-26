App.Model.Observable = function() {
  this.listeners = {};
}

App.Model.Observable.prototype.bind = function(ev, callback) {
  if (!this.listeners[ev]) {
    this.listeners[ev] = [];
  }
  this.listeners[ev].push(callback);
}

App.Model.Observable.prototype.unbind = function(ev, callback) {
  // TODO
}

App.Model.Observable.prototype.trigger = function(ev, args) {
  if (this.listeners[ev]) {
    var callbacks = this.listeners[ev];
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i].apply(args);
    }
  }
}

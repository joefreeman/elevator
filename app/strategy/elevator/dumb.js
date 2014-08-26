App.Strategy.Elevator.Dumb = function(elevator) {
  this.elevator = elevator;
}

App.Strategy.Elevator.Dumb.prototype.ready = function() {
  var currentFloor = this.elevator.floor;
  this.elevator.queue = this.elevator.queue.filter(function(item) { return item.floor != currentFloor });
  if (this.elevator.queue.length) {
    this.elevator.target = this.elevator.queue[0].floor;
  }
}

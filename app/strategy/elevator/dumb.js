App.Strategy.Elevator.Dumb = function() {
}

App.Strategy.Elevator.Dumb.prototype.ready = function(elevator) {
  var currentFloor = elevator.floor;
  elevator.queue = elevator.queue.filter(function(item) { return item.floor != currentFloor });
  if (elevator.queue.length) {
    elevator.target = elevator.queue[0].floor;
  }
}

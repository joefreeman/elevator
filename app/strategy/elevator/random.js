App.Strategy.Elevator.Random = function(elevator) {
  this.elevator = elevator;
}

App.Strategy.Elevator.Random.prototype.ready = function() {
  this.elevator.target = Math.floor(Math.random() * this.elevator.building.numFloors);
}

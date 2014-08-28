App.Strategy.Elevator.Random = function(elevator) {
  this.elevator = elevator;
}

App.Strategy.Elevator.Random.prototype.ready = function() {
  this.elevator.target = App.Utils.randInt(0, this.elevator.building.numFloors);
}

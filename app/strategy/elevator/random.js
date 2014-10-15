App.Strategy.Elevator.Random = function() {
}

App.Strategy.Elevator.Random.prototype.ready = function(elevator) {
  elevator.target = App.Utils.randInt(0, elevator.building.numFloors);
}

App.Model.World = function(config) {
  this.buildings = config.buildings;
  this.people = config.people;
}

App.Model.World.prototype.tick = function(elapsedTime) {
  for (var i = 0; i < this.buildings.length; i++) {
    this.buildings[i].elevator.tick(elapsedTime);
  }
  for (var i = 0; i < this.people.length; i++) {
    this.people[i].tick(this, elapsedTime);
  }
}

App.Model.World.prototype.getWidth = function() {
  var lastBuilding = this.buildings[this.buildings.length - 1];
  return lastBuilding.getLeft(this.buildings) + lastBuilding.width;
}

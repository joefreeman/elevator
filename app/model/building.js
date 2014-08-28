App.Model.Building = function(config) {
  this.width = config.width || 100;
  this.entranceOffset = config.entranceOffset || this.width - 20;
  this.numFloors = config.numFloors;
  this.floorHeight = config.floorHeight || 40;
  this.elevator = new App.Model.Elevator({
    floor: Math.floor(Math.random() * config.numFloors),
    capacity: 5,
    building: this,
    speed: Math.random() * 0.0005 + 0.0015
  });
}

App.Model.Building.prototype.getLeft = function(buildings) {
  var buildingLeft = 0;
  for (var i = 0; buildings[i] != this && i < buildings.length; i++) {
    buildingLeft += buildings[i].width + BUILDING_SEPARATION;
  }
  return buildingLeft;
}

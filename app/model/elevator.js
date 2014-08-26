var DOOR_WAIT = 0.5;
var DOOR_SPEED = 0.002;

App.Model.Elevator = function(config) {
  this.building = config.building;
  this.floor = config.floor || 0;
  this.target = config.floor || 0;
  this.capacity = config.capacity || 5;
  this.speed = config.speed || 0.001;
  this.strategy = null;
  this.doors = {position: -1, opening: false};
  this.passengers = [];
  this.queue = [];
  this.observable = new App.Model.Observable();
}

// 0-1; 0 = closed, 1 = open
App.Model.Elevator.prototype.getDoorPosition = function() {
  return Math.min(this.doors.position + 1, 1);
}

App.Model.Elevator.prototype.areDoorsClosed = function() {
  return this.doors.position == -1;
}

App.Model.Elevator.prototype.areDoorsOpen = function() {
  return this.doors.position > 0;
}

var moveElevator = function(elevator, amount) {
  elevator.floor = Math.max(Math.min(elevator.floor + amount, elevator.building.numFloors - 1), 0);
  elevator.observable.trigger('moved');
  for (var i = 0; i < elevator.passengers.length; i++) {
    elevator.passengers[i].observable.trigger('moved');
  }
}

var updateDoors = function(elevator, amount) {
  elevator.doors.position = Math.min(Math.max(elevator.doors.position + amount, -1), DOOR_WAIT);
  elevator.observable.trigger('moved'); // TODO: different event?
}

App.Model.Elevator.prototype.tick = function(elapsedTime) {
  if (this.target == this.floor) {
    if (this.doors.position >= DOOR_WAIT && this.queue.length > 0) {
      this.doors.opening = false;
    }
    if (!this.doors.opening && this.areDoorsClosed()) {
      this.doors.opening = true;
      // TODO: remove floor from queue (if direction matches?)
      // this.queue = this.queue.filter(function(item) { return  })
      if (this.strategy && this.strategy.ready) {
        this.strategy.ready();
      }
    } else {
      if (this.doors.opening) {
        updateDoors(this, DOOR_SPEED * elapsedTime);
      } else {
        updateDoors(this, -DOOR_SPEED * elapsedTime);
      }
    }
  }
  if (this.areDoorsClosed()) {
    if (this.target > this.floor) {
      moveElevator(this, Math.min(this.speed * elapsedTime, this.target - this.floor));
    } else if (this.target < this.floor) {
      moveElevator(this, Math.max(-this.speed * elapsedTime, this.target - this.floor));
    }
  }
}

App.Model.Elevator.prototype.setTarget = function(floor) {
  if (floor < 0 || floor > this.building.numFloors - 1) {
    throw 'Target floor out of range.';
  }
  if (Math.floor(floor) !== floor) {
    throw 'Target floor must be an integer.';
  }
  this.target = floor;
}

App.Model.Elevator.prototype.addPassenger = function(person) {
  this.passengers.push(person);
}

App.Model.Elevator.prototype.removePassenger = function(person) {
  this.passengers = this.passengers.filter(function(p) { return p != person; });
}

App.Model.Elevator.prototype.callElevator = function(floor, direction) {
  // TODO: validate floor/direction?
  // TODO: consider direction?
  if (floor === null) throw 'callElevator: floor is null';
  this.queue.push({floor: floor});
  console.log('Elevator called:', floor, direction);
}

App.Model.Elevator.prototype.requestFloor = function(floor) {
  if (floor === null) throw 'requestFloor: floor is null';
  this.queue.push({floor: floor});
}

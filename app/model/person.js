var BUILDING_ENTRANCE_OFFSET = 50;
var BUILDING_ELEVATOR_OFFSET = 20;
var ELEVATOR_DOOR_OFFSET = 5;

App.Model.Person = function(config) {
  this.speed = config.speed || 0.05;
  this.position = {
    offset: config.position && config.position.offset || null,
    building: config.position && config.position.building || null,
    floor: config.position && config.position.floor,
    elevator: null
  };
  this.target = {
    offset: config.target && config.target.offset || null,
    building: config.target && config.target.building || null,
    floor: config.target && config.target.floor
  };
  this.callback = config.callback;
  this.observable = new App.Model.Observable();
}

var movePersonTowards = function(person, offset, elapsedTime) {
  var delta = offset - person.position.offset;
  if (delta > 0) {
    person.position.offset += Math.min(person.speed * elapsedTime, delta);
    person.observable.trigger('moved');
  } else if (delta < 0) {
    person.position.offset -= Math.min(person.speed * elapsedTime, -delta);
    person.observable.trigger('moved');
  }
  return person.position.offset == offset;
}

App.Model.Person.prototype.tick = function(world, elapsedTime) {
  if (this.position.building == this.target.building) {
    if (this.position.floor == this.target.floor) {
      if (this.position.offset == this.target.offset) {
        if (this.callback) {
          this.callback(this);
        }
      } else {
        if (movePersonTowards(this, this.target.offset, elapsedTime)) {
          console.log('Got to building/floor/offset.', this);
        }
      }
    } else {
      if (this.position.elevator) {
        var elevator = this.position.elevator;
        if (elevator.floor == this.target.floor && elevator.areDoorsOpen()) {
          this.position.floor = elevator.floor;
          elevator.removePassenger(this);
          this.position.elevator = null;
          this.position.offset = BUILDING_ELEVATOR_OFFSET;
          console.log('Got out of the elevator.', this);
        }
      } else {
        if (this.position.offset == BUILDING_ELEVATOR_OFFSET) {
          var elevator = this.position.building.elevator;
          if (elevator.floor == this.position.floor && elevator.areDoorsOpen()) {
            this.position.floor = null;
            elevator.addPassenger(this);
            this.position.elevator = elevator;
            this.position.offset = ELEVATOR_DOOR_OFFSET;
            elevator.requestFloor(this.target.floor);
            console.log('Got in the elevator.', this, this.position.elevator);
          }
        } else {
          if (movePersonTowards(this, BUILDING_ELEVATOR_OFFSET, elapsedTime)) {
            this.position.building.elevator.callElevator(this.position.floor, this.target.floor > this.position.floor ? 'up' : 'down');
            console.log('Waiting for elevator.');
          }
        }
      }
    }
  } else {
    if (this.position.building != null) {
      if (this.position.elevator) {
        var elevator = this.position.elevator;
        if (elevator.floor == 0 && elevator.areDoorsOpen()) {
          this.position.floor = 0;
          elevator.removePassenger(this);
          this.position.elevator = null;
          this.position.offset = BUILDING_ELEVATOR_OFFSET;
          console.log('Got out of the down elevator.', this);
        }
      } else if (this.position.floor == 0) {
        if (movePersonTowards(this, BUILDING_ENTRANCE_OFFSET, elapsedTime)) {
          this.position.offset = this.position.building.getLeft(world.buildings) + BUILDING_ENTRANCE_OFFSET;
          this.position.building = null;
          this.position.floor = null;
          console.log('Got to the building exit.');
        }
      } else {
        if (this.position.offset != BUILDING_ELEVATOR_OFFSET) {
          if (movePersonTowards(this, BUILDING_ELEVATOR_OFFSET, elapsedTime)) {
            this.position.building.elevator.callElevator(this.position.floor, 'down');
            console.log('Waiting for down elevator.');
          }
        } else {
          var elevator = this.position.building.elevator;
          if (elevator.floor == this.position.floor && elevator.areDoorsOpen()) {
            this.position.floor = null;
            elevator.addPassenger(this);
            this.position.elevator = elevator;
            this.position.offset = ELEVATOR_DOOR_OFFSET;
            elevator.requestFloor(0);
            console.log('Got in the down elevator.', this, this.position.elevator);
          }
        }
      }
    } else {
      // TODO: better way to share these constants?
      var buildingOffset = this.target.building.getLeft(world.buildings) + BUILDING_ENTRANCE_OFFSET;
      if (movePersonTowards(this, buildingOffset, elapsedTime)) {
        this.position.building = this.target.building;
        this.position.floor = 0;
        this.position.offset = BUILDING_ENTRANCE_OFFSET;
        console.log('Got to building entrance.');
      }
    }
  }
}

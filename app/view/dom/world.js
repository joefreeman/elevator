var SHAFT_WIDTH = 20;
var ELEVATOR_OFFSET = 10;
var WORLD_PADDING = 50;
var ENTRANCE_WIDTH = 16;
var ENTRANCE_HEIGHT = 30;

App.View.Dom.World = function(model, container) {
  this.model = model;
  this.container = container;
}

var updateElevatorPosition = function(elevatorEl, leftDoorEl, rightDoorEl, elevator) {
  var floorHeight = elevator.building.floorHeight;
  elevatorEl.css('top', elevator.building.numFloors * floorHeight - Math.floor(elevator.floor * floorHeight) - floorHeight);
  var doorWidth = (SHAFT_WIDTH / 2) * (1 - elevator.getDoorPosition());
  leftDoorEl.css({left: 0, width: doorWidth});
  rightDoorEl.css({right: 0, width: doorWidth});
}

var hidePopup = function(containerEl) {
  $('.popup', containerEl).remove();
  $('.selected', containerEl).removeClass('selected');
}

var getDoorPositionText = function(elevator) {
  var position = elevator.getDoorPosition();
  if (position == 0) {
    return 'closed';
  } else if (position == 1) {
    return 'open';
  } else if (elevator.doorsOpening) {
    return 'opening';
  } else {
    return 'closing';
  }
}

var getQueueText = function(queue) {
  if (queue.length) {
    var text = '';
    for (var i = 0; i < queue.length; i++) {
      if (i > 0) {
        text += ', ';
      }
      text += queue[i].floor;
    }
    return text;
  } else {
    return '(empty)';
  }
}

var updateBuildingPopup = function(building, contentEl) {
  contentEl.empty();
  var dlEl = $('<dl>');
  dlEl.append($('<dt>').text('Floors'), $('<dd>').text(building.numFloors));
  dlEl.append($('<dt>').text('Width'), $('<dd>').text(building.width));
  dlEl.append($('<dt>').text('Floor height'), $('<dd>').text(building.floorHeight));
  dlEl.append($('<dt>').text('Elevator floor'), $('<dd>').text(Math.floor(building.elevator.floor)));
  dlEl.append($('<dt>').text('Elevator target'), $('<dd>').text(building.elevator.target));
  dlEl.append($('<dt>').text('Elevator capacity'), $('<dd>').text(building.elevator.capacity));
  dlEl.append($('<dt>').text('Elevator speed'), $('<dd>').text(building.elevator.speed));
  dlEl.append($('<dt>').text('Elevator door position'), $('<dd>').text(getDoorPositionText(building.elevator)));
  dlEl.append($('<dt>').text('Queue'), $('<dd>').text(getQueueText(building.elevator.queue)));
  contentEl.append(dlEl);
}

var showBuildingPopup = function(building, containerEl) {
  var popupEl = $('<div>').addClass('popup');
  var closeButtonEl = $('<button>').addClass('close').html('&times;').on('click', function() {
    hidePopup(containerEl);
  });
  var contentEl = $('<div>');
  popupEl.append(closeButtonEl, contentEl);
  containerEl.append(popupEl);
  updateBuildingPopup(building, contentEl);
  // TODO: unbind somewhere?
  building.elevator.observable.bind('moved', function() {
    updateBuildingPopup(building, contentEl);
  });
}

var renderBuilding = function(building, buildings, worldEl, containerEl) {
  var buildingEl = $('<div>').addClass('building').css({
    left: building.getLeft(buildings) + WORLD_PADDING,
    width: building.width,
    height: building.numFloors * building.floorHeight + 4
  });
  var floorsEl = $('<div>').addClass('floors');
  for (var i = 0; i < building.numFloors; i++) {
    floorsEl.append($('<div>').addClass('floor').css({
      height: building.floorHeight
    }));
  }
  var shaftEl = $('<div>').addClass('shaft').css({
    left: ELEVATOR_OFFSET,
    width: SHAFT_WIDTH,
  });
  var elevatorEl = $('<div>').addClass('elevator').css({
    height: building.floorHeight,
    top: Math.floor(building.elevator.floor * building.floorHeight)
  });
  var leftDoorEl = $('<div>').addClass('door');
  var rightDoorEl = $('<div>').addClass('door');
  updateElevatorPosition(elevatorEl, leftDoorEl, rightDoorEl, building.elevator);
  building.elevator.observable.bind('moved', function() {
    updateElevatorPosition(elevatorEl, leftDoorEl, rightDoorEl, building.elevator);
  });
  elevatorEl.append(leftDoorEl, rightDoorEl);
  shaftEl.append(elevatorEl);
  var entranceEl = $('<div>').addClass('entrance').css({
    height: ENTRANCE_HEIGHT,
    left: building.entranceOffset - ENTRANCE_WIDTH / 2,
    width: ENTRANCE_WIDTH
  });
  buildingEl.on('click', function() {
    hidePopup(containerEl);
    showBuildingPopup(building, containerEl);
    buildingEl.addClass('selected');
  });
  buildingEl.append(floorsEl, shaftEl, entranceEl);
  worldEl.append(buildingEl);
}

var getWorldLeft = function(position, world) {
  var left = position.offset;
  if (position.building) {
    left += position.building.getLeft(world.buildings);
    if (position.elevator) {
      left += ELEVATOR_OFFSET + ELEVATOR_DOOR_OFFSET;
    }
  }
  return left;
}

var getWorldBottom = function(position) {
  if (position.building) {
    if (position.elevator) {
      return position.elevator.floor * position.building.floorHeight;
    } else {
      return position.floor * position.building.floorHeight;
    }
  } else {
    return 0;
  }
}

var updatePersonPosition = function(personEl, targetEl, directionEl, person, world) {
  var personLeft = getWorldLeft(person.position, world) + WORLD_PADDING;
  var personBottom = getWorldBottom(person.position);
  var targetLeft = getWorldLeft(person.target, world) + WORLD_PADDING;
  var targetBottom = getWorldBottom(person.target) + 1;
  personEl.css({
    left: personLeft,
    bottom: personBottom
  });
  targetEl.css({
    left: targetLeft,
    bottom: targetBottom
  });
  directionEl.css({
    left: Math.min(personLeft, targetLeft),
    bottom: Math.min(personBottom, targetBottom),
    width: Math.abs(personLeft - targetLeft),
    height: Math.abs(personBottom - targetBottom)
  }).removeClass('direction-ne direction-sw direction-nw direction-se').addClass('direction-' + (targetBottom > personBottom ? 'n' : 's') + (targetLeft > personLeft ? 'e' : 'w'));
}

var renderPerson = function(person, world, worldEl) {
  var personEl = $('<div>').addClass('person');
  var targetEl = $('<div>').addClass('target');
  var directionEl = $('<div>').addClass('direction');
  person.observable.bind('moved', function() {
    updatePersonPosition(personEl, targetEl, directionEl, person, world);
  });
  updatePersonPosition(personEl, targetEl, directionEl, person, world);
  worldEl.append(personEl, targetEl, directionEl);
}

App.View.Dom.World.prototype.render = function() {
  var worldEl = $('<div>').addClass('world');
  var maxHeight = 0;
  for (var i = 0; i < this.model.buildings.length; i++) {
    var building = this.model.buildings[i];
    renderBuilding(building, this.model.buildings, worldEl, this.container);
    maxHeight = Math.max(maxHeight, building.numFloors * building.floorHeight);
  }
  for (var i = 0; i < this.model.people.length; i++) {
    var person = this.model.people[i];
    renderPerson(person, this.model, worldEl);
  }
  worldEl.css({
    height: maxHeight + WORLD_PADDING,
    width: this.model.getWidth() + WORLD_PADDING * 2
  });
  this.container.empty().append(worldEl);
}

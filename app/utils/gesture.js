class Gesture {
  constructor(event = null){
    this.events = [];
    if (event) {
      this.push(event);
    }
  }

  push(event) {
    this.events.push(event);
    this.last = event;
  }

  get eventsCount() {
    return this.events.length;
  }

  get duration() {
    return this.last.timeStamp - this.first.timeStamp;
  }

  get first(){
    return this.events[0];
  }

  get pageX(){
    return this.last.touches[0].pageX;
  }

  get pageY(){
    return this.last.touches[0].pageY;
  }

  get initPageX() {
    return this.first.touches[0].pageX;
  }

  get initPageY() {
    return this.first.touches[0].pageY;
  }

  get lastEvents() {
    return this.events.slice(Math.max(this.eventsCount - 5, 0), this.eventsCount);
  }

  get deltaX() {
    return this.pageX - this.initPageX;
  }

  get deltaY() {
    return this.pageY - this.initPageY;
  }

  get speedX() {
    var lastEvents = this.lastEvents;
    var initX    = lastEvents[0].touches[0].pageX;
    var initTime = lastEvents[0].timeStamp;
    var lastX    = lastEvents[lastEvents.length - 1].touches[0].pageX;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  }

  get speedY() {
    var lastEvents = this.lastEvents;
    var initY    = lastEvents[0].touches[0].pageY;
    var initTime = lastEvents[0].timeStamp;
    var lastY    = lastEvents[lastEvents.length - 1].touches[0].pageY;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastY - initY) / (lastTime - initTime) * 1000 || 0;
  }
}

export default Gesture;

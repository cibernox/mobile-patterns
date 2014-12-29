class Gesture {
  constructor(event){
    this.events = [event];
    this.first  = event;
    this.last   = event;
    this.length = 1;
  }

  push(event) {
    this.events.push(event);
    this.last = event;
    this.length++;
  }

  get pageX(){
    return this.last.touches[0].pageX;
  }

  get initPageX() {
    return this.first.touches[0].pageX;
  }

  get lastEvents() {
    return this.events.slice(Math.max(this.length - 5, 0), this.length);
  }

  get speedX(){
    var lastEvents = this.lastEvents;
    var initX    = lastEvents[0].touches[0].pageX;
    var initTime = lastEvents[0].timeStamp;
    var lastX    = lastEvents[lastEvents.length - 1].touches[0].pageX;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  }
}

export default Gesture;

import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';

export default Ember.View.extend({
  progress: 0, // Progress varies between -1 and +1
  ignoreGesture: false,
  trackGesture: false,

  cacheDOM: function(){
    this.width = this.element.offsetWidth;
    this.articles = this.element.querySelectorAll('.article-detail');
  }.on('didInsertElement'),

  touchStart: function(evt) {
    this.gesture = new Gesture(evt.originalEvent);
    this.handleGesture();
  },

  touchMove: function(evt) {
    if (!this.ignoreGesture) {
      evt.preventDefault();
      this.gesture.push(evt.originalEvent);
      this.handleGesture();
    }
  },

  touchEnd: function() {
    this.ignoreGesture = false;
    this.trackGesture = false;
  },

  handleGesture: function() {
    if (this.gesture.initPageX < 20) {
      this.ignoreGesture = false;
      return;
    }

    if (this.trackGesture || Math.abs(this.gesture.deltaX) > 10) { //  || this.gesture.duration > 500
      this.trackGesture = true;
      requestAnimationFrame(this.updateProgress.bind(this));
    } else {
      console.log('Gesture too short: ', this.gesture.deltaX);
    }
  },

  updateProgress: function() {
    var progress = Math.min(Math.max(this.gesture.deltaX / (this.width * 0.75), -1), 1);
    var scale = this._calculateScale(progress)
    var translateX = this._calculateTranslate(progress);
    var transform = 'scale('+scale+') translateX('+translateX+'px)';

    this.set('progress', progress);
    for (var i = 0, l = this.articles.length; i < l; i++) {
      this.articles[i].style.transform = transform;
    }
  },

  _calculateScale: function(progress){
    var value = Math.abs(progress);
    if (value < 0.1) {
      return 1 - value;
    } else if (value > 0.9) {
      return value;
    } else {
      return 0.9;
    }
  },

  _calculateTranslate: function(progress){
    return Math.sign(progress) * Math.max(Math.min(Math.abs(progress) * (1 / 0.8) - (1 / 0.8) / 10, 1), 0) * this.width;
  }
});

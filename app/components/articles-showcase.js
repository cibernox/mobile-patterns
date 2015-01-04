import Ember from 'ember';
import Gesture from 'mobile-patterns/utils/gesture';
import addEventListenerList from 'mobile-patterns/utils/add-event-listener-list';

export default Ember.Component.extend({
  progress: 0, // Progress varies between -1 and +1
  defaultSpeed: 0.045,
  ignoreGesture: false,
  trackGesture: false,
  attributeBindings: ['style'],

  style: function() {
    return 'height: ' + this.get('height') + 'px';
  }.property('height'),

  cacheDom: function(){
    this.articles = this.element.querySelectorAll('.article-detail');
    this.viewportWidth = this.element.offsetWidth / 3;
  }.on('didInsertElement'),

  addImageListeners: function() {
    var article = this.element.querySelector('.current-article');
    var self = this;

    addEventListenerList(article.querySelectorAll('img'), 'load', function() {
      self.set('height', article.offsetHeight);
    });
  }.on('didInsertElement'),

  touchStart: function(evt) {
    this.gesture = new Gesture(evt.originalEvent);
    this.handleGesture();
  },

  touchMove: function(evt) {
    if (!this.ignoreGesture) {
      this.gesture.push(evt.originalEvent);
      this.handleGesture();
    }
  },

  touchEnd: function() {
    this.finishAnimation();
    this.ignoreGesture = false;
    this.trackGesture = false;
    this.set('progress', 0);
  },

  handleGesture: function() {
    if (this.gesture.initPageX < 20) {
      this.ignoreGesture = false;
      return;
    }

    if (this.trackGesture || this._isTrackeableGesture()) {
      this.trackGesture = true;
      this.gesture.last.preventDefault();
      requestAnimationFrame(this.updateProgress.bind(this));
    }
  },

  updateProgress: function() {
    this.set('progress', -Math.min(Math.max(this.gesture.deltaX / (this.viewportWidth * 0.75), -1), 1));
    this._updateStyles();
  },

  finishAnimation: function() {
    var progress = this.get('progress');
    var self = this;
    var speedX, targetValue, delta, min, max;

    if (progress === 0 || progress === 1 || progress === -1) {
      return this._notifyFinish();
    }

    speedX = this.gesture.speedX;

    if (speedX < -500) {
      targetValue = 1; // Go to previous
      min = 0;
      max = targetValue;
    } else if (speedX > 500) {
      targetValue = -1;  // Go to next
      min = targetValue;
      max = 0;
    } else {
      targetValue = Math.round(progress); // Go to closest value
      max = Math.max(targetValue, progress);
      min = Math.min(targetValue, progress);
    }
    delta = Math.sign(targetValue - progress) * this.defaultSpeed;

    function iterate() {
      var newProgress = Math.min(max, Math.max(min, self.get('progress') + delta));
      self.set('progress', newProgress);
      self._updateStyles();
      if (newProgress !== targetValue) {
        requestAnimationFrame(iterate);
      } else {
        self._notifyFinish();
      }
    }

    iterate();
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
    return Math.sign(-progress) * Math.max(Math.min(Math.abs(progress) * (1 / 0.8) - (1 / 0.8) / 10, 1), 0) * this.viewportWidth;
  },

  _isTrackeableGesture: function() {
    return Math.abs(this.gesture.deltaX) >= 15 && this.gesture.isHorizontal();
  },

  _notifyFinish: function(){
    var progress = this.get('progress');
    if (progress === 0) {
      return;
    } else if (progress === 1) {
      console.log('goToNext')
    } else if (progress === -1) {
      console.log('goToPrevious')
    }
  },

  _updateStyles: function(){
    var progress = this.get('progress');
    var scale = this._calculateScale(progress);
    var translateX = this._calculateTranslate(progress);
    var transform = 'scale('+scale+') translateX('+translateX+'px)';

    for (var i = 0, l = this.articles.length; i < l; i++) {
      this.articles[i].style.transform = transform;
    }
  }
});

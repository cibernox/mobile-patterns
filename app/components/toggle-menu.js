import Ember from 'ember';

export default Ember.Component.extend({
  topStrokeStyle: function() {
    var progress = this.get('progress');
    var translateX = progress * 5;
    var translateY = translateX;
    var rotation   = progress * 45;
    return 'transform: rotate(' + rotation + 'deg) translate(' + translateX + 'px, ' + translateY + 'px);';
  }.property('progress'),

  middleStrokeStyle: function(){
    return 'opacity: ' + (1 - this.get('progress')) + ';';
  }.property('progress'),

  bottomStrokeStyle: function(){
    var progress = this.get('progress');
    var translateX = progress * 7;
    var translateY = progress * -8;
    var rotation   = progress * -45;
    return 'transform: rotate(' + rotation + 'deg) translate(' + translateX + 'px, ' + translateY + 'px);';
  }.property('progress'),

  click: function(){
    this.delta = this.get('progress') === 1 ? -0.04 : 0.04;
    requestAnimationFrame(this.updateProgress.bind(this));
  },

  updateProgress: function(){
    var newProgress = Math.min(Math.max(0, this.get('progress') + this.delta), 1);
    this.sendAction('action', newProgress);
    if (newProgress !== 0 && newProgress !== 1) {
      requestAnimationFrame(this.updateProgress.bind(this));
    }
  }
});

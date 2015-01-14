import Ember from 'ember';

export default Ember.Component.extend({
  topStrokeStyle: function() {
    var progress = this.get('progress');
    var translateX = progress * 5;
    var translateY = translateX;
    var rotation   = progress * 45;
    return `transform: rotate(${rotation}deg) translate(${translateX}px, ${translateY}px);`;
  }.property('progress'),

  middleStrokeStyle: function(){
    return `opacity: ${1 - this.get('progress')};`;
  }.property('progress'),

  bottomStrokeStyle: function(){
    var progress = this.get('progress');
    var translateX = progress * 7;
    var translateY = progress * -8;
    var rotation   = progress * -45;
    return `transform: rotate(${rotation}deg) translate(${translateX}px, ${translateY}px);`;
  }.property('progress'),

  click: function(){
    this.sendAction();
  }
});

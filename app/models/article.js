import DS from 'ember-data';

export default DS.Model.extend({
  header: DS.attr('string'),
  body: DS.attr('string'),
  thumbnailUrl: DS.attr('string'),
  previousArticle: DS.belongsTo('article', { async: true, inverse: 'nextArticle' }),
  nextArticle: DS.belongsTo('article', { async: true, inverse: 'previousArticle' })
});

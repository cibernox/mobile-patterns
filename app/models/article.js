import DS from 'ember-data';

export default DS.Model.extend({
  header: DS.attr('string'),
  body: DS.attr('string'),
  thumbnailUrl: DS.attr('string'),
  previousArticle: DS.belongsTo('article', { inverse: 'nextArticle' }),
  nextArticle: DS.belongsTo('article', { inverse: 'previousArticle' })
});

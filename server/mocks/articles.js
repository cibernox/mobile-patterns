module.exports = function(app) {
  var express = require('express');
  var articlesRouter = express.Router();
  var articlesFixtures = [
    {
      id: 1,
      header: 'Three headed monkey panic in LA',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. <img src="/images/three-headed-monkey.jpg" height="432" width="288"></img> <p>Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. <img src="/images/trapped-in-time.jpg"/></p> <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.</p>',
      thumbnailUrl: '/images/three-headed-monkey.jpg',
      previousArticle: null,
      nextArticle: 2
    },
    {
      id: 2,
      header: 'Tomster and Kim Kardashian, more than friends?',
      body: 'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. <img src="/images/thug-life-hamster.jpg"/> <p>Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. <img src="/images/motocross.jpg"/></p> <p>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.</p>',
      thumbnailUrl: '/images/thug-life-hamster.jpg',
      previousArticle: 1,
      nextArticle: 3
    },
    {
      id: 3,
      header: 'Angular 2.0 will be renamed to RoundedScript!',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. <img src="/images/concentric-maze.jpg"/> <p>Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet.</p> <p>Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.</p>',
      thumbnailUrl: '/images/concentric-maze.jpg',
      previousArticle: 2,
      nextArticle: 4
    },
    {
      id: 4,
      header: 'Breaking: HTMLBars are the parents',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. <img src="/images/black-moustache.jpg"/> <p>Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet.</p> <p>Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim.</p> <img src="/images/brown-moustache.jpg"/> <p> Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.</p>',
      thumbnailUrl: '/images/black-moustache.jpg',
      previousArticle: 3,
      nextArticle: 5
    },
    {
      id: 5,
      header: 'Gorbypuff: "I am forking Node.js"',
      body: '<img src="/images/gorbipuff-hole.jpg"/> <p> Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui.</p> <p>Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet.</p> <p>Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim.</p> <img src="/images/gorbipuff-coding.jpg"/> <p> Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.</p>',
      thumbnailUrl: '/images/gorbipuff-coding.jpg',
      previousArticle: 4,
      nextArticle: null
    },
  ]


  articlesRouter.get('/', function(req, res) {
    setTimeout(function() {
      res.send({ 'articles': articlesFixtures });
    }, 1500);
  });

  articlesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  articlesRouter.get('/:id', function(req, res) {
    var article = articlesFixtures.filter(function(art) { return art.id == req.params.id })[0];
    if (article) {
      setTimeout(function() {
        res.send({ 'articles': article });
      }, 1500);
    } else {
      res.status(404).end();
    }
  });

  articlesRouter.put('/:id', function(req, res) {
    res.send({
      'articles': {
        id: req.params.id
      }
    });
  });

  articlesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/articles', articlesRouter);
};

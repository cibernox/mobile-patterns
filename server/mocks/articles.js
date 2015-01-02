module.exports = function(app) {
  var express = require('express');
  var articlesRouter = express.Router();
  var articlesFixtures = [
    {
      id: 1,
      header: 'A monkey with 3 heads spreads panic in LA',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <img src="http://upcvideogames.com/wp-content/uploads/2011/12/3HMAward.jpg" height="432" width="288"></img>
        <p>Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
        <img src="http://www.fillmurray.com/300/200"></img></p>
        <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget
        nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula
        in libero. Sed dignissim lacinia nunc.</p>',
      thumbnailUrl: "http://upcvideogames.com/wp-content/uploads/2011/12/3HMAward.jpg"
    }
  ]


  articlesRouter.get('/', function(req, res) {
    res.send({
      'articles': []
    });
  });

  articlesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  articlesRouter.get('/:id', function(req, res) {
    res.send({
      'articles': {
        id: req.params.id
      }
    });
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

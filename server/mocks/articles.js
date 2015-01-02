module.exports = function(app) {
  var express = require('express');
  var articlesRouter = express.Router();
  var articlesFixtures = [
    {
      id: 1,
      header: 'Three headed monkey panic in LA',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. <img src="http://www.printsonwood.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/o/monkey_lg-crop-4x5.jpg.th.jpg" height="432" width="288"></img> <p>Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. <img src="http://www.fillmurray.com/300/200"></img></p> <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.</p>',
      thumbnailUrl: 'http://www.printsonwood.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/o/monkey_lg-crop-4x5.jpg.th.jpg'
    },
    {
      id: 2,
      header: 'Tomster and Kim Kardashian, more than friends?',
      body: 'Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. <img src="http://www.digmydog.org/images/dogs/1305/hamster-too-cool-hamster-dogs-1368036600.jpg"></img> <p>Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. <img src="http://lorempixel.com/400/200/sports/5/"></img></p> <p>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.</p>',
      thumbnailUrl: 'http://www.digmydog.org/images/dogs/1305/hamster-too-cool-hamster-dogs-1368036600.jpg'
    },
    {
      id: 3,
      header: 'Angular 2.0 will be renamed to RoundedScript!',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. <img src="http://us.123rf.com/450wm/happyroman/happyroman1112/happyroman111201430/11503991-vector-rounded-maze.jpg"></img> <p>Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet.</p> <p>Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.</p>',
      thumbnailUrl: 'http://us.123rf.com/450wm/happyroman/happyroman1112/happyroman111201430/11503991-vector-rounded-maze.jpg'
    }
  ]


  articlesRouter.get('/', function(req, res) {
    res.send({
      'articles': articlesFixtures
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

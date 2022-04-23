const todoListRouter = require('express').Router();
const query = require('../controllers/pg.js');

todoListRouter.get('/info', (req, res) => {
  const email = req.query.email;
  try {
    query.getInfo(email, async(err, response) => {
      if (err) {
        res.status(400).send('get question error');
      } else {
        const result = { results: response.rows };
        res.status(200).send(result);
      }
    });
  } catch(error) {
    console.error(error);
    res.send({data: error});
  }
});

todoListRouter.post('/category', async (req, res) => {
  var calendar_id = req.body.params.calendar_id;
  var category = req.body.params.category;
  query.postCategory(calendar_id, category, async (err, response) => {
    if (err) {
      res.status(400).send('post category error');
    } else {
      res.status(201).send( { category_id: response } );
    }
  });
});

todoListRouter.post('/item', async (req, res) => {
  var title = req.body.data.title;
  var description =  req.body.data.description;
  var duration =  req.body.data.duration;
  var start =  req.body.data.start;
  var end_date =  req.body.data.end_date;
  var in_calendar =  req.body.data.in_calendar;
  var category_id =  req.body.data.category_id;
  query.postItem(title, description, duration, start, end_date, in_calendar, category_id, async (err, response) => {
    if (err) {
      res.status(400).send('post item error');
    } else {
      res.status(201).send( { id: response } );
    }
  });
});

todoListRouter.route('/:userEmail').get((req, res) => {
  const userEmail = req.params.email
  res.send(userEmail);
})

todoListRouter.route('/:userEmail').post((req, res) => {
  const userEmail = req.params
  const item = req.body
  res.send('Todo List Router GET');
})
todoListRouter.put('/updateCategory', async (req, res) => {
  var category_id = req.body.category_id;
  var category = req.body.category;
  query.updateCategory(category_id, category, async (err, response) => {
    if (err) {
      res.status(400).send('update category error');
    } else {
      res.status(201).send('category updated');
    }
  });
});

todoListRouter.put('/updateItem', async (req, res) => {
  var title = req.body.title;
  var description =  req.body.description;
  var duration =  req.body.duration;
  var start =  req.body.start;
  var end_date =  req.body.end_date;
  var in_calendar =  req.body.in_calendar;
  var item_id = req.body.item_id;
  query.updateItem(title, description, duration, start, end_date, in_calendar, item_id, async (err, response) => {
    if (err) {
      res.status(400).send('updateItem error');
    } else {
      res.status(201).send('Item updated');
    }
  });
});

todoListRouter.put('/deleteItem', async (req, res) => {
  var item_id = req.body.item_id;
  query.deleteItem(item_id, async (err, response) => {
    if (err) {
      res.status(400).send('delete item error');
    } else {
      res.status(201).send('item deleted');
    }
  });
});

todoListRouter.put('/deleteCategory', async (req, res) => {
  var category_id = req.body.category_id;
  query.deleteCategory(category_id, async (err, response) => {
    if (err) {
      res.status(400).send('deleteCategory error');
    } else {
      res.status(201).send('category deleted');
    }
  });
});

module.exports = todoListRouter;
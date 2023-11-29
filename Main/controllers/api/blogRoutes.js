const router = require('express').Router();
const { Blog } = require('../../models/');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      const blogData = await Blog.findAll({
        where: {
          userId: req.session.userId,
        },
      });
  
      const blogs = blogData.map((blog) => blog.get({ plain: true }));
  
      res.render('all-blogs-admin', {
        layout: 'dashboard',
        posts,
      });
    } catch (err) {
      res.redirect('login');
    }
  });

router.post('/', withAuth, async (req, res) => {
  const body = req.body;
  try {
    const newBlog = await Blog.create({ ...body, userId: req.session.userId });
    res.json(newBlog);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = await Blog.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
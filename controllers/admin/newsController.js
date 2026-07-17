const News = require('../../models/News');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res) => {
  const articles = News.getAll(false);
  res.render('admin/news/index', {
    title: 'News & Stories — My Pet Tree Admin',
    currentPage: 'news',
    articles,
  });
};

exports.create = (req, res) => {
  res.render('admin/news/form', {
    title: 'Add Article — My Pet Tree Admin',
    currentPage: 'news',
    article: null,
  });
};

exports.store = (req, res) => {
  const data = req.body;
  data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

  if (!data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + uuidv4().split('-')[0];
  }

  News.create(data);
  res.redirect('/admin/news');
};

exports.edit = (req, res) => {
  const article = News.getById(req.params.id);
  if (!article) return res.redirect('/admin/news');

  res.render('admin/news/form', {
    title: `Edit ${article.title} — My Pet Tree Admin`,
    currentPage: 'news',
    article,
  });
};

exports.update = (req, res) => {
  const data = req.body;
  if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;

  News.update(req.params.id, data);
  res.redirect('/admin/news');
};

exports.destroy = (req, res) => {
  News.delete(req.params.id);
  res.redirect('/admin/news');
};

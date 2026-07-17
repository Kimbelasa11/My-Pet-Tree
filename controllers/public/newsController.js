const News = require('../../models/News');

exports.index = (req, res) => {
  const articles = News.getAll(true);

  res.render('public/news', {
    title: 'News & Stories — My Pet Tree',
    currentPage: 'news',
    articles,
  });
};

exports.show = (req, res) => {
  const article = News.getBySlug(req.params.slug);

  if (!article || !article.is_published) {
    return res.status(404).render('public/404', {
      title: 'Article Not Found — My Pet Tree',
      currentPage: '404',
    });
  }

  res.render('public/news-article', {
    title: `${article.title} — My Pet Tree`,
    currentPage: 'news',
    article,
  });
};

const News = require('../../models/News');
const Settings = require('../../models/Settings');

exports.index = (req, res) => {
  const articles = News.getAll(true);
  const bgImage = Settings.get('news_bg_image');

  res.render('public/news', {
    title: 'News & Stories — My Pet Tree',
    currentPage: 'news',
    hero: {
      title: 'News & Stories',
      subtitle: 'Updates from our reforestation efforts and stories from the community.',
      image_url: bgImage || '/assets/images/hero-placeholder.svg',
    },
    articles,
  });
};

exports.show = (req, res) => {
  const article = News.getBySlug(req.params.slug);
  const defaultBg = Settings.get('default_page_banner');

  if (!article || !article.is_published) {
    return res.status(404).render('public/404', {
      title: 'Article Not Found — My Pet Tree',
      currentPage: '404',
      hero: {
        title: '404 — Page Not Found',
        subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.',
        image_url: defaultBg || '/assets/images/hero-placeholder.svg',
      },
    });
  }

  res.render('public/news-article', {
    title: `${article.title} — My Pet Tree`,
    currentPage: 'news',
    article,
  });
};

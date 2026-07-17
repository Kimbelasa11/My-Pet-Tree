const Content = require('../../models/Content');

exports.index = (req, res) => {
  const content = Content.getAll();

  const grouped = {};
  for (const c of content) {
    if (!grouped[c.page]) grouped[c.page] = [];
    grouped[c.page].push(c);
  }

  res.render('admin/content/index', {
    title: 'Manage Content — My Pet Tree Admin',
    currentPage: 'content',
    grouped,
  });
};

exports.edit = (req, res) => {
  const { page, section } = req.params;
  const content = Content.getByPageAndSection(page, section);

  let overlayColor = '#0f2606';
  let overlayOpacity = 0.65;
  if (content?.body) {
    try {
      const parsed = JSON.parse(content.body);
      if (parsed.overlay_color) overlayColor = parsed.overlay_color;
      if (parsed.overlay_opacity != null) overlayOpacity = parseFloat(parsed.overlay_opacity);
    } catch {}
  }

  res.render('admin/content/form', {
    title: `Edit Content — My Pet Tree Admin`,
    currentPage: 'content',
    content,
    page,
    section,
    overlayColor,
    overlayOpacity,
  });
};

exports.update = (req, res) => {
  const { page, section } = req.params;
  const { title, subtitle, body, overlay_color, overlay_opacity } = req.body;
  const image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

  let finalBody = body;
  if (page === 'home' && section === 'hero') {
    const existing = Content.getByPageAndSection(page, section);
    let overlayData = {};
    if (existing?.body) {
      try { overlayData = JSON.parse(existing.body); } catch {}
    }
    overlayData.overlay_color = overlay_color || overlayData.overlay_color || '#0f2606';
    overlayData.overlay_opacity = overlay_opacity != null ? parseFloat(overlay_opacity) : (overlayData.overlay_opacity || 0.65);
    finalBody = JSON.stringify(overlayData);
  }

  Content.update(page, section, { title, subtitle, body: finalBody, image_url });

  res.redirect('/admin/content');
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiGet = (req, res) => {
  const { page, section } = req.params;
  const content = Content.getByPageAndSection(page, section);

  if (!content) return res.status(404).json({ error: 'Content not found.' });

  let overlayColor = '#0f2606';
  let overlayOpacity = 0.65;
  if (content?.body) {
    try {
      const parsed = JSON.parse(content.body);
      if (parsed.overlay_color) overlayColor = parsed.overlay_color;
      if (parsed.overlay_opacity != null) overlayOpacity = parseFloat(parsed.overlay_opacity);
    } catch {}
  }

  res.json({
    data: {
      ...content,
      overlay_color: overlayColor,
      overlay_opacity: overlayOpacity,
    }
  });
};
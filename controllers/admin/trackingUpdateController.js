const UrbanPlanter = require('../../models/UrbanPlanter');
const RuralGrower = require('../../models/RuralGrower');
const TrackingUpdate = require('../../models/TrackingUpdate');

exports.index = (req, res) => {
  const planters = UrbanPlanter.getAll(true);
  const plantersWithGrowers = planters.map(p => {
    const growers = UrbanPlanter.getLinkedGrowers(p.id);
    return { ...p, totalGrowers: growers.length };
  });
  res.render('admin/updates/urban-planters', {
    title: 'Updates & Tracking — My Pet Tree Admin',
    currentPage: 'updates',
    planters: plantersWithGrowers,
  });
};

exports.ruralGrowers = (req, res) => {
  const planter = UrbanPlanter.getById(req.params.planterId);
  if (!planter) return res.redirect('/admin/updates');

  const growers = UrbanPlanter.getLinkedGrowers(req.params.planterId);
  const growersWithStats = growers.map(g => {
    const totalUpdates = TrackingUpdate.countByGrower(g.id);
    const latestDate = TrackingUpdate.getLatestUpdateDate(g.id);
    const totalTrees = 0;
    return { ...g, totalUpdates, latestUpdateDate: latestDate, totalTrees };
  });

  res.render('admin/updates/rural-growers', {
    title: `${planter.name} — Rural Growers — My Pet Tree Admin`,
    currentPage: 'updates',
    planter,
    growers: growersWithStats,
  });
};

exports.updates = (req, res) => {
  const grower = RuralGrower.getById(req.params.growerId);
  if (!grower) return res.redirect('/admin/updates');

  const linkedPlanters = RuralGrower.getLinkedPlanters(grower.id);
  const planter = linkedPlanters.length > 0 ? linkedPlanters[0] : null;

  res.render('admin/updates/index', {
    title: `${grower.name} — Updates — My Pet Tree Admin`,
    currentPage: 'updates',
    grower,
    planter,
  });
};

exports.destroy = (req, res) => {
  TrackingUpdate.delete(req.params.id);
  res.redirect('back');
};

exports.apiList = (req, res) => {
  const growerId = req.query.grower_id;
  if (!growerId) return res.json([]);
  const updates = TrackingUpdate.getAllByGrower(growerId, true);
  const data = updates.map(u => ({
    ...u,
    images: TrackingUpdate.getImages(u.id),
  }));
  res.json(data);
};

exports.apiGet = (req, res) => {
  const update = TrackingUpdate.getFullById(req.params.id);
  if (!update) return res.status(404).json({ error: 'Update not found.' });
  res.json({ data: update });
};

exports.apiStore = (req, res) => {
  try {
    const data = req.body;
    if (!data.rural_grower_id || !data.title || !data.update_date) {
      return res.status(400).json({ error: 'Rural grower, title, and update date are required.' });
    }
    const result = TrackingUpdate.create(data);
    const updateId = result.lastInsertRowid;

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(f => `/uploads/images/${f.filename}`);
      TrackingUpdate.addImages(updateId, imageUrls);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create tracking update.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const data = req.body;
    const result = TrackingUpdate.update(req.params.id, data);
    if (!result) return res.status(404).json({ error: 'Update not found.' });

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(f => `/uploads/images/${f.filename}`);
      TrackingUpdate.addImages(req.params.id, imageUrls);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update tracking update.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    TrackingUpdate.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete tracking update.' });
  }
};

exports.apiDeleteImage = (req, res) => {
  try {
    TrackingUpdate.deleteImage(req.params.imageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete image.' });
  }
};

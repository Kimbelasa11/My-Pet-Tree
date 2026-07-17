const RuralGrower = require('../../models/RuralGrower');
const UrbanPlanter = require('../../models/UrbanPlanter');

exports.index = (req, res) => {
  const growers = RuralGrower.getAll(true);
  const growersWithPlanters = growers.map(g => {
    const linked = RuralGrower.getLinkedPlanters(g.id);
    return { ...g, linkedPlanter: linked.length > 0 ? linked[0] : null };
  });

  res.render('admin/rural-growers/index', {
    title: 'Rural Growers — My Pet Tree Admin',
    currentPage: 'rural-growers',
    growers: growersWithPlanters,
  });
};

exports.destroy = (req, res) => {
  RuralGrower.delete(req.params.id);
  res.redirect('/admin/rural-growers');
};

// ─── API Methods ──────────────────────────────────────────────

exports.apiList = (req, res) => {
  const growers = RuralGrower.getAll(true);
  const growersWithPlanters = growers.map(g => {
    const linked = RuralGrower.getLinkedPlanters(g.id);
    return { ...g, linkedPlanter: linked.length > 0 ? linked[0] : null };
  });
  res.json(growersWithPlanters);
};

exports.apiGet = (req, res) => {
  const grower = RuralGrower.getById(req.params.id);
  if (!grower) return res.status(404).json({ error: 'Rural grower not found.' });

  const linkedPlanters = RuralGrower.getLinkedPlanters(grower.id);
  const linkedPlanterIds = RuralGrower.getLinkedPlanterIds(grower.id);
  const urbanPlanterId = linkedPlanterIds.length > 0 ? linkedPlanterIds[0] : null;
  const linkedPlanter = linkedPlanters.length > 0 ? linkedPlanters[0] : null;
  const urbanPlanterName = linkedPlanter ? linkedPlanter.name : null;

  res.json({
    data: {
      ...grower,
      urban_planter_id: urbanPlanterId,
      urban_planter_name: urbanPlanterName,
    }
  });
};

exports.apiStore = (req, res) => {
  try {
    const data = req.body;
    data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

    const result = RuralGrower.create(data);

    const planterId = req.body.urban_planter_id;
    if (planterId) {
      RuralGrower.setLinkedPlanters(result.lastInsertRowid, [Number(planterId)]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create rural grower.' });
  }
};

exports.apiUpdate = (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;

    const result = RuralGrower.update(req.params.id, data);
    if (!result) return res.status(404).json({ error: 'Rural grower not found.' });

    const planterId = req.body.urban_planter_id;
    RuralGrower.setLinkedPlanters(req.params.id, planterId ? [Number(planterId)] : []);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update rural grower.' });
  }
};

exports.apiDestroy = (req, res) => {
  try {
    RuralGrower.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to delete rural grower.' });
  }
};
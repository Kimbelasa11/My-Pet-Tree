const RuralGrower = require('../../models/RuralGrower');
const UrbanPlanter = require('../../models/UrbanPlanter');

exports.index = (req, res) => {
  const growers = RuralGrower.getAll(true);

  const growersWithPlanters = growers.map(g => ({
    ...g,
    linkedPlanters: RuralGrower.getLinkedPlanters(g.id),
  }));

  res.render('admin/rural-growers/index', {
    title: 'Rural Growers — My Pet Tree Admin',
    currentPage: 'rural-growers',
    growers: growersWithPlanters,
  });
};

exports.create = (req, res) => {
  res.render('admin/rural-growers/form', {
    title: 'Add Rural Grower — My Pet Tree Admin',
    currentPage: 'rural-growers',
    grower: null,
    linkedPlanterIds: [],
  });
};

exports.store = (req, res) => {
  const data = req.body;
  data.image_url = req.file ? `/uploads/images/${req.file.filename}` : undefined;

  const result = RuralGrower.create(data);

  const planterIds = req.body.urban_planter_ids;
  if (planterIds && planterIds.length > 0) {
    const ids = Array.isArray(planterIds) ? planterIds.map(Number) : [Number(planterIds)];
    RuralGrower.setLinkedPlanters(result.lastInsertRowid, ids);
  }

  res.redirect('/admin/rural-growers');
};

exports.edit = (req, res) => {
  const grower = RuralGrower.getById(req.params.id);
  if (!grower) return res.redirect('/admin/rural-growers');

  const linkedPlanterIds = RuralGrower.getLinkedPlanterIds(grower.id);

  res.render('admin/rural-growers/form', {
    title: `Edit ${grower.name} — My Pet Tree Admin`,
    currentPage: 'rural-growers',
    grower,
    linkedPlanterIds,
  });
};

exports.update = (req, res) => {
  const data = req.body;
  if (req.file) data.image_url = `/uploads/images/${req.file.filename}`;

  RuralGrower.update(req.params.id, data);

  const planterIds = req.body.urban_planter_ids;
  const ids = planterIds
    ? (Array.isArray(planterIds) ? planterIds.map(Number) : [Number(planterIds)])
    : [];
  RuralGrower.setLinkedPlanters(req.params.id, ids);

  res.redirect('/admin/rural-growers');
};

exports.destroy = (req, res) => {
  RuralGrower.delete(req.params.id);
  res.redirect('/admin/rural-growers');
};

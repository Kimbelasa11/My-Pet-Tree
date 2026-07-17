(function() {
  'use strict';

  var sidebar = document.querySelector('.admin-sidebar');
  var sidebarToggle = document.querySelector('.sidebar-toggle');

  if (sidebarToggle && sidebar) {
    var collapsed = localStorage.getItem('adminSidebar') === 'collapsed';
    if (collapsed) sidebar.classList.add('collapsed');
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('adminSidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
    });
  }

  var mobileToggle = document.createElement('button');
  mobileToggle.className = 'admin-btn admin-btn-secondary admin-btn-sm';
  mobileToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg> Menu';
  mobileToggle.style.display = 'none';

  var topbarLeft = document.querySelector('.admin-topbar-left');
  if (topbarLeft && window.innerWidth <= 768) {
    mobileToggle.style.display = 'inline-flex';
    topbarLeft.prepend(mobileToggle);
  }

  if (sidebar) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      mobileToggle.style.display = 'inline-flex';
    } else {
      mobileToggle.style.display = 'none';
      if (sidebar) sidebar.classList.remove('open');
    }
  });

  var planterSelect = document.getElementById('urban_planter_select');
  if (planterSelect && typeof Selectize !== 'undefined') {
    var selectedIds = JSON.parse(planterSelect.getAttribute('data-selected') || '[]');

    var $select = $(planterSelect).selectize({
      plugins: ['remove_button'],
      valueField: 'id',
      labelField: 'name',
      searchField: ['name', 'email', 'location', 'organization'],
      delimiter: ',',
      persist: false,
      create: false,
      maxItems: null,
      preload: true,
      load: function(query, callback) {
        if (!query || query.length < 1) return callback();
        fetch('/admin/api/urban-planters/search?q=' + encodeURIComponent(query))
          .then(function(r) { return r.json(); })
          .then(function(data) { callback(data); })
          .catch(function() { callback(); });
      },
      render: {
        option: function(item, escape) {
          return '<div>' + escape(item.name) +
            (item.location ? ' <span style="color:#7a7a7a;font-size:12px;">(' + escape(item.location) + ')</span>' : '') +
            '</div>';
        }
      }
    });

    var selectize = $select[0].selectize;
    if (selectedIds.length > 0) {
      fetch('/admin/api/urban-planters/search?q=')
        .then(function(r) { return r.json(); })
        .then(function(planters) {
          var preloaded = planters.filter(function(p) { return selectedIds.indexOf(p.id) !== -1; });
          preloaded.forEach(function(p) {
            selectize.addOption({ id: p.id, name: p.name + (p.location ? ' (' + p.location + ')' : '') });
          });
          selectize.setValue(selectedIds);
        });
    }
  }

  document.querySelectorAll('[data-confirm]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (!confirm(this.getAttribute('data-confirm') || 'Are you sure?')) {
        e.preventDefault();
      }
    });
  });

  document.querySelectorAll('input[type="file"]').forEach(function(input) {
    input.addEventListener('change', function() {
      var preview = this.closest('.form-group').querySelector('.image-preview');
      if (!preview) return;
      var file = this.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          preview.innerHTML = '<img src="' + e.target.result + '" style="max-width:200px;max-height:150px;border-radius:8px;border:1px solid #e5e0d8;margin-top:8px;">';
        };
        reader.readAsDataURL(file);
      }
    });
  });

  document.querySelectorAll('.alert .alert-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.closest('.alert').remove();
    });
  });

})();

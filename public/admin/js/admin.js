(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  // Toast Notification System
  // ═══════════════════════════════════════════════

  var Toast = {
    container: null,

    init: function() {
      if (this.container) return;
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    },

    icons: {
      success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    },

    show: function(message, type, duration) {
      this.init();
      type = type || 'info';
      duration = duration || 4000;

      var toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.innerHTML = (this.icons[type] || this.icons.info) +
        '<div class="toast-content"><div class="toast-title">' + capitalize(type) + '</div><div class="toast-message">' + message + '</div></div>' +
        '<button class="toast-close" aria-label="Close">&times;</button>';

      toast.querySelector('.toast-close').addEventListener('click', function() {
        Toast.dismiss(toast);
      });

      this.container.appendChild(toast);

      if (duration > 0) {
        setTimeout(function() { Toast.dismiss(toast); }, duration);
      }

      return toast;
    },

    success: function(msg) { return this.show(msg, 'success'); },
    error: function(msg) { return this.show(msg, 'error'); },
    warning: function(msg) { return this.show(msg, 'warning'); },
    info: function(msg) { return this.show(msg, 'info'); },

    dismiss: function(toast) {
      toast.classList.add('removing');
      toast.addEventListener('animationend', function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      });
    }
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ═══════════════════════════════════════════════
  // Modal Manager
  // ═══════════════════════════════════════════════

  var Modal = {
    overlay: null,
    current: null,
    onClose: null,

    init: function() {
      if (this.overlay) return;
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay';
      this.overlay.setAttribute('aria-hidden', 'true');
      this.overlay.innerHTML = '<div class="modal" role="dialog" aria-modal="true"></div>';
      document.body.appendChild(this.overlay);

      var self = this;
      this.overlay.addEventListener('click', function(e) {
        if (e.target === self.overlay) self.close();
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && self.overlay.classList.contains('active')) {
          self.close();
        }
      });
    },

    trapFocus: function(modalEl) {
      var focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (!first) return;
      first.focus();
      modalEl.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    },

    open: function(options) {
      this.init();
      var self = this;

      var modalEl = this.overlay.querySelector('.modal');
      modalEl.className = 'modal' + (options.size === 'lg' ? ' modal-lg' : '');

      modalEl.innerHTML = '';

      if (options.title) {
        var header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = '<div><h2>' + options.title + '</h2>' +
          (options.subtitle ? '<p>' + options.subtitle + '</p>' : '') + '</div>' +
          '<button class="modal-close" aria-label="Close modal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        modalEl.appendChild(header);

        header.querySelector('.modal-close').addEventListener('click', function() { self.close(); });
      }

      var body = document.createElement('div');
      body.className = 'modal-body';
      if (typeof options.body === 'string') {
        body.innerHTML = options.body;
      } else if (options.body) {
        body.appendChild(options.body);
      }
      modalEl.appendChild(body);

      if (options.footer) {
        var footer = document.createElement('div');
        footer.className = 'modal-footer';
        if (typeof options.footer === 'string') {
          footer.innerHTML = options.footer;
        } else {
          footer.appendChild(options.footer);
        }
        modalEl.appendChild(footer);
      }

      this.onClose = options.onClose || null;
      this.overlay.classList.add('active');
      this.overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (options.onOpen) options.onOpen(modalEl);

      setTimeout(function() {
        self.trapFocus(modalEl);
      }, 100);

      return modalEl;
    },

    close: function() {
      if (this.onClose) this.onClose();
      this.onClose = null;
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },

    setLoading: function(message) {
      var body = this.overlay.querySelector('.modal-body');
      if (body) {
        body.innerHTML = '<div class="text-center" style="padding:40px 0;"><div class="spinner" style="margin:0 auto 16px;"></div><p class="text-sm text-muted">' + (message || 'Loading...') + '</p></div>';
      }
    },

    showError: function(message) {
      var body = this.overlay.querySelector('.modal-body');
      if (body) {
        body.innerHTML = '<div class="text-center" style="padding:40px 0;">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40" style="color:var(--danger);margin-bottom:12px;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' +
          '<p class="text-sm" style="color:var(--danger)">' + (message || 'An error occurred') + '</p></div>';
      }
    },

    getBody: function() {
      return this.overlay.querySelector('.modal-body');
    },

    getFooter: function() {
      return this.overlay.querySelector('.modal-footer');
    }
  };

  // ═══════════════════════════════════════════════
  // Form Helpers
  // ═══════════════════════════════════════════════

  var Form = {
    clearErrors: function(form) {
      form.querySelectorAll('.has-error').forEach(function(g) { g.classList.remove('has-error'); });
      form.querySelectorAll('.has-success').forEach(function(g) { g.classList.remove('has-success'); });
    },

    showError: function(field, message) {
      var group = field.closest('.form-group');
      if (group) {
        group.classList.add('has-error');
        var err = group.querySelector('.form-error');
        if (!err) {
          err = document.createElement('div');
          err.className = 'form-error';
          err.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> ';
          group.appendChild(err);
        }
        err.innerHTML = err.innerHTML.replace(/<\/svg>\s*<\/?(?:span|div)?>?\s*/, '</svg> ') + (message || '');
      }
    },

    showSuccess: function(field) {
      var group = field.closest('.form-group');
      if (group) {
        group.classList.add('has-success');
      }
    },

    serialize: function(form) {
      var data = new FormData(form);
      var obj = {};
      data.forEach(function(val, key) { obj[key] = val; });
      return obj;
    },

    submitAjax: function(form, url, options) {
      var self = this;
      options = options || {};
      this.clearErrors(form);

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = '<span class="btn-spinner"></span> ' + (options.loadingText || 'Saving...');
      }

      var formData = new FormData(form);

      return fetch(url, {
        method: options.method || 'POST',
        body: formData,
        headers: options.headers || {}
      })
      .then(function(r) {
        if (!r.ok) throw new Error('Server error: ' + r.status);
        return r.json();
      })
      .then(function(data) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-loading');
          submitBtn.innerHTML = originalText;
        }
        if (data.error) throw new Error(data.error);
        return data;
      })
      .catch(function(err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-loading');
          submitBtn.innerHTML = originalText;
        }
        throw err;
      });
    },

    setupCharCount: function(form) {
      if (!form) return;
      form.querySelectorAll('textarea[maxlength]').forEach(function(ta) {
        var max = parseInt(ta.getAttribute('maxlength'), 10);
        if (isNaN(max)) return;
        var group = ta.closest('.form-group');
        var countEl = group ? group.querySelector('.char-count') : null;
        if (!countEl) {
          countEl = document.createElement('div');
          countEl.className = 'char-count';
          if (group) group.appendChild(countEl);
        }
        function update() {
          var len = ta.value.length;
          countEl.textContent = len + ' / ' + max;
          countEl.classList.remove('warning', 'over');
          if (len > max * 0.85) countEl.classList.add('warning');
          if (len >= max) countEl.classList.add('over');
        }
        ta.addEventListener('input', update);
        update();
      });
    }
  };

  // ═══════════════════════════════════════════════
  // DataTable Helper
  // ═══════════════════════════════════════════════

  var DataTable = {
    init: function(selector, options) {
      options = options || {};
      var defaults = {
        pagingType: 'simple_numbers',
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
        language: {
          search: 'Search:',
          lengthMenu: 'Show _MENU_ records',
          info: 'Showing _START_ to _END_ of _TOTAL_ records',
          infoEmpty: 'No records found',
          infoFiltered: '(filtered from _MAX_ total)',
          emptyTable: 'No data available',
          paginate: { previous: 'Prev', next: 'Next' }
        },
        autoWidth: false,
        responsive: true
      };

      var merged = {};
      for (var k in defaults) merged[k] = defaults[k];
      for (var k in options) merged[k] = options[k];

      var table = $(selector).DataTable(merged);

      // Wire up custom search box
      var wrapper = $(selector).closest('.dataTables_wrapper');
      var searchBox = wrapper.length ? wrapper.prev('.data-table-header').find('.table-search-box input') : null;
      if (searchBox && searchBox.length) {
        var clearBtn = searchBox.closest('.table-search-box').find('.search-clear');
        searchBox.on('keyup', function() {
          table.search(this.value).draw();
          if (clearBtn.length) {
            clearBtn.toggleClass('visible', this.value.length > 0);
          }
        });
        if (clearBtn.length) {
          clearBtn.on('click', function() {
            searchBox.val('').trigger('keyup');
            searchBox.focus();
          });
        }
      }

      return table;
    },

    refresh: function() {
      location.reload();
    }
  };

  // ═══════════════════════════════════════════════
  // Sidebar
  // ═══════════════════════════════════════════════

  function initSidebar() {
    var sidebar = document.querySelector('.admin-sidebar');
    var sidebarToggle = document.querySelector('.sidebar-toggle');
    var mobileToggle = document.querySelector('.mobile-toggle');

    if (sidebarToggle && sidebar) {
      var collapsed = localStorage.getItem('adminSidebar') === 'collapsed';
      if (collapsed) sidebar.classList.add('collapsed');
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('adminSidebar', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
      });
    }

    if (mobileToggle && sidebar) {
      mobileToggle.style.display = 'none';

      function handleResize() {
        if (window.innerWidth <= 768) {
          mobileToggle.style.display = 'flex';
        } else {
          mobileToggle.style.display = 'none';
          sidebar.classList.remove('open');
        }
      }

      handleResize();

      mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
      });

      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });

      var resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
      });
    }
  }

  initSidebar();

  // ═══════════════════════════════════════════════
  // Global Event Listeners
  // ═══════════════════════════════════════════════

  // Alert close buttons
  document.addEventListener('click', function(e) {
    var close = e.target.closest('.alert-close');
    if (close) {
      var alert = close.closest('.alert');
      if (alert) alert.remove();
    }
  });

  // File input preview
  document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="file"]')) {
      var previewContainer = e.target.closest('.form-group') ? e.target.closest('.form-group').querySelector('.image-preview') : null;
      var uploadZone = e.target.closest('.upload-zone');
      if (uploadZone) {
        previewContainer = uploadZone.parentElement ? uploadZone.parentElement.querySelector('.image-preview') : null;
      }
      if (!previewContainer) return;
      var file = e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function(ev) {
          previewContainer.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.innerHTML = '';
      }
    }
  });

  // Upload zone click handling
  document.addEventListener('click', function(e) {
    var zone = e.target.closest('.upload-zone');
    if (zone) {
      var input = zone.parentElement.querySelector('input[type="file"]');
      if (input) input.click();
    }
  });

  // Drag and drop for upload zones
  document.addEventListener('dragover', function(e) {
    var zone = e.target.closest('.upload-zone');
    if (zone) {
      e.preventDefault();
      zone.classList.add('dragover');
    }
  });

  document.addEventListener('dragleave', function(e) {
    var zone = e.target.closest('.upload-zone');
    if (zone) {
      zone.classList.remove('dragover');
    }
  });

  document.addEventListener('drop', function(e) {
    var zone = e.target.closest('.upload-zone');
    if (zone) {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        var input = zone.parentElement.querySelector('input[type="file"]');
        if (input) {
          input.files = e.dataTransfer.files;
          input.dispatchEvent(new Event('change'));
        }
      }
    }
  });

  // Delete confirmation
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-confirm]');
    if (btn) {
      var msg = btn.getAttribute('data-confirm') || 'Are you sure?';
      if (!confirm(msg)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  // Auto-fade alerts
  document.querySelectorAll('.alert-success').forEach(function(el) {
    if (!el.closest('[data-no-auto-dismiss]')) {
      setTimeout(function() {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '0';
        setTimeout(function() { if (el.parentNode) el.remove(); }, 300);
      }, 5000);
    }
  });

  // Number animation for stats
  document.querySelectorAll('[data-animate]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-animate'), 10);
    if (isNaN(target)) return;
    var duration = 1000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });

  // Character count setup for all textareas with maxlength
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('textarea[maxlength]').forEach(function(ta) {
      var max = parseInt(ta.getAttribute('maxlength'), 10);
      if (isNaN(max)) return;
      var group = ta.closest('.form-group');
      var countEl = group ? group.querySelector('.char-count') : null;
      if (!countEl) {
        countEl = document.createElement('div');
        countEl.className = 'char-count';
        if (group) group.appendChild(countEl);
      }
      function update() {
        var len = ta.value.length;
        countEl.textContent = len + ' / ' + max;
        countEl.classList.remove('warning', 'over');
        if (len > max * 0.85) countEl.classList.add('warning');
        if (len >= max) countEl.classList.add('over');
      }
      ta.addEventListener('input', update);
      update();
    });
  });

  // Keyboard shortcut: Ctrl+Enter to submit modal forms
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      var overlay = document.querySelector('.modal-overlay.active');
      if (overlay) {
        var saveBtn = overlay.querySelector('.modal-save-btn');
        if (saveBtn) {
          e.preventDefault();
          saveBtn.click();
        }
      }
    }
  });

  // ═══════════════════════════════════════════════
  // Module: Modal Form Factory
  // Creates Add/Edit modal forms for any module
  // ═══════════════════════════════════════════════

  window.ModalForm = {
    create: function(config) {
      var self = this;
      var isEdit = false;
      var editId = null;
      var tableId = config.tableId;

      function buildForm(data) {
        data = data || {};
        var html = '<form id="modal-form-' + config.name + '" enctype="multipart/form-data">';
        config.fields.forEach(function(field) {
          html += '<div class="form-group">';
          if (field.label) {
            html += '<label for="mf-' + field.name + '">' + field.label + (field.required ? ' <span class="required">*</span>' : '') + '</label>';
          }
          var val = data[field.name] !== undefined ? data[field.name] : (field.default || '');

          if (field.type === 'textarea') {
            var rows = field.rows || 3;
            var maxlength = field.maxlength ? ' maxlength="' + field.maxlength + '"' : '';
            html += '<textarea id="mf-' + field.name + '" name="' + field.name + '" rows="' + rows + '"' + (field.placeholder ? ' placeholder="' + field.placeholder + '"' : '') + (field.required ? ' required' : '') + maxlength + '>' + escapeHtml(String(val || '')) + '</textarea>';
          } else if (field.type === 'select') {
            html += '<select id="mf-' + field.name + '" name="' + field.name + '"' + (field.required ? ' required' : '') + '>';
            if (field.options) {
              field.options.forEach(function(opt) {
                var selected = String(val) === String(opt.value) ? ' selected' : '';
                html += '<option value="' + opt.value + '"' + selected + '>' + opt.label + '</option>';
              });
            }
            html += '</select>';
          } else if (field.type === 'file') {
            if (field.currentImage && data.image_url) {
              html += '<div class="image-preview" style="margin-bottom:8px;"><img src="' + data.image_url + '" alt="Current"></div>';
            }
            html += '<input type="file" id="mf-' + field.name + '" name="' + field.name + '" accept="image/*">';
            html += '<div class="image-preview"></div>';
          } else if (field.type === 'planter_select') {
            var pName = escapeAttr(data.urban_planter_name || '');
            html += '<select id="mf-' + field.name + '" name="' + field.name + '" data-selected=\'' + JSON.stringify(data.urban_planter_id ? [data.urban_planter_id] : []) + '\' data-planter-name="' + pName + '"></select>';
          } else {
            html += '<input type="' + (field.type || 'text') + '" id="mf-' + field.name + '" name="' + field.name + '" value="' + escapeHtml(String(val || '')) + '"' + (field.placeholder ? ' placeholder="' + field.placeholder + '"' : '') + (field.required ? ' required' : '') + '>';
          }
          if (field.help) {
            html += '<p class="form-help">' + field.help + '</p>';
          }
          html += '<div class="form-error"></div>';
          html += '</div>';
        });
        html += '</form>';
        return html;
      }

      function buildFooter() {
        return '<button type="button" class="btn btn-secondary modal-cancel-btn">Cancel</button>' +
               '<button type="button" class="btn btn-primary modal-save-btn" id="modal-save-' + config.name + '">' +
               '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ' +
               (isEdit ? 'Update' : 'Create') + '</button>';
      }

      function initPlanterSelect() {
        var select = document.getElementById('mf-urban_planter_id');
        if (!select || typeof $ === 'undefined' || typeof Selectize === 'undefined') return;

        var selectedIds = JSON.parse(select.getAttribute('data-selected') || '[]');
        var planterName = select.getAttribute('data-planter-name') || '';

        var $sel = $(select).selectize({
          plugins: ['remove_button'],
          valueField: 'id',
          labelField: 'name',
          searchField: ['name', 'email', 'location', 'organization'],
          persist: false,
          create: false,
          maxItems: 1,
          preload: 'focus',
          load: function(query, callback) {
            fetch('/admin/api/urban-planters/search?q=' + encodeURIComponent(query || ''))
              .then(function(r) { return r.json(); })
              .then(function(data) { callback(data); })
              .catch(function() { callback(); });
          },
          render: {
            option: function(item, escape) {
              return '<div>' + escape(item.name) +
                (item.location ? ' <span style="color:#999;font-size:12px;">(' + escape(item.location) + ')</span>' : '') +
                '</div>';
            }
          },
          onInitialize: function() {
            if (selectedIds.length > 0 && planterName) {
              this.addOption({ id: selectedIds[0], name: planterName });
              this.setValue(selectedIds[0]);
            }
          }
        });
      }

      function handleSave() {
        var form = document.getElementById('modal-form-' + config.name);
        if (!form) return;

        var url = isEdit ? config.apiUrl + '/' + editId : config.apiUrl;
        Form.submitAjax(form, url, { loadingText: isEdit ? 'Updating...' : 'Creating...' })
          .then(function(data) {
            if (data.error) {
              Toast.show(data.error, 'error');
              return;
            }
            Toast.show(isEdit ? config.label + ' updated successfully.' : config.label + ' created successfully.', 'success');
            Modal.close();
            setTimeout(function() { location.reload(); }, 600);
          })
          .catch(function(err) {
            Toast.show(err.message || 'Failed to save. Please try again.', 'error');
          });
      }

      function openAdd() {
        isEdit = false;
        editId = null;
        Modal.open({
          title: 'Add ' + config.label,
          subtitle: 'Fill in the details below',
          body: buildForm(),
          footer: buildFooter(),
          onOpen: function() {
            initPlanterSelect();
            // Focus first input
            var firstInput = document.querySelector('#modal-form-' + config.name + ' input, #modal-form-' + config.name + ' textarea, #modal-form-' + config.name + ' select');
            if (firstInput) setTimeout(function() { firstInput.focus(); }, 200);
            document.querySelector('.modal-cancel-btn').addEventListener('click', function() { Modal.close(); });
            document.querySelector('.modal-save-btn').addEventListener('click', handleSave);
            // Setup character counts
            Form.setupCharCount(document.getElementById('modal-form-' + config.name));
          }
        });
      }

      function openEdit(id) {
        isEdit = true;
        editId = id;
        Modal.open({
          title: 'Edit ' + config.label,
          subtitle: 'Update the details below',
          body: '',
          footer: buildFooter()
        });
        Modal.setLoading('Loading...');

        fetch(config.apiUrl + '/' + id)
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.error) {
              Modal.showError(data.error);
              return;
            }
            var record = data.data || data;
            if (config.beforeOpen) record = config.beforeOpen(record);
            var body = Modal.getBody();
            body.innerHTML = buildForm(record);
            initPlanterSelect();
            document.querySelector('.modal-cancel-btn').addEventListener('click', function() { Modal.close(); });
            document.querySelector('.modal-save-btn').addEventListener('click', handleSave);
            Form.setupCharCount(document.getElementById('modal-form-' + config.name));
          })
          .catch(function() {
            Modal.showError('Failed to load record.');
          });
      }

      function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this ' + config.label.toLowerCase() + '? This cannot be undone.')) return;

        fetch(config.apiUrl + '/' + id + '/delete', { method: 'POST' })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.error) {
              Toast.show(data.error, 'error');
              return;
            }
            Toast.show(config.label + ' deleted successfully.', 'success');
            setTimeout(function() { location.reload(); }, 600);
          })
          .catch(function(err) {
            Toast.show(err.message || 'Failed to delete.', 'error');
          });
      }

      return {
        openAdd: openAdd,
        openEdit: openEdit,
        handleDelete: handleDelete
      };
    }
  };

  // ═══════════════════════════════════════════════
  // Utility
  // ═══════════════════════════════════════════════

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Expose globals
  window.Toast = Toast;
  window.Modal = Modal;
  window.Form = Form;
  window.DataTable = DataTable;

})();

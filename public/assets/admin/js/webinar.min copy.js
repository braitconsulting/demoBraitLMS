/******/ (() => { // webpackBootstrap
  var __webpack_exports__ = {};
  /*!***************************************!*\
    !*** ./resources/js/admin/webinar.js ***!
    \***************************************/
  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
  (function ($) {
    "use strict";

    // form serialize to Object
    $.fn.serializeObject = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };
    function randomString() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }

    /**
     * close swl
     * */
    $('body').on('click', '.close-swl', function (e) {
      e.preventDefault();
      Swal.close();
    });
    if (jQuery().summernote) {
      makeSummernote($('#summernote'), 400);
    }
    $('body').on('click', '#saveAndPublish', function (e) {
      e.preventDefault();
      $('#forDraft').val('publish');
      $('#webinarForm').trigger('submit');
    });
    $('body').on('click', '#saveAsDraft', function (e) {
      e.preventDefault();
      $('#forDraft').val(1);
      $('#webinarForm').trigger('submit');
    });
    $('body').on('click', '#saveReject', function (e) {
      e.preventDefault();
      $('#forDraft').val('reject');
      $('#webinarForm').trigger('submit');
    });
    $('#partnerInstructorSwitch').on('change.bootstrapSwitch', function (e) {
      var isChecked = e.target.checked;
      if (isChecked) {
        $('#partnerInstructorInput').removeClass('d-none');
        handleSearchableSelect2('js-search-partner-user', adminPanelPrefix + '/users/search', 'name');
      } else {
        $('#partnerInstructorInput').addClass('d-none');
      }
    });
    $('body').on('change', '#categories', function (e) {
      e.preventDefault();
      var category_id = this.value;
      $.get(adminPanelPrefix + '/filters/get-by-category-id/' + category_id, function (result) {
        if (result && typeof result.filters !== "undefined" && result.filters.length) {
          var html = '';
          Object.keys(result.filters).forEach(function (key) {
            var filter = result.filters[key];
            var options = [];
            if (filter.options.length) {
              options = filter.options;
            }
            html += '<div class="col-12 col-md-3">\n' + '<div class="webinar-category-filters">\n' + '<strong class="category-filter-title d-block">' + filter.title + '</strong>\n' + '<div class="py-10"></div>\n' + '\n';
            if (options.length) {
              Object.keys(options).forEach(function (index) {
                var option = options[index];
                html += '<div class="form-group mt-20 d-flex align-items-center justify-content-between">\n' + '<label class="" for="filterOption' + option.id + '">' + option.title + '</label>\n' + '<div class="custom-control custom-checkbox">\n' + '<input type="checkbox" name="filters[]" value="' + option.id + '" class="custom-control-input" id="filterOption' + option.id + '">\n' + '<label class="custom-control-label" for="filterOption' + option.id + '"></label>\n' + '</div>\n' + '</div>\n';
              });
            }
            html += '</div></div>';
          });
          $('#categoriesFiltersContainer').removeClass('d-none');
          $('#categoriesFiltersCard').html(html);
        } else {
          $('#categoriesFiltersContainer').addClass('d-none');
          $('#categoriesFiltersCard').html('');
        }
      });
    });

    /**
     * add ticket
     * */
    $('body').on('click', '#webinarAddTicket', function (e) {
      e.preventDefault();
      var add_ticket_modal = '<div id="addTicketModal">';
      add_ticket_modal += $('#webinarTicketModal').html();
      add_ticket_modal += '</div>';
      Swal.fire({
        html: add_ticket_modal,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem'
      });
      resetDatePickers();
    });
    $('body').on('click', '#saveTicket', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#addTicketModal .js-form');
      handleWebinarItemForm(form, $this);
    });

    /**
     * Contents
     * */

    $(document).ready(function () {
      var style = getComputedStyle(document.body);
      var primaryColor = style.getPropertyValue('--primary');
      function updateToDatabase(table, idString) {
        $.post(adminPanelPrefix + '/webinars/order-items', {
          table: table,
          items: idString
        }, function (result) {
          if (result && result.title && result.msg) {
            $.toast({
              heading: result.title,
              text: result.msg,
              bgColor: primaryColor,
              textColor: 'white',
              hideAfter: 10000,
              position: 'bottom-right',
              icon: 'success'
            });
          }
        });
      }
      function setSortable(target) {
        if (target.length) {
          target.sortable({
            group: 'no-drop',
            handle: '.move-icon',
            axis: "y",
            update: function update(e, ui) {
              var sortData = target.sortable('toArray', {
                attribute: 'data-id'
              });
              var table = e.target.getAttribute('data-order-table');
              updateToDatabase(table, sortData.join(','));
            }
          });
        }
      }
      var items = [];
      var draggableContentLists = $('.draggable-content-lists');
      if (draggableContentLists.length) {
        var _iterator = _createForOfIteratorHelper(draggableContentLists),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            items.push($(item).attr('data-drag-class'));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      if (items.length) {
        var _iterator2 = _createForOfIteratorHelper(items),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _item = _step2.value;
            var tag = $('.' + _item);
            if (tag.length) {
              setSortable(tag);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      var $fileForms = $('.file-form');
      if ($fileForms && $fileForms.length) {
        $fileForms.each(function (key) {
          if ($fileForms[key]) {
            var $form = $($fileForms[key]);
            var source = $form.find('.js-file-storage').val();
            var fileType = $form.find('.js-ajax-file_type').val();
            handleShowFileInputsBySource($form, source, fileType);
            var secureHostType = $form.find('.js-secure-host-upload-type-field input:checked').val();
            if (secureHostType && source === 'secure_host') {
              handleSecureHostUploadType($form, secureHostType);
            }
          }
        });
      }
      if ($('.accordion-content-wrapper .attachments-select2').length) {
        $('.accordion-content-wrapper .attachments-select2').select2({
          multiple: true,
          width: '100%'
        });
      }
      var summernoteTarget = $('.accordion-content-wrapper .js-content-summernote');
      if (summernoteTarget.length) {
        makeSummernote(summernoteTarget, 400, function (contents, $editable) {
          $('.js-hidden-content-summernote').val(contents);
        });
      }
    });
    $('body').on('change', '.js-webinar-content-locale', function (e) {
      e.preventDefault();
      var $this = $(this);
      var $form = $(this).closest('.js-content-form');
      var locale = $this.val();
      var webinarId = $this.attr('data-webinar-id');
      var item_id = $this.attr('data-id');
      var relation = $this.attr('data-relation');
      var fields = $this.attr('data-fields');
      fields = fields.split(',');
      $this.addClass('loadingbar gray');
      var path = adminPanelPrefix + '/webinars/' + webinarId + '/getContentItemByLocale';
      var data = {
        item_id: item_id,
        locale: locale,
        relation: relation
      };
      $.post(path, data, function (result) {
        if (result && result.item) {
          var item = result.item;
          Object.keys(item).forEach(function (key) {
            var value = item[key];
            if ($.inArray(key, fields) !== -1) {
              var element = $form.find('.js-ajax-' + key);
              element.val(value);
            }
            if (relation === 'textLessons' && key === 'content') {
              var summernoteTarget = $form.find('.js-content-' + item_id);
              if (summernoteTarget.length) {
                summernoteTarget.summernote('destroy');
                summernoteTarget.val(value);
                $('.js-hidden-content-' + item_id).val(value);
                makeSummernote(summernoteTarget, 400, function (contents, $editable) {
                  $('.js-hidden-content-' + item_id).val(contents);
                });
              }
            }
          });
          $this.removeClass('loadingbar gray');
        }
      }).fail(function (err) {
        $this.removeClass('loadingbar gray');
      });
    });
    function handleFileFormSubmit(form, $this) {
      var data = serializeObjectByTag(form);
      var action = form.attr('data-action');
      $this.addClass('loadingbar primary').prop('disabled', true);
      form.find('input').removeClass('is-invalid');
      form.find('textarea').removeClass('is-invalid');
      var formData = new FormData();
      var s3Input = form.find('.js-s3-file-input');
      var hasFileForUpload = false;
      if (s3Input && s3Input.prop('files') && s3Input.prop('files')[0]) {
        formData.append('s3_file', s3Input.prop('files')[0]);
        hasFileForUpload = true;
      }
      var items = form.find('input, textarea, select').serializeArray();
      $.each(items, function () {
        formData.append(this.name, this.value);
      });
      var source = form.find('.js-file-storage').val();
      form.find('.progress').addClass('d-none');
      $.ajax({
        url: action,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        xhr: function xhr() {
          var xhr = new window.XMLHttpRequest();
          var percentComplete = 0;
          xhr.upload.addEventListener("progress", function (event) {
            if (event.lengthComputable && (source === "s3" || source === "secure_host") && hasFileForUpload) {
              percentComplete = event.loaded / event.total * 100;
              var percentage = Math.round(percentComplete) - 1;
              form.find('.progress').removeClass('d-none');
              var bar = form.find('.progress .progress-bar');
              bar.css("width", percentage + '%');
              bar.text(percentage + '%');
            }
          }, false);
          return xhr;
        },
        success: function success(result) {
          if (result && result.code === 200) {
            //window.location.reload();
            Swal.fire({
              icon: 'success',
              html: '<h3 class="font-20 text-center text-dark-blue py-25">' + saveSuccessLang + '</h3>',
              showConfirmButton: false,
              width: '25rem'
            });
            setTimeout(function () {
              window.location.reload();
            }, 500);
          }
        },
        error: function error(err) {
          $this.removeClass('loadingbar primary').prop('disabled', false);
          var errors = err.responseJSON;
          if (errors && errors.errors) {
            Object.keys(errors.errors).forEach(function (key) {
              var error = errors.errors[key];
              var element = form.find('.js-ajax-' + key);
              element.addClass('is-invalid');
              element.parent().find('.invalid-feedback').text(error[0]);
            });
          }
        }
      });
    }
    window.handleWebinarItemForm = function (form, $this) {
      var data = serializeObjectByTag(form);
      var action = form.attr('data-action');
      $this.addClass('loadingbar primary').prop('disabled', true);
      form.find('input').removeClass('is-invalid');
      form.find('textarea').removeClass('is-invalid');
      $.post(action, data, function (result) {
        if (result && result.code === 200) {
          //window.location.reload();
          Swal.fire({
            icon: 'success',
            html: '<h3 class="font-20 text-center text-dark-blue py-25">' + saveSuccessLang + '</h3>',
            showConfirmButton: false,
            width: '25rem'
          });
          setTimeout(function () {
            window.location.reload();
          }, 500);
        }
      }).fail(function (err) {
        $this.removeClass('loadingbar primary').prop('disabled', false);
        var errors = err.responseJSON;
        if (errors && errors.status === 'zoom_token_invalid') {
          Swal.fire({
            icon: 'error',
            html: '<h3 class="font-20 text-center text-dark-blue py-25">' + errors.zoom_error_msg + '</h3>',
            showConfirmButton: false,
            width: '25rem'
          });
        }
        if (errors && errors.errors) {
          Object.keys(errors.errors).forEach(function (key) {
            var error = errors.errors[key];
            var element = form.find('.js-ajax-' + key);
            if (key === 'zoom-not-complete-alert') {
              form.find('.js-zoom-not-complete-alert').removeClass('d-none');
            } else {
              element.addClass('is-invalid');
              element.parent().find('.invalid-feedback').text(error[0]);
            }
          });
        }
      });
    };
    $('body').on('click', '.save-chapter', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.chapter-form');
      handleWebinarItemForm(form, $this);
    });
    $('body').on('click', '.js-add-chapter', function (e) {
      var $this = $(this);
      var webinarId = $this.attr('data-webinar-id');
      var type = $this.attr('data-type');
      var itemId = $this.attr('data-chapter');
      var locale = $this.attr('data-locale');
      var random = itemId ? itemId : randomString();
      var clone = $('#chapterModalHtml').clone();
      clone.removeClass('d-none');
      var cloneHtml = clone.prop('innerHTML');
      cloneHtml = cloneHtml.replaceAll('record', random);
      clone.html('<div id="chapterModal' + random + '">' + cloneHtml + '</div>');
      Swal.fire({
        html: clone,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '36rem',
        onOpen: function onOpen() {
          var modal = $('#chapterModal' + random);
          modal.find('input.js-chapter-webinar-id').val(webinarId);
          modal.find('input.js-chapter-type').val(type);
          if (itemId) {
            modal.find('.section-title').text(editChapterLang);
            var path = adminPanelPrefix + '/chapters/' + itemId + '/update';
            modal.find('.chapter-form').attr('data-action', path);
            $.get(adminPanelPrefix + '/chapters/' + itemId + '?locale=' + locale, function (result) {
              if (result && result.chapter) {
                modal.find('.js-ajax-title').val(result.chapter.title);
                var status = modal.find('.js-chapter-status-switch');
                if (result.chapter.status === 'active') {
                  status.prop('checked', true);
                } else {
                  status.prop('checked', false);
                }
                var checkedAllContents = result.chapter.check_all_contents_pass && result.chapter.check_all_contents_pass !== "0";
                modal.find('.js-chapter-check-all-contents-pass').prop('checked', checkedAllContents);
                var localeSelect = modal.find('.js-chapter-locale');
                localeSelect.val(locale);
                localeSelect.addClass('js-webinar-content-locale');
                localeSelect.attr('data-id', itemId);
              }
            });
          }
        }
      });
    });
    $('body').on('click', '.js-add-course-content-btn, .add-new-interactive-file-btn', function (e) {
      e.preventDefault();
      var $this = $(this);
      var type = $this.attr('data-type');
      var chapterId = $this.attr('data-chapter');
      var contentTagId = '#chapterContentAccordion' + chapterId;
      var key = randomString();
      var html = '';
      switch (type) {
        case 'file':
          var newFileForm = $('#newFileForm');
          newFileForm.find('.chapter-input').val(chapterId);
          html = newFileForm.html();
          html = html.replace(/record/g, key);
          $(contentTagId).prepend(html);
          break;
        case 'new_interactive_file':
          var newInteractiveFileForm = $('#newInteractiveFileForm');
          newInteractiveFileForm.find('.chapter-input').val(chapterId);
          html = newInteractiveFileForm.html();
          html = html.replace(/record/g, key);
          $(contentTagId).prepend(html);
          break;
        case 'session':
          var newSessionForm = $('#newSessionForm');
          newSessionForm.find('.chapter-input').val(chapterId);
          html = newSessionForm.html();
          html = html.replace(/record/g, key);
          $(contentTagId).prepend(html);
          break;
        case 'text_lesson':
          var newTextLessonForm = $('#newTextLessonForm');
          newTextLessonForm.find('.chapter-input').val(chapterId);
          html = newTextLessonForm.html();
          html = html.replace(/record/g, key);
          html = html.replaceAll('attachments-select2', 'attachments-select2-' + key);
          html = html.replaceAll('js-content-summernote', 'js-content-summernote-' + key);
          html = html.replaceAll('js-hidden-content-summernote', 'js-hidden-content-summernote-' + key);
          $(contentTagId).prepend(html);
          $('.attachments-select2-' + key).select2({
            multiple: true,
            width: '100%'
          });
          if (jQuery().summernote) {
            makeSummernote($('.js-content-summernote-' + key), 400, function (contents, $editable) {
              $('.js-hidden-content-summernote-' + key).val(contents);
            });
          }
          break;
        case 'assignment':
          var newAssignmentForm = $('#newAssignmentForm');
          newAssignmentForm.find('.chapter-input').val(chapterId);
          html = newAssignmentForm.html();
          html = html.replace(/record/g, key);
          $(contentTagId).prepend(html);
          break;
        case 'quiz':
          var newQuizForm = $('#newQuizForm');
          newQuizForm.find('.chapter-input').val(chapterId);
          html = newQuizForm.html();
          html = html.replace(/record/g, key);
          $(contentTagId).prepend(html);
          break;
      }
      resetDatePickers();
      feather.replace();
    });
    $('body').on('click', '.js-change-content-chapter', function (e) {
      e.preventDefault();
      var $this = $(this);
      var itemId = $this.attr('data-item-id');
      var itemType = $this.attr('data-item-type');
      var chapterId = $this.attr('data-chapter-id');
      var random = randomString();
      var clone = $('#changeChapterModalHtml').clone();
      clone.removeClass('d-none');
      var cloneHtml = clone.prop('innerHTML');
      clone.html('<div id="changeChapterModalHtml' + random + '">' + cloneHtml + '</div>');
      Swal.fire({
        html: clone,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '36rem',
        onOpen: function onOpen() {
          var modal = $('#changeChapterModalHtml' + random);
          modal.find('input.js-item-id').val(itemId);
          modal.find('input.js-item-type').val(itemType);
          modal.find('.js-ajax-chapter_id').val(chapterId).change();
        }
      });
    });
    $('body').on('click', '.save-change-chapter', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.change-chapter-form');
      handleWebinarItemForm(form, $this);
    });

    // ======
    // contents files
    function handleShowFileInputsBySource($form, source, fileType) {
      var featherIconsConf = {
        width: 20,
        height: 20
      };
      var icon = feather.icons['upload'].toSvg(featherIconsConf);
      var $fileTypeVolumeInputs = $form.find('.js-file-type-volume');
      var $volumeInputs = $form.find('.js-file-volume-field');
      var $typeInputs = $form.find('.js-file-type-field');
      var $downloadableInput = $form.find('.js-downloadable-input');
      var $onlineViewerInput = $form.find('.js-online_viewer-input');
      var $filePathInputGroup = $form.find('.js-file-path-input');
      var $s3FilePathInputGroup = $form.find('.js-s3-file-path-input');
      var $filePathButton = $form.find('.js-file-path-input button');
      var $filePathInput = $form.find('.js-file-path-input input');
      var $secureHostUploadTypeField = $form.find('.js-secure-host-upload-type-field');
      $filePathButton.addClass('panel-file-manager');
      $filePathInputGroup.removeClass('d-none');
      $s3FilePathInputGroup.addClass('d-none');
      $volumeInputs.addClass('d-none');
      $typeInputs.removeClass('d-none'); // parent is hidden or visible
      $secureHostUploadTypeField.addClass('d-none');
      $s3FilePathInputGroup.find('input').removeAttr("accept");
      switch (source) {
        case 'youtube':
        case 'vimeo':
        case 'iframe':
          $fileTypeVolumeInputs.addClass('d-none');
          $fileTypeVolumeInputs.find('select').val('');
          $downloadableInput.find('input').prop('checked', false);
          $downloadableInput.addClass('d-none');
          $onlineViewerInput.find('input').prop('checked', false);
          $onlineViewerInput.addClass('d-none');
          icon = feather.icons['link'].toSvg(featherIconsConf);
          $filePathButton.removeClass('panel-file-manager');
          break;
        case 'external_link':
        case 's3':
          $fileTypeVolumeInputs.removeClass('d-none');
          if (fileType && fileType === 'video') {
            $downloadableInput.removeClass('d-none');
          } else {
            $downloadableInput.find('input').prop('checked', false);
            $downloadableInput.addClass('d-none');
          }
          if (source === 'external_link') {
            icon = feather.icons['external-link'].toSvg(featherIconsConf);
            $filePathButton.removeClass('panel-file-manager');
            $volumeInputs.removeClass('d-none');
          } else if (source === 's3') {
            $filePathInputGroup.addClass('d-none');
            $s3FilePathInputGroup.removeClass('d-none');
          }
          if (fileType && fileType === 'pdf') {
            $onlineViewerInput.removeClass('d-none');
          } else {
            $onlineViewerInput.find('input').prop('checked', false);
            $onlineViewerInput.addClass('d-none');
          }
          break;
        case 'secure_host':
          $fileTypeVolumeInputs.addClass('d-none');
          $fileTypeVolumeInputs.find('select').val('');
          $filePathInputGroup.addClass('d-none');
          $s3FilePathInputGroup.removeClass('d-none');
          $downloadableInput.find('input').prop('checked', false);
          $downloadableInput.addClass('d-none');
          $onlineViewerInput.addClass('d-none');
          $secureHostUploadTypeField.removeClass('d-none');
          $s3FilePathInputGroup.find('input').attr('accept', "video/mp4,video/x-m4v,video/*");
          break;
        case 'google_drive':
          $fileTypeVolumeInputs.removeClass('d-none');
          $volumeInputs.removeClass('d-none');
          $downloadableInput.find('input').prop('checked', false);
          $downloadableInput.addClass('d-none');
          if (fileType && fileType === 'pdf') {
            $onlineViewerInput.removeClass('d-none');
          } else {
            $onlineViewerInput.find('input').prop('checked', false);
            $onlineViewerInput.addClass('d-none');
          }
          icon = feather.icons['box'].toSvg(featherIconsConf);
          $filePathButton.removeClass('panel-file-manager');
          break;
        case 'upload':
          $fileTypeVolumeInputs.removeClass('d-none');
          $downloadableInput.removeClass('d-none');
          if (fileType && fileType === 'pdf') {
            $onlineViewerInput.removeClass('d-none');
          } else {
            $onlineViewerInput.find('input').prop('checked', false);
            $onlineViewerInput.addClass('d-none');
          }
      }
      if (fileType && (fileType === 'image' || fileType === 'document' || fileType === 'powerpoint' || fileType === 'sound' || fileType === 'archive' || fileType === 'project')) {
        $downloadableInput.find('input').prop('checked', true);
        $downloadableInput.addClass('d-none');
      }
      if (icon) {
        $filePathButton.html(icon);
      }
      if (filePathPlaceHolderBySource) {
        $filePathInput.attr('placeholder', filePathPlaceHolderBySource[source]);
      }
    }
    function handleSecureHostUploadType($form, value) {
      var $pathInput = $form.find('.js-secure-host-path-input');
      var $uploadInput = $form.find('.js-s3-file-path-input');
      var $fileTypeVolumeInputs = $form.find('.js-file-type-volume');
      var $volumeInputs = $form.find('.js-file-volume-field');
      var $typeInputs = $form.find('.js-file-type-field');
      $typeInputs.addClass('d-none');
      if (value === "manual") {
        $fileTypeVolumeInputs.removeClass('d-none');
        $volumeInputs.removeClass('d-none');
        $pathInput.removeClass('d-none');
        $uploadInput.addClass('d-none');
      } else {
        $fileTypeVolumeInputs.addClass('d-none');
        $volumeInputs.addClass('d-none');
        $pathInput.addClass('d-none');
        $uploadInput.removeClass('d-none');
      }
    }
    $('body').on('change', '.js-secure-host-upload-type-field input', function (e) {
      e.preventDefault();
      var value = $(this).val();
      var $form = $(this).closest('.file-form');
      handleSecureHostUploadType($form, value);
    });
    $('body').on('click', '.js-save-file', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.file-form');
      handleFileFormSubmit(form, $this);
    });
    $('body').on('change', '.js-file-storage', function (e) {
      e.preventDefault();
      var value = this.value;
      var formGroup = $(this).closest('form');
      var fileType = formGroup.find('.js-ajax-file_type').val();
      handleShowFileInputsBySource(formGroup, value, fileType);
    });
    $('body').on('change', '.js-ajax-file_type', function (e) {
      e.preventDefault();
      var value = $(this).val();
      var formGroup = $(this).closest('form');
      var source = formGroup.find('.js-file-storage').val();
      handleShowFileInputsBySource(formGroup, source, value);
    });

    // Sessions
    $('body').on('change', '.js-api-input', function (e) {
      e.preventDefault();
      var sessionForm = $(this).closest('.session-form');
      var value = this.value;
      sessionForm.find('.js-zoom-not-complete-alert').addClass('d-none');
      sessionForm.find('.js-agora-chat-and-rec').addClass('d-none');
      if (value === 'big_blue_button') {
        sessionForm.find('.js-local-link').addClass('d-none');
        sessionForm.find('.js-api-secret').removeClass('d-none');
        sessionForm.find('.js-moderator-secret').removeClass('d-none');
      } else if (value === 'zoom') {
        sessionForm.find('.js-local-link').addClass('d-none');
        sessionForm.find('.js-api-secret').addClass('d-none');
        sessionForm.find('.js-moderator-secret').addClass('d-none');
        if (hasZoomApiToken && hasZoomApiToken !== 'true') {
          sessionForm.find('.js-zoom-not-complete-alert').removeClass('d-none');
        }
      } else if (value === 'agora') {
        sessionForm.find('.js-agora-chat-and-rec').removeClass('d-none');
        sessionForm.find('.js-api-secret').addClass('d-none');
        sessionForm.find('.js-local-link').addClass('d-none');
        sessionForm.find('.js-moderator-secret').addClass('d-none');
      } else if (value === 'jitsi') {
        sessionForm.find('.js-local-link').addClass('d-none');
        sessionForm.find('.js-api-secret').addClass('d-none');
        sessionForm.find('.js-moderator-secret').addClass('d-none');
      } else {
        sessionForm.find('.js-local-link').removeClass('d-none');
        sessionForm.find('.js-api-secret').removeClass('d-none');
        sessionForm.find('.js-moderator-secret').addClass('d-none');
      }
    });
    $('body').on('click', '.js-save-session', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.session-form');
      handleWebinarItemForm(form, $this);
    });
    $('body').on('click', '.js-session-has-ended', function () {
      $.toast({
        heading: requestFailedLang,
        text: thisLiveHasEndedLang,
        bgColor: '#f63c3c',
        textColor: 'white',
        hideAfter: 10000,
        position: 'bottom-right',
        icon: 'error'
      });
    });

    // Text lession
    $('body').on('click', '.js-save-text_lesson', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.text_lesson-form');
      handleWebinarItemForm(form, $this);
    });

    // assignments

    $('body').on('click', '.js-save-assignment', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $this.closest('.assignment-form');
      handleWebinarItemForm(form, $this);
    });
    $('body').on('click', '.assignment-attachments-add-btn', function (e) {
      var $container = $(this).closest('.js-assignment-attachments-items');
      var mainRow = $container.find('.assignment-attachments-main-row');
      var copy = mainRow.clone();
      copy.removeClass('assignment-attachments-main-row');
      copy.removeClass('d-none');
      var removeBtn = copy.find('.assignment-attachments-remove-btn');
      if (removeBtn) {
        removeBtn.removeClass('d-none');
      }
      var copyHtml = copy.prop('innerHTML');
      copyHtml = copyHtml.replaceAll('assignmentTemp', randomString());
      copyHtml = copyHtml.replaceAll('btn-primary', 'btn-danger');
      copyHtml = copyHtml.replaceAll('assignment-attachments-add-btn', 'assignment-attachments-remove-btn');
      copy.html(copyHtml);
      $container.append(copy);
    });
    $('body').on('click', '.assignment-attachments-remove-btn', function (e) {
      e.preventDefault();
      $(this).closest('.js-ajax-attachments').remove();
    });

    /*
    * ./ Contents
    * */

    $('body').on('click', '.cancel-accordion', function (e) {
      e.preventDefault();
      $(this).closest('.accordion-row').remove();
    });

    /**
     * add webinar prerequisites
     * */
    $('body').on('click', '#webinarAddPrerequisites', function (e) {
      e.preventDefault();
      var add_prerequisites_modal = '<div id="addPrerequisitesModal">';
      add_prerequisites_modal += $('#webinarPrerequisitesModal').html();
      add_prerequisites_modal += '</div>';
      add_prerequisites_modal = add_prerequisites_modal.replaceAll('prerequisites-select', 'prerequisites-select2');
      add_prerequisites_modal = add_prerequisites_modal.replaceAll('str_', '');
      Swal.fire({
        html: add_prerequisites_modal,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem',
        onOpen: function onOpen() {
          handleSearchableSelect2('prerequisites-select2', adminPanelPrefix + '/webinars/search', 'title');
        }
      });
    });
    $('body').on('click', '#savePrerequisites', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#addPrerequisitesModal .js-prerequisites-form');
      handleWebinarItemForm(form, $this);
    });

    /**
     * add webinar FAQ
     * */
    $('body').on('click', '#webinarAddFAQ', function (e) {
      e.preventDefault();
      var add_faq_modal = '<div id="addFAQsModal">';
      add_faq_modal += $('#webinarFaqModal').html();
      add_faq_modal += '</div>';
      Swal.fire({
        html: add_faq_modal,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem'
      });
    });
    $('body').on('click', '#saveFAQ', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#addFAQsModal .js-faq-form');
      handleWebinarItemForm(form, $this);
    });

    /*
    * add extra description
    * */
    $('body').on('click', '#add_new_learning_materials', function (e) {
      e.preventDefault();
      var key = randomString();
      var html = '<div id="extraDescriptionModal">';
      html += $('#extraDescriptionForm').html();
      html += '</div>';
      Swal.fire({
        html: html,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem',
        onOpen: function onOpen() {
          $('#extraDescriptionModal input[name="type"]').val('learning_materials');
        }
      });
    });
    function handleCompanyLogosInputHtml(key) {
      var html = '<div id="extraDescriptionModal">';
      html += $('#extraDescriptionForm').html();
      html += '</div>';
      var modalHtml = $(html);
      modalHtml.find('.js-form-groups').children().remove();
      modalHtml.find('.js-form-groups').append('<div class="form-group">\n' + '            <label class="input-label">image</label>\n' + '            <div class="input-group">\n' + '                <div class="input-group-prepend">\n' + '                    <button type="button" class="input-group-text admin-file-manager" data-input="image_' + key + '" data-preview="holder">\n' + '                        <i class="fa fa-upload"></i>\n' + '                    </button>\n' + '                </div>\n' + '                <input type="text" name="value" id="image_' + key + '" class="form-control"/>\n' + '            </div>\n' + '        </div>');
      var mainHtml = '<div id="extraDescriptionModal">';
      mainHtml += modalHtml.html();
      mainHtml += '</div>';
      return mainHtml;
    }
    $('body').on('click', '#add_new_company_logos', function (e) {
      e.preventDefault();
      var key = randomString();
      var html = handleCompanyLogosInputHtml(key);
      Swal.fire({
        html: html,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem',
        onOpen: function onOpen() {
          $('#extraDescriptionModal input[name="type"]').val('company_logos');
        }
      });
    });
    $('body').on('click', '#add_new_requirements', function (e) {
      e.preventDefault();
      var key = randomString();
      var html = '<div id="extraDescriptionModal">';
      html += $('#extraDescriptionForm').html();
      html += '</div>';
      Swal.fire({
        html: html,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem',
        onOpen: function onOpen() {
          $('#extraDescriptionModal input[name="type"]').val('requirements');
        }
      });
    });
    $('body').on('click', '#saveExtraDescription', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#extraDescriptionModal .js-form');
      handleWebinarItemForm(form, $this);
    });
    $('body').on('click', '.edit-extraDescription', function (e) {
      e.preventDefault();
      var $this = $(this);
      editExtraDescription($this);
    });
    $('body').on('change', '.js-edit-extraDescription-locale-ajax', function (e) {
      e.preventDefault();
      var $this = $(this);
      var locale = $this.val();
      editExtraDescription($this, locale);
    });
    function editExtraDescription($this, locale) {
      var item_id = $this.attr('data-item-id');
      var webinar_id = $this.attr('data-webinar-id');
      var rendomKey = randomString();
      var edit_data = {
        item_id: webinar_id,
        locale: locale
      };
      $.post(adminPanelPrefix + '/webinar-extra-description/' + item_id + '/edit', edit_data, function (result) {
        if (result && result.webinarExtraDescription) {
          var webinarExtraDescription = result.webinarExtraDescription;
          var html = '<div id="extraDescriptionModal">';
          html += $('#extraDescriptionForm').html();
          html += '</div>';
          if (webinarExtraDescription.type === 'company_logos') {
            html = handleCompanyLogosInputHtml(rendomKey);
          }
          html = html.replaceAll(adminPanelPrefix + '/webinar-extra-description/store', adminPanelPrefix + '/webinar-extra-description/' + item_id + '/update');
          Swal.fire({
            html: html,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              var $modal = $('#extraDescriptionModal');
              Object.keys(webinarExtraDescription).forEach(function (key) {
                $modal.find('[name="' + key + '"]').val(webinarExtraDescription[key]);
              });
              var localeSelect = $modal.find('select[name="locale"]');
              if (localeSelect) {
                localeSelect.addClass('js-edit-extraDescription-locale-ajax');
                localeSelect.attr('data-item-id', item_id);
                localeSelect.attr('data-webinar-id', webinar_id);
              }
            }
          });
        }
      });
    }

    /**
     * add webinar Quiz
     * */
    $('body').on('click', '#webinarAddQuiz', function (e) {
      var _this = this;
      e.preventDefault();
      var add_quiz_modal = '<div id="addQuizModal">';
      add_quiz_modal += $('#quizzesModal').html();
      add_quiz_modal += '</div>';
      add_quiz_modal = add_quiz_modal.replaceAll('quiz-select2', 'quiz-select22');
      Swal.fire({
        html: add_quiz_modal,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '30rem',
        onOpen: function onOpen() {
          $(".quiz-select22").select2({
            placeholder: $(_this).data('placeholder'),
            allowClear: true,
            width: '100%'
          });
        }
      });
    });
    $('body').on('click', '#saveQuiz', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#addQuizModal .js-form');
      handleWebinarItemForm(form, $this);
    });

    /*
    * edit ticket
    * */

    function editTicket($this) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var ticket_id = $this.attr('data-ticket-id');
      var webinar_id = $this.attr('data-webinar-id');
      var edit_data = {
        item_id: webinar_id,
        locale: locale
      };
      $.post(adminPanelPrefix + '/tickets/' + ticket_id + '/edit', edit_data, function (result) {
        if (result && result.ticket) {
          var ticket = result.ticket;
          var edit_ticket_modal = '<div id="addTicketModal">';
          edit_ticket_modal += $('#webinarTicketModal').html();
          edit_ticket_modal += '</div>';
          edit_ticket_modal = edit_ticket_modal.replaceAll(adminPanelPrefix + '/tickets/store', adminPanelPrefix + '/tickets/' + ticket_id + '/update');
          Swal.fire({
            html: edit_ticket_modal,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              $('.date-range-picker').daterangepicker({
                locale: {
                  format: 'YYYY-MM-DD'
                },
                drops: 'down',
                opens: 'right',
                startDate: moment(ticket.start_date * 1000).toDate(),
                endDate: moment(ticket.end_date * 1000).toDate()
              });
              delete ticket.start_date;
              delete ticket.end_date;
              Object.keys(ticket).forEach(function (key) {
                $('#addTicketModal').find('[name="' + key + '"]').val(ticket[key]);
              });
              var localeSelect = $('#addTicketModal').find('select[name="locale"]');
              if (localeSelect) {
                localeSelect.addClass('js-edit-ticket-locale-ajax');
                localeSelect.attr('data-ticket-id', ticket_id);
                localeSelect.attr('data-webinar-id', webinar_id);
              }
            }
          });
        }
      });
    }
    $('body').on('click', '.edit-ticket', function (e) {
      e.preventDefault();
      var $this = $(this);
      loadingSwl();
      editTicket($this);
    });
    $('body').on('change', '.js-edit-ticket-locale-ajax', function (e) {
      e.preventDefault();
      var $this = $(this);
      var locale = $this.val();
      editTicket($this, locale);
    });

    /*
    * edit session
    * */

    function editChapter($this) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var chapter_id = $this.attr('data-chapter-id');
      var webinar_id = $this.attr('data-webinar-id');
      var edit_data = {
        item_id: webinar_id,
        locale: locale
      };
      $.post(adminPanelPrefix + '/chapters/' + chapter_id + '/edit', edit_data, function (result) {
        if (result && result.chapter) {
          var chapter = result.chapter;
          var html = '<div id="editChapterModal">';
          html += $('#webinarChapterModal').html();
          html += '</div>';
          html = html.replaceAll(adminPanelPrefix + '/chapters/store', adminPanelPrefix + '/chapters/' + chapter_id + '/update');
          var nameId = randomString();
          html = html.replaceAll('record', nameId);
          Swal.fire({
            html: html,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              var $modal = $('#editChapterModal');
              Object.keys(chapter).forEach(function (key) {
                if (key === 'status') {
                  var checked = chapter.status === 'active';
                  $modal.find('[name="' + key + '"]').prop('checked', checked);
                } else if (key === 'check_all_contents_pass') {
                  var checkedAllContents = chapter.check_all_contents_pass && chapter.check_all_contents_pass !== "0";
                  $modal.find('[name="' + key + '"]').prop('checked', checkedAllContents);
                } else {
                  $modal.find('[name="' + key + '"]').val(chapter[key]);
                }
              });
              var localeSelect = $modal.find('select[name="locale"]');
              if (localeSelect) {
                localeSelect.addClass('js-edit-chapter-locale-ajax');
                localeSelect.attr('data-chapter-id', chapter_id);
                localeSelect.attr('data-webinar-id', webinar_id);
              }
            }
          });
        }
      });
    }
    $('body').on('click', '.edit-chapter', function (e) {
      e.preventDefault();
      var $this = $(this);
      loadingSwl();
      editChapter($this);
    });
    $('body').on('change', '.js-edit-chapter-locale-ajax', function (e) {
      e.preventDefault();
      var $this = $(this);
      var locale = $this.val();
      editChapter($this, locale);
    });

    /*
    * edit session
    * */

    function editSession($this) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var session_id = $this.attr('data-session-id');
      var webinar_id = $this.attr('data-webinar-id');
      var edit_data = {
        item_id: webinar_id,
        locale: locale
      };
      $.post(adminPanelPrefix + '/sessions/' + session_id + '/edit', edit_data, function (result) {
        if (result && result.session) {
          var session = result.session;
          var edit_session_modal = '<div id="addSessionModal">';
          edit_session_modal += $('#webinarSessionModal').html();
          edit_session_modal += '</div>';
          edit_session_modal = edit_session_modal.replaceAll(adminPanelPrefix + '/sessions/store', adminPanelPrefix + '/sessions/' + session_id + '/update');
          var nameId = randomString();
          edit_session_modal = edit_session_modal.replaceAll('record', nameId);
          Swal.fire({
            html: edit_session_modal,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              var $modal = $('#addSessionModal');
              var datetimepicker = $('.datetimepicker');
              datetimepicker.val(session.date);
              datetimepicker.daterangepicker({
                locale: {
                  format: 'YYYY-MM-DD HH:mm'
                },
                singleDatePicker: true,
                timePicker: true,
                timePicker24Hour: true
              });
              delete session.date;
              Object.keys(session).forEach(function (key) {
                if (key === 'session_api') {
                  var apiInput = $modal.find('.js-api-input[value="' + session[key] + '"]');
                  apiInput.prop('checked', true);
                  $modal.find('.js-api-input').prop('disabled', true);
                  if (session[key] !== 'local') {
                    $modal.find('.js-ajax-api_secret').prop('disabled', true);
                    $modal.find('.js-ajax-date').prop('disabled', true);
                    $modal.find('.js-ajax-duration').prop('disabled', true);
                    $modal.find('.js-ajax-link').prop('disabled', true);
                  }
                  if (session[key] === 'big_blue_button') {
                    $modal.find('.js-moderator-secret').removeClass('d-none');
                    $modal.find('.js-ajax-moderator_secret').prop('disabled', true);
                  } else if (session[key] === 'zoom') {
                    $modal.find('.js-local-link').addClass('d-none');
                    $modal.find('.js-api-secret').addClass('d-none');
                    $modal.find('.js-moderator-secret').addClass('d-none');
                  } else if (session[key] === 'agora') {
                    $modal.find('.js-agora-chat-and-rec').removeClass('d-none');
                    $modal.find('.js-api-secret').addClass('d-none');
                    $modal.find('.js-local-link').addClass('d-none');
                    $modal.find('.js-moderator-secret').addClass('d-none');
                  }
                } else if (key === 'status') {
                  var checked = session.status === 'active';
                  $modal.find('[name="' + key + '"]').prop('checked', checked);
                } else if (key === 'check_previous_parts' || key === 'access_after_day') {
                  var sequenceContentSwitchChecked = session.check_previous_parts || session.access_after_day !== null;
                  if (sequenceContentSwitchChecked) {
                    $modal.find('.js-sequence-content-switch').prop('checked', true);
                    $modal.find('[name="check_previous_parts"]').prop('checked', session.check_previous_parts);
                    $modal.find('[name="access_after_day"]').val(session.access_after_day);
                    $modal.find('.js-sequence-content-inputs').removeClass('d-none');
                  }
                } else if (key === 'agora_settings') {
                  var agora_settings = JSON.parse(session.agora_settings);
                  if (agora_settings && agora_settings['chat'] && (agora_settings['chat'] === true || agora_settings['chat'] === 'true')) {
                    $modal.find('[name="agora_chat"]').prop('checked', true);
                  }
                  if (agora_settings && agora_settings['record'] && (agora_settings['record'] === true || agora_settings['record'] === 'true')) {
                    $modal.find('[name="agora_record"]').prop('checked', true);
                  }
                } else {
                  $modal.find('[name="' + key + '"]').val(session[key]);
                }
              });
              var localeSelect = $modal.find('select[name="locale"]');
              if (localeSelect) {
                localeSelect.addClass('js-edit-session-locale-ajax');
                localeSelect.attr('data-session-id', session_id);
                localeSelect.attr('data-webinar-id', webinar_id);
              }
            }
          });
        }
      });
    }
    $('body').on('click', '.edit-session', function (e) {
      e.preventDefault();
      var $this = $(this);
      loadingSwl();
      editSession($this);
    });
    $('body').on('change', '.js-edit-session-locale-ajax', function (e) {
      e.preventDefault();
      var $this = $(this);
      var locale = $this.val();
      editSession($this, locale);
    });
    $('body').on('change', '.js-video-demo-source', function (e) {
      e.preventDefault();
      var value = $(this).val();
      var $otherSources = $('.js-video-demo-other-inputs');
      var $secureHostSource = $('.js-video-demo-secure-host-input');
      if (value === "secure_host") {
        $otherSources.addClass('d-none');
        $secureHostSource.removeClass('d-none');
      } else {
        $otherSources.removeClass('d-none');
        $secureHostSource.addClass('d-none');
        var $filePathUploadButton = $('.js-video-demo-path-input .js-video-demo-path-upload');
        var $filePathLinkButton = $('.js-video-demo-path-input .js-video-demo-path-links');
        var $filePathInput = $('.js-video-demo-path-input input');
        $filePathUploadButton.addClass('d-none');
        $filePathLinkButton.addClass('d-none');
        if (value === 'upload') {
          $filePathUploadButton.removeClass('d-none');
        } else {
          $filePathLinkButton.removeClass('d-none');
        }
        if (videoDemoPathPlaceHolderBySource) {
          $filePathInput.attr('placeholder', videoDemoPathPlaceHolderBySource[value]);
        }
      }
    });

    /*
    * edit prerequisites
    * */
    $('body').on('click', '.edit-prerequisite', function (e) {
      e.preventDefault();
      var $this = $(this);
      var prerequisite_id = $this.attr('data-prerequisite-id');
      var webinar_id = $this.attr('data-webinar-id');
      loadingSwl();
      var edit_data = {
        item_id: webinar_id
      };
      $.post(adminPanelPrefix + '/prerequisites/' + prerequisite_id + '/edit', edit_data, function (result) {
        if (result && result.prerequisite) {
          var prerequisite = result.prerequisite;
          var edit_prerequisite_modal = '<div id="addPrerequisitesModal">';
          edit_prerequisite_modal += $('#webinarPrerequisitesModal').html();
          edit_prerequisite_modal += '</div>';
          edit_prerequisite_modal = edit_prerequisite_modal.replaceAll('prerequisites-select', 'prerequisites-select2');
          edit_prerequisite_modal = edit_prerequisite_modal.replaceAll(adminPanelPrefix + '/prerequisites/store', adminPanelPrefix + '/prerequisites/' + prerequisite_id + '/update');
          edit_prerequisite_modal = edit_prerequisite_modal.replaceAll('str_', '');
          Swal.fire({
            html: edit_prerequisite_modal,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              $('.prerequisites-select2').append('<option selected="selected" value="' + prerequisite.webinar_id + '">' + prerequisite.webinar_title + '</option>');
              if (prerequisite.required === 1) {
                $('#addPrerequisitesModal').find('[name="required"]').prop('checked', true);
              }
              handleSearchableSelect2('prerequisites-select2', adminPanelPrefix + '/webinars/search', 'title');
            }
          });
        }
      });
    });

    /*
    * edit FAQ
    * */
    function editFaq($this) {
      var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var faq_id = $this.attr('data-faq-id');
      var webinar_id = $this.attr('data-webinar-id');
      var edit_data = {
        item_id: webinar_id,
        locale: locale
      };
      $.post(adminPanelPrefix + '/faqs/' + faq_id + '/edit', edit_data, function (result) {
        if (result && result.faq) {
          var faq = result.faq;
          var edit_faq_modal = '<div id="addFAQsModal">';
          edit_faq_modal += $('#webinarFaqModal').html();
          edit_faq_modal += '</div>';
          edit_faq_modal = edit_faq_modal.replaceAll(adminPanelPrefix + '/faqs/store', adminPanelPrefix + '/faqs/' + faq_id + '/update');
          Swal.fire({
            html: edit_faq_modal,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              var $modal = $('#addFAQsModal');
              Object.keys(faq).forEach(function (key) {
                $modal.find('[name="' + key + '"]').val(faq[key]);
              });
              var localeSelect = $modal.find('select[name="locale"]');
              if (localeSelect) {
                localeSelect.addClass('js-edit-faq-locale-ajax');
                localeSelect.attr('data-faq-id', faq_id);
                localeSelect.attr('data-webinar-id', webinar_id);
              }
            }
          });
        }
      });
    }
    $('body').on('click', '.edit-faq', function (e) {
      e.preventDefault();
      var $this = $(this);
      loadingSwl();
      editFaq($this);
    });
    $('body').on('change', '.js-edit-faq-locale-ajax', function (e) {
      e.preventDefault();
      var $this = $(this);
      var locale = $this.val();
      editFaq($this, locale);
    });
    $('body').on('click', '.js-get-faq-description', function (e) {
      e.preventDefault();
      var $this = $(this);
      var answer = $this.parent().find('input').val();
      var html = '<div class="my-2">' + answer + '</div>';
      Swal.fire({
        html: html,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '30rem'
      });
    });

    /*
    * edit FAQ
    * */
    $('body').on('click', '.edit-webinar-quiz', function (e) {
      e.preventDefault();
      var $this = $(this);
      var webinar_quiz_id = $this.attr('data-webinar-quiz-id');
      var webinar_id = $this.attr('data-webinar-id');
      loadingSwl();
      var edit_data = {
        item_id: webinar_id
      };
      $.post(adminPanelPrefix + '/webinar-quiz/' + webinar_quiz_id + '/edit', edit_data, function (result) {
        var _this2 = this;
        if (result && result.webinarQuiz) {
          var webinar_quiz = result.webinarQuiz;
          var edit_webinar_quiz_modal = '<div id="addQuizModal">';
          edit_webinar_quiz_modal += $('#quizzesModal').html();
          edit_webinar_quiz_modal += '</div>';
          edit_webinar_quiz_modal = edit_webinar_quiz_modal.replaceAll(adminPanelPrefix + '/webinar-quiz/store', adminPanelPrefix + '/webinar-quiz/' + webinar_quiz_id + '/update');
          edit_webinar_quiz_modal = edit_webinar_quiz_modal.replaceAll('quiz-select2', 'quiz-select22');
          Swal.fire({
            html: edit_webinar_quiz_modal,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '30rem',
            onOpen: function onOpen() {
              $('.quiz-select22').append('<option selected="selected" value="' + webinar_quiz.id + '">' + webinar_quiz.title + '</option>');
              $(".quiz-select22").select2({
                placeholder: $(_this2).data('placeholder'),
                allowClear: true,
                width: '100%'
              });
              $('#addQuizModal').find('[name="chapter_id"]').val(webinar_quiz.chapter_id);
            }
          });
        }
      });
    });

    /*
    * ./
    * */

    $('body').on('change', 'select[name="type"]', function () {
      var value = this.value;
      var webinarItem = ['capacity', 'start_date'];
      var show = true;
      if (value !== 'webinar') {
        show = false;
      }
      for (var _i = 0, _webinarItem = webinarItem; _i < _webinarItem.length; _i++) {
        var item = _webinarItem[_i];
        if (show) {
          $('.js-' + item).removeClass('d-none');
        } else {
          $('.js-' + item).addClass('d-none');
        }
      }
    });
    $('body').on('change', '.js-sequence-content-switch', function () {
      var parent = $(this).closest('.js-content-form');
      var sequenceContentInputs = parent.find('.js-sequence-content-inputs');
      sequenceContentInputs.addClass('d-none');
      if (this.checked) {
        sequenceContentInputs.removeClass('d-none');
      }
    });
    $('body').on('click', '#bundleAddNewCourses', function (e) {
      e.preventDefault();
      var html = '<div id="addBundleWebinarModal">';
      html += $('#bundleWebinarsModal').html();
      html += '</div>';
      html = html.replaceAll('bundleWebinars-select', 'bundleWebinars-select2');
      html = html.replaceAll('str_', '');
      Swal.fire({
        html: html,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          content: 'p-0 text-left'
        },
        width: '48rem',
        onOpen: function onOpen() {
          handleSearchableSelect2('bundleWebinars-select2', adminPanelPrefix + '/webinars/search', 'title');
        }
      });
    });
    $('body').on('click', '#saveBundleWebinar', function (e) {
      e.preventDefault();
      var $this = $(this);
      var form = $('#addBundleWebinarModal .js-form');
      handleWebinarItemForm(form, $this);
    });
    $('body').on('click', '.edit-bundle-webinar', function (e) {
      e.preventDefault();
      var $this = $(this);
      var item_id = $this.attr('data-item-id');
      var bundle_id = $this.attr('data-bundle-id');
      loadingSwl();
      var edit_data = {
        item_id: bundle_id
      };
      $.post(adminPanelPrefix + '/bundle-webinars/' + item_id + '/edit', edit_data, function (result) {
        if (result && result.bundleWebinar) {
          var bundleWebinar = result.bundleWebinar;
          var selectHtml = "<option value=\"".concat(bundleWebinar.webinar_id, "\" selected>").concat(bundleWebinar.webinar_title, "</option>");
          $('#bundleWebinarsModal .bundleWebinars-select').html(selectHtml);
          var html = '<div id="addBundleWebinarModal">';
          html += $('#bundleWebinarsModal').html();
          html += '</div>';
          html = html.replaceAll('bundleWebinars-select', 'bundleWebinars-select2');
          html = html.replaceAll(adminPanelPrefix + '/bundle-webinars/store', adminPanelPrefix + '/bundle-webinars/' + item_id + '/update');
          html = html.replaceAll('str_', '');
          Swal.fire({
            html: html,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: {
              content: 'p-0 text-left'
            },
            width: '48rem',
            onOpen: function onOpen() {
              handleSearchableSelect2('bundleWebinars-select2', adminPanelPrefix + '/webinars/search', 'title');
            }
          });
        }
      });
    });
    $('body').on('change', '.js-interactive-type', function () {
      var fileForm = $(this).closest('.file-form');
      var $fileName = fileForm.find('.js-interactive-file-name-input');
      $fileName.addClass('d-none');
      if ($(this).val() === 'custom') {
        $fileName.removeClass('d-none');
      }
    });

    /* feather icons */
    // **
    // **
    feather.replace();
  })(jQuery);
  /******/
})()
  ;
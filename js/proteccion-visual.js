/* Protección disuasoria selectiva de recursos visuales. No impide capturas ni acceso a archivos de red. */
(function () {
  'use strict';
  function isVisualTarget(target) {
    return target instanceof Element && Boolean(target.closest('img, video, picture'));
  }
  document.addEventListener('contextmenu', function (event) {
    if (isVisualTarget(event.target)) event.preventDefault();
  }, { capture: true });
  document.addEventListener('dragstart', function (event) {
    if (isVisualTarget(event.target)) event.preventDefault();
  }, { capture: true });
})();

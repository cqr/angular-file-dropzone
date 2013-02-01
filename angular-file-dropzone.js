angular.module('fileDropzone', []).directive('fileDropzone', function ($compile) {
    var overlayTemplateLinker;
    function linker(scope, element, attrs) {
            var parentScope = scope,
                scope = scope.$root.$new(true),
                overlay;
            scope.overlayText = attrs.dropzoneContent;
            scope.files = parentScope.$eval(attrs.fileDropzone);
            scope.overlayVisible = false;
            scope.overlayStyle = {
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.8)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                textAlign: 'center',
                color: '#FFF'
            };
        
            overlayTemplateLinker(scope, function(overlayElement) {
                overlay = overlayElement;
                element.append(overlay);
            });
            
            attrs.$observe('dropzoneContent', function (text) {
                if (typeof text !== 'undefined') {
                   scope.overlayText = text;
                } else {
                    scope.overlayText = "Drop file here to upload.";
                }
            });
            
            parentScope.$watch(attrs.fileDropzone, function (val) {
                if (typeof val === 'undefined') {
                    parentScope[attrs.fileDropzone] = [];
                    scope.files = [];
                } else {
                    scope.files = val;
                }
            });
            
            scope.$watch('files', function (val) {
                parentScope[attrs.fileDropzone] = val;
            });
            
            if (element.css('position') == 'static') element.css({'position':'relative'});
            
            function _showOverlay(e) {
                stopEvent(e);
                scope.$apply(function (scope) {
                    scope.overlayVisible = true;
                });
            }

            function _hideOverlay(e) {
                stopEvent(e);
                scope.$apply(function (scope) {
                    scope.overlayVisible = false;
                });
            }

            function _drop(e) {
                _hideOverlay(e);
                scope.$apply(function (scope) {
                    angular.forEach(e.originalEvent.dataTransfer.files, function (file) {
                        scope.files.push(file);
                    });
                });
            }

            function stopEvent(e) {
                if (e) {
                    if (e.stopPropagation) e.stopPropagation();
                    if (e.preventDefault) e.preventDefault();
                }
            }

            element.bind('dragenter', _showOverlay);
            element.bind('dragover', _showOverlay);
            overlay.bind('dragleave', _hideOverlay);
            element.bind('drop', _drop);
        }
    return {
        compile: function () {
            overlayTemplateLinker = $compile("<div class='file-drop-zone-overlay' ng-show='overlayVisible' ng-style='overlayStyle'>{{overlayText}}</div>");
            return linker;
        }
    };
});

;(function(){
  'use strict';
  // Core module config
  angular
    .module('core')
    .config( Configuration )
    .config( TranslateProvide );

  /* @inject */
  function Configuration($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
    // lazy controller, directive and service
    app.controller = $controllerProvider.register;
    app.directive  = $compileProvider.directive;
    app.filter     = $filterProvider.register;
    app.factory    = $provide.factory;
    app.service    = $provide.service;
    app.constant   = $provide.constant;
    app.value      = $provide.value;
  }
   /* @inject */
  function TranslateProvide($translateProvider) {
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }
}).call(this);
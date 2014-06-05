/*!
 * devizr asset manager {{VERSION}}
 * http://devizr.net
 * Copyright (c) 2013, {{YEAR}} Uli Preuss
 * https://raw.githubusercontent.com/up/devizr/master/LICENSE
 */

/*jshint browser:true */
/*global define:true */

(function(window, document, navigator) {
  "use strict";

  var devizr = (function(){

    var viewport = { width: window.innerWidth, height: window.innerHeight },
      stylesLoaded = false, 
      support = [],
      env = [],
      cache = [],
      test, tests = {};
      
//{{DEVIZR-TESTS}}
        
    function DevizrError(message) {
      this.name = "Devizr Error";
      this.message = message || "";
    }
    DevizrError.prototype = new Error();
    DevizrError.prototype.constructor = DevizrError;

    function addTest(id, test_fn) {
      tests[id] = test_fn;
    }
    
    function detectJSFeaturesInIframe() {
    
      var prefixes = ["moz", "Moz", "webkit", "WebKit", "ms", "MS", "o", "O"],
          body = document.getElementsByTagName('body')[0],
          iframe = document.createElement('iframe');

      iframe.width = '1';
      iframe.height = '1';
      iframe.style.visibility = 'hidden'; 
      body.appendChild(iframe);
  
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      function getIframeInterfaces(iface){
        if(typeof iface === 'string') {
          return iframe.contentDocument.createElement(iface);
        }
        switch(iface){
        case window : return iframe.contentWindow;
        case document : return iframe.contentDocument;
        case document.documentElement : return iframe.contentDocument.documentElement;
        case navigator : return iframe.contentWindow.navigator;
        case screen : return iframe.contentWindow.screen;
        }  
      }

      test = function(iface, prop, prefixed){
        
        var i, prefixedProp, result = false,
            re, useragent = window.navigator.userAgent.toLowerCase();

        if(arguments.length === 1) {

          re = new RegExp(arguments[0], 'i');
          return re.test(useragent);
        
        } else {
        
          iface = getIframeInterfaces(iface);

          if(prefixed) {
            for(i = 0; i < prefixes.length; i++) {
              prefixedProp = prefixes[i] + capitaliseFirstLetter(prop);
              if( prefixedProp in iface) {
                result = true;
              }
            }    
          }
    
          if(prop in iface) {
            result = true;
          }
    
          return result;
        }
              
      };

      for(var name in tests) {
        if(typeof tests[name] === 'function') {
          if(tests[name]()) {
            if(name === name.toUpperCase()) {
              env.push(name);        
            } else {
              support.push(name);        
            }
          }
        }
        else {
          throw new DevizrError("Invalid test - '" + name + "' is not a function!");
        }
      }

      iframe.onload = function(){
        body.removeChild(iframe);
      };

    }
   
    function preCheck(breakpoints){
    
      var len, i = 0, width, addons, item, addon, breakpoint, matchedBreakpoint = 0;
    
      if(is(breakpoints, "Array")) {
        len = breakpoints.length;
        for( ; i < len; i++) {
          width = breakpoints[i].width;
          if(!width) {
            width = 0;
          }
          if(viewport.width > width > matchedBreakpoint) {
            matchedBreakpoint = i;
          }      
        }
        breakpoint = breakpoints[matchedBreakpoint];
      } else if(is(breakpoints, "Object")) {
        breakpoint = breakpoints;
      } else {
        throw new Error("devizr: Object or Array required!");
      }
    
      addons = breakpoint.addons;
      for(item in addons) {
        if(addons.hasOwnProperty(item)) {
          addon = addons[item];
          if(addon.script) {
            loadScript(addon);
          }
          if(addon.style) {
            addon.stylesRequired = true;
            loadStylesheet(addon);
          }
        }
       }
    
    }

    function is(obj, type){
      return Object.prototype.toString.call(obj) === '[object ' + type + ']';      
    }
  
    function supports(feature){
      return !!~support.indexOf(feature);
    }
  
    function runTestsAndSelectAssets(addon, type){
      var tests = addon.tests,
        testsPassed = true,
        i = 0;
    
      if(typeof tests === 'string') {
        tests = [tests];
      }
    
      if(tests) {
        for( ; i < tests.length; i++) {
          if(tests[i][0] === '!') {
            if(supports(tests[i].substring(1))) {
              testsPassed = false;
            }          
          } else {
            if(!supports(tests[i])) {
              testsPassed = false;
            }
          }
        }                
      }
  
      if(testsPassed) {
        return addon[type];
      }
    
    }

    function loadScript(addon) {
      var script, firstScript, ival;
    
      addon.script = runTestsAndSelectAssets(addon, "script");

      if(!addon.script || !!~cache.indexOf(addon.script)) {
        return;
      }
    
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = addon.script;
      script.async = true;
      script.onload = function(){
        cache.push(addon.script);  
        if(addon.complete) {
          if(addon.stylesRequired) {
            ival = setInterval(function() {
              if (stylesLoaded) {
                clearInterval(ival);
                addon.complete();
              }
            }, 10);
          } else {
            addon.complete();
          }        
        }
      };
      firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  
    function loadStylesheet(addon) {
      var style, css, head, http = new XMLHttpRequest();
    
      addon.style = runTestsAndSelectAssets(addon, "style");
      if(!addon.style || !!~cache.indexOf(addon.style)) {
        return;
      }
      cache.push(addon.style);

      http.open("GET", addon.style);
      http.onreadystatechange = function() {
        if (http.readyState === 4) {
          style = document.createElement("style");
          style.type = "text/css";
          css = http.responseText;
          if (style.styleSheet){
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }
          head = document.getElementsByTagName("head")[0];
          head.appendChild(style);
          stylesLoaded = true;
        }
      };
      http.send(null);
    }
  
    return {
      version: '{{VERSION}}',
      load : preCheck,
      features: support,
      env: env,
      feature: supports,
      tests: tests,
      cache : cache,
      addTest: addTest,
      init: detectJSFeaturesInIframe
    };
    
  }());

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return devizr;
    });
  }
  else {
    window.devizr = devizr;
    // init detection
  }

}(window, document, navigator));

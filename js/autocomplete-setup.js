/* Copyright (c) 2010-2016 Marcus Westin */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.store = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;u>r;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;u>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i),o&&f.push(quote(n)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b"," ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

},{}],2:[function(require,module,exports){
require("./json2"),module.exports=require("./store");
},{"./json2":1,"./store":3}],3:[function(require,module,exports){
(function (global){
"use strict";module.exports=function(){function e(){try{return o in n&&n[o]}catch(e){return!1}}var t,r={},n="undefined"!=typeof window?window:global,i=n.document,o="localStorage",a="script";if(r.disabled=!1,r.version="1.3.20",r.set=function(e,t){},r.get=function(e,t){},r.has=function(e){return void 0!==r.get(e)},r.remove=function(e){},r.clear=function(){},r.transact=function(e,t,n){null==n&&(n=t,t=null),null==t&&(t={});var i=r.get(e,t);n(i),r.set(e,i)},r.getAll=function(){},r.forEach=function(){},r.serialize=function(e){return JSON.stringify(e)},r.deserialize=function(e){if("string"==typeof e)try{return JSON.parse(e)}catch(t){return e||void 0}},e())t=n[o],r.set=function(e,n){return void 0===n?r.remove(e):(t.setItem(e,r.serialize(n)),n)},r.get=function(e,n){var i=r.deserialize(t.getItem(e));return void 0===i?n:i},r.remove=function(e){t.removeItem(e)},r.clear=function(){t.clear()},r.getAll=function(){var e={};return r.forEach(function(t,r){e[t]=r}),e},r.forEach=function(e){for(var n=0;n<t.length;n++){var i=t.key(n);e(i,r.get(i))}};else if(i&&i.documentElement.addBehavior){var c,u;try{u=new ActiveXObject("htmlfile"),u.open(),u.write("<"+a+">document.w=window</"+a+'><iframe src="/favicon.ico"></iframe>'),u.close(),c=u.w.frames[0].document,t=c.createElement("div")}catch(l){t=i.createElement("div"),c=i.body}var f=function(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(t),c.appendChild(t),t.addBehavior("#default#userData"),t.load(o);var i=e.apply(r,n);return c.removeChild(t),i}},d=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g"),s=function(e){return e.replace(/^d/,"___$&").replace(d,"___")};r.set=f(function(e,t,n){return t=s(t),void 0===n?r.remove(t):(e.setAttribute(t,r.serialize(n)),e.save(o),n)}),r.get=f(function(e,t,n){t=s(t);var i=r.deserialize(e.getAttribute(t));return void 0===i?n:i}),r.remove=f(function(e,t){t=s(t),e.removeAttribute(t),e.save(o)}),r.clear=f(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(o);for(var r=t.length-1;r>=0;r--)e.removeAttribute(t[r].name);e.save(o)}),r.getAll=function(e){var t={};return r.forEach(function(e,r){t[e]=r}),t},r.forEach=f(function(e,t){for(var n,i=e.XMLDocument.documentElement.attributes,o=0;n=i[o];++o)t(n.name,r.deserialize(e.getAttribute(n.name)))})}try{var v="__storejs__";r.set(v,v),r.get(v)!=v&&(r.disabled=!0),r.remove(v)}catch(l){r.disabled=!0}return r.enabled=!r.disabled,r}();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});

!function(e){"use strict";var n=function(e,t){var r=/[^\w\-\.:]/.test(e)?new Function(n.arg+",tmpl","var _e=tmpl.encode"+n.helper+",_s='"+e.replace(n.regexp,n.func)+"';return _s;"):n.cache[e]=n.cache[e]||n(n.load(e));return t?r(t,n):function(e){return r(e,n)}};n.cache={},n.load=function(e){return document.getElementById(e).innerHTML},n.regexp=/([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g,n.func=function(e,n,t,r,c,u){return n?{"\n":"\\n","\r":"\\r","  ":"\\t"," ":" "}[n]||"\\"+n:t?"="===t?"'+_e("+r+")+'":"'+("+r+"==null?'':"+r+")+'":c?"';":u?"_s+='":void 0},n.encReg=/[<>&"'\x00]/g,n.encMap={"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"},n.encode=function(e){return(null==e?"":""+e).replace(n.encReg,function(e){return n.encMap[e]||""})},n.arg="o",n.helper=",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}","function"==typeof define&&define.amd?define(function(){return n}):"object"==typeof module&&module.exports?module.exports=n:e.tmpl=n}(this);

var UP = 'up';
var DOWN = 'down';
var MAX_NUM_RESULTS = 5;
var RESULT_LIMITS = {
  tags: 1000,
  categories: 1000,
  for_tenants: 5,
  for_landlords: 5
};

var showing_suggested_terms = false;

var tags_idx;
var categories_idx;
var for_landlords_idx;
var for_landlords_idx;

var autocomplete_data = {};

var autocomplete_suggestions = {
  tags: '',
  categories: '',
  for_tenants: '',
  for_landlords: ''
};

var number_of_matches = 0;

var search_input_selector = '#search-input';


(function($){
  $(document).ready(function() {

    function show_suggested_terms() {
      if( !showing_suggested_terms ) {
        showing_suggested_terms = true;
        $('#tag-results').empty().append(autocomplete_suggestions.tags);
        $('#category-results').empty().append(autocomplete_suggestions.categories);
        $('#for-tenants-results').empty().append(autocomplete_suggestions.for_tenants);
        $('#for-landlords-results').empty().append(autocomplete_suggestions.for_landlords);

        $('#terms-results-label').text('Suggested Terms');
        $('#topics-results-label').text('Suggested Topics');
      }
    }


    function add_suggested_search_terms() {
      $(autocomplete_data.suggestions.tags).each(function(index, tag){
        autocomplete_suggestions.tags = autocomplete_suggestions.tags + tmpl('autocomplete-template-tags', tag);
      })

      $(autocomplete_data.suggestions.categories).each(function(index, category){
        autocomplete_suggestions.categories = autocomplete_suggestions.categories + tmpl('autocomplete-template-categories', category);
      })


      autocomplete_suggestions.for_tenants = '<div class="count">Suggested Tips</div>';
      $(autocomplete_data.suggestions.for_tenants).each(function(index, post){
        autocomplete_suggestions.for_tenants = autocomplete_suggestions.for_tenants + tmpl('autocomplete-template-for-tenants', post);
      })

       autocomplete_suggestions.for_landlords = '<div class="count">Suggested Tips</div>';
      $(autocomplete_data.suggestions.for_landlords).each(function(index, post){
        autocomplete_suggestions.for_landlords = autocomplete_suggestions.for_landlords + tmpl('autocomplete-template-for-landlords', post);
      })
    }

    function autocomplete_init() {

      console.log(autocomplete_base_url.base_url);

      $(search_input_selector).focusin(function(){
        $('#autocomplete-overlay').addClass('visible');
        $('#search-section').addClass('active');
        $('body').addClass('autocomplete-active');
      });

      $('#search-section input, #autocomplete, #search-section button').click(function(e){
        e.stopPropagation();
      })


      $('#autocomplete-overlay, #search-section').click(function() {
        $('#autocomplete-overlay').removeClass('visible');
        $('#search-section').removeClass('active');
        $('body').removeClass('autocomplete-active');
      })

      // Show suggestions when the search result becomes empty (ignoring whitespace)
      $(search_input_selector).on('input focusin focusout change',function(e){
        var value = $(this).val();
        if( $(this).val().trim() == '' || value.length < 1) {
          show_suggested_terms();
        }
      });




      autocomplete_data = store.get('autocomplete_data');//autocomplete_data_json;
      add_suggested_search_terms();
      setup_lunr_engines();
    }

    function setup_lunr_engines() {
      setup_tags();
      setup_categories();
      setup_for_tenants();
      setup_for_landlords();

      setup_input();
    }

    function updateHighlight(upOrDown) {
      var num_results = $('#autocomplete .search-result').size();
      var current_index = 0;
      var $search_results = $('#autocomplete .search-result');
      var has_highlighted = false;

      $('#autocomplete .search-result').each(function(index, search_result){
        if( $(search_result).hasClass('highlight') ) {
          has_highlighted = true;
          current_index = index;
        }
      });

      if(upOrDown === UP) {
        if( has_highlighted == false ) {
          current_index = num_results - 1;
        } else {
          current_index--;
          if( current_index < 0 ){ //= (num_results - 1) ){
            current_index = num_results - 1;
          }
        }
      } else if( upOrDown === DOWN ) {
        if( has_highlighted == true ) {
          current_index++;
          if( current_index > (num_results - 1) ) {
            current_index = 0;
          }
        }
      }

      $('#autocomplete .search-result.highlight').removeClass('highlight');
      $('#autocomplete .search-result').each(function(index, result){
        if(index === current_index) {
          $(result).addClass('highlight');
        }
      })
    }


    function setup_tags() {
      tags_idx = lunr(function () {
        this.field('search-tags', {boost: 50})
        this.field('name', {boost: 100})
        this.pipeline.remove(lunr.stopWordFilter)
        this.pipeline.remove(lunr.stemmer)
      })

      var num_tags = 0;
      $(autocomplete_data.tags).each(function(i, tag){
        tag['id'] = num_tags;
        tag['search-tags'] = tag['name'].split(/[ ,]+/).filter(Boolean);
        num_tags++;
        tags_idx.add(tag);
      })
    }

    function setup_categories() {
      categories_idx = lunr(function() {
        this.field('search-categories', {boost: 100})
        this.field('name', {boost: 1000})
        this.pipeline.remove(lunr.stopWordFilter)
        this.pipeline.remove(lunr.stemmer)
      });

      var num_categories = 0;
      $(autocomplete_data.categories).each(function(i, category){
        category['id'] = num_categories;
        category['search-categories'] = category['name'].split(/[ ,]+/).filter(Boolean);
        num_categories++;
        categories_idx.add(category);
      })
    }

    function setup_for_tenants() {
      for_tenants_idx = lunr(function() {
        this.field('search-for-tenants', {boost: 50})
        this.field('title', {boost: 100})
        this.field('content', {boost: 100})
        this.field('tags', {boost: 3000})
        this.pipeline.remove(lunr.stopWordFilter)
        this.pipeline.remove(lunr.stemmer)
      });

      var num_for_tenants = 0;
      $(autocomplete_data.for_tenants).each(function(i, post){
        post['id'] = num_for_tenants;
        post['search-for-tenants'] = post['title'].split(/[ ,]+/).filter(Boolean);
        num_for_tenants++;
        for_tenants_idx.add(post);
      })
    }

    function setup_for_landlords() {
      for_landlords_idx = lunr(function() {
        this.field('search-for-landlords', {boost: 50})
        this.field('title', {boost: 100})
        this.field('content', {boost: 100})
        this.field('tags', {boost: 3000})
        this.pipeline.remove(lunr.stopWordFilter)
        this.pipeline.remove(lunr.stemmer)
      });

      var num_for_landlords = 0;
      $(autocomplete_data.for_landlords).each(function(i, post){
        post['id'] = num_for_landlords;
        post['search-for-landlords'] = post['title'].split(/[ ,]+/).filter(Boolean);
        num_for_landlords++;
        for_landlords_idx.add(post);
      })
    }



    function do_button_functionality() {
      $('#autocomplete-button-wrapper').empty();

      var tag_results = tags_idx.search( $(search_input_selector).val() );
      var categories_results = categories_idx.search( $(search_input_selector).val() );
      var for_tenants_results = for_tenants_idx.search( $(search_input_selector).val() );
      var for_landlords_results = for_landlords_idx.search( $(search_input_selector).val() );

      if( $(search_input_selector).val().trim().length > 0 ) {
        $('#autocomplete-button-wrapper').append(
          $('<a>').addClass('btn btn-lg').attr('href', 'http://dev.partnerandpartners.com/housingcourtanswers/?s=' + encodeURIComponent( $(search_input_selector).val() ) ).text('See All Results')
        )
      }
    }



    function setup_input() {
      $(search_input_selector).on('input', function(e) {

        if( $(search_input_selector).val().trim().length < 1 ) {
          show_suggested_terms()

          $('#terms-results-label').text('Glossary Terms');
          $('#topics-results-label').text('Topics');
        } else {

          showing_suggested_terms = false;


          // TAGS
          $('#tag-results').empty();
          var results = tags_idx.search( $(this).val() );
          $(results).each(function(index, result){
            $(autocomplete_data.tags).each(function(tagIndex, tag){
              if( result.ref == tag.id ) {
                var t = tmpl('autocomplete-template-tags', tag);
                $('#tag-results').append( t );
              }
            })
          })

          if( results.length == 0 ) {
            $('#terms-results-label').text( '0 Matched Terms' );
          } else if( results.length == 1 ) {
            $('#terms-results-label').text( '1 Matched Term' );
          } else {
            $('#terms-results-label').text( results.length + ' Matched Terms' );
          }


          $('#category-results').empty();
          results = categories_idx.search( $(this).val() );
          $(results).each(function(index, result){
            $(autocomplete_data.categories).each(function(categoryIndex, category){
              if( result.ref == category.id ) {
                var t = tmpl('autocomplete-template-categories', category);
                $('#category-results').append( t );
              }
            })
          })


          if( results.length == 1 ) {
            $('#topics-results-label').text( '1 Matched Topic' );
          } else {
            $('#topics-results-label').text( results.length + ' Matched Topics' );
          }



          $('#for-tenants-results').empty();
          results = for_tenants_idx.search( $(this).val() );

          if( results.length == 1 ) {
            $('#for-tenants-results').append('<div class="count">' + results.length + ' Tips</div>');
          } else {
            $('#for-tenants-results').append('<div class="count">' + results.length + ' Tips</div>');
          }

          var num_for_tenants_added = 0;

          $(results).each(function(index, result){
            $(autocomplete_data.for_tenants).each(function(postIndex, post){
              if( result.ref == post.id ) {
                // $('#for-tenants-results').append($('<div class="search-result">').text(post.title));
                if( num_for_tenants_added < RESULT_LIMITS.for_tenants ) {
                  var t = tmpl('autocomplete-template-for-tenants', post);
                  $('#for-tenants-results').append( t );
                }

                num_for_tenants_added++;
              }
            })
          })


          $('#for-landlords-results').empty();
          results = for_landlords_idx.search( $(this).val() );

          if( results.length == 1 ) {
            $('#for-landlords-results').append('<div class="count">' + results.length + ' results</div>');
          } else {
            $('#for-landlords-results').append('<div class="count">' + results.length + ' results</div>');
          }

          var num_for_landlords_added = 0;

          $(results).each(function(index, result){
            $(autocomplete_data.for_landlords).each(function(postIndex, post){
              if( result.ref == post.id ) {
                // $('#for-landlords-results').append($('<div class="search-result">').text(post.title));
                if( num_for_landlords_added < RESULT_LIMITS.for_landlords ) {
                  var t = tmpl('autocomplete-template-for-landlords', post);
                  $('#for-landlords-results').append( t );
                }

                num_for_landlords_added++;
              }
            })
          })


        }

        do_button_functionality();
      })
    }

    if( !$('body').hasClass('search') ) {


      var stored_autocomplete_data = store.get('autocomplete_data');

      if( stored_autocomplete_data == undefined ) {
        $.getJSON(autocomplete_base_url.base_url + '/wp-json/housing-court/v1/autocomplete', function( data ) {
          store.set('autocomplete_data', data);
          autocomplete_init();
        })
      } else {
        autocomplete_init();
      }
    }

  });
})(jQuery);

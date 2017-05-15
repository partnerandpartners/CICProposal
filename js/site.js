/*
Library homepage: https://github.com/Metafalica/background-size-emu

This free library is result of my intellectual work.
I (the author, named Konstantin Izofatov, living in Russia, metafalica@gmx.com) grant you (the user) permissions
to use this library in any kind of projects and modify it in any way.

This library provided "AS IS". I am not responsible for any damages that you can receive from using it.
Use it on your own risk.

This notice should not be removed.
*/

(function ()
{
    function BgSzEmu()
    {
        BgSzEmu.prototype.elemsOnPrevCheck = null;
        BgSzEmu.prototype.genericEmptyBG = "url(empty_bg_" + new Date().getTime() + ".wtf)";
    }

    BgSzEmu.prototype.scanElems = function ()
    {
        if (!BgSzEmu.prototype.IsIE() || !BgSzEmu.prototype.IsBadIE())
            return;

        if (document.body)
        {
            var curr_elems = new Array();
            BgSzEmu.prototype.getElemsIn(null, curr_elems);

            if (!BgSzEmu.prototype.elemsOnPrevCheck)
            {
                BgSzEmu.prototype.elemsOnPrevCheck = curr_elems.slice(0);
                BgSzEmu.prototype.activateBgSzFixer();
            }
            else
            {
                for (var i = 0; i < curr_elems.length; i++)
                    if (BgSzEmu.prototype.isObjectInArray(curr_elems[i], BgSzEmu.prototype.elemsOnPrevCheck))
                    {
                        if (!curr_elems[i].junkData)
                            continue;

                        var available_size = BgSzEmu.prototype.getAvailableAreaSizeIn(curr_elems[i]);

                        if (curr_elems[i].junkData.lastSize && (curr_elems[i].junkData.lastSize.width != available_size.width || curr_elems[i].junkData.lastSize.height != available_size.height))
                            BgSzEmu.prototype.fixBgFor(curr_elems[i]);
                    }
                    else
                    {
                        var curr_bg_img = BgSzEmu.prototype.getCSSPropertyValue(curr_elems[i], "background-image", "backgroundImage");

                        if (curr_bg_img && !curr_elems[i].junkData)
                            BgSzEmu.prototype.fixBgFor(curr_elems[i]);
                    }

                BgSzEmu.prototype.elemsOnPrevCheck = curr_elems.slice(0);
            }
        }

        setTimeout(BgSzEmu.prototype.scanElems, 500);
    };

    BgSzEmu.prototype.activateBgSzFixer = function ()
    {
        if (!BgSzEmu.prototype.IsIE() || !BgSzEmu.prototype.IsBadIE())
            return;

        BgSzEmu.prototype.fixBgsRecursiveIn(null);
        window.onresize = BgSzEmu.prototype.handleResize;
    };

    BgSzEmu.prototype.fixBgsRecursiveIn = function (start_elem)
    {
        var curr_elem = start_elem ? start_elem : document.body;

        var bg_sz = BgSzEmu.prototype.getCSSPropertyValue(curr_elem, "background-size", "backgroundSize");

        if (bg_sz && bg_sz.toLowerCase() != "auto auto")
            BgSzEmu.prototype.fixBgFor(curr_elem);

        for (var i = 0; i < curr_elem.children.length; i++)
            BgSzEmu.prototype.fixBgsRecursiveIn(curr_elem.children[i]);
    };

    BgSzEmu.prototype.handleResize = function ()
    {
        BgSzEmu.prototype.fixBgsRecursiveIn(null);
    };

    BgSzEmu.prototype.handlePropertyChange = function ()
    {
        var evt = window.event;
        var elem = evt.target || evt.srcElement;

        if (evt.propertyName == "onpropertychange" || !elem)
            return;

        if (evt.propertyName == "style.backgroundImage")
        {
            var bg_img = elem.style.backgroundImage || elem.currentStyle.backgroundImage;

            if (bg_img == BgSzEmu.prototype.genericEmptyBG) //skip change made by emu to clear background
                return;

            if ((!bg_img || bg_img == "none") && elem.junkData)
            {
                elem.removeChild(elem.junkData.inner_div);
                elem.style.position = elem.junkData.orig_pos;
                elem.style.zIndex = elem.junkData.orig_zInd;
                elem.junkData = null;
            }
            else
                BgSzEmu.prototype.replaceBgImgFor(elem);
        }
        else if (BgSzEmu.prototype.startsWith(evt.propertyName, "style.background"))
            BgSzEmu.prototype.replaceBgImgFor(elem);
    };

    BgSzEmu.prototype.replaceBgImgFor = function (elem)
    {
        if (!BgSzEmu.prototype.elemCanHaveDivAsChildren(elem)) //can't deal with tags that do not support children
            return;

        var e_avl_sz = BgSzEmu.prototype.getAvailableAreaSizeIn(elem);

        if (e_avl_sz.width == 0 || e_avl_sz.height == 0)
            return;

        var prop_change_removed = false;

        if (elem.onpropertychange)
        {
            elem.onpropertychange = null;
            prop_change_removed = true;
        }

        var prev_backgroundImage = BgSzEmu.prototype.getCSSPropertyValue(elem, "background-image", "backgroundImage") || elem.background || elem.getAttribute("background");

        if (BgSzEmu.prototype.startsWith(prev_backgroundImage, "url(")) //process images only. skip gradients
        {
            if (prev_backgroundImage == BgSzEmu.prototype.genericEmptyBG)
                BgSzEmu.prototype.fixBgFor(elem);
            else
                BgSzEmu.prototype.getImgNaturalSizeAndPassToCallback(elem, prev_backgroundImage, BgSzEmu.prototype.continueBgReplaceFor);
        }

        if (prop_change_removed)
            elem.onpropertychange = BgSzEmu.prototype.handlePropertyChange;
    };

    BgSzEmu.prototype.continueBgReplaceFor = function (elem, prev_backgroundImage, img_natural_size)
    {
        var prev_zIndex = elem.style.zIndex;
        var prev_position = elem.style.position;

        if (img_natural_size.width == 0 || img_natural_size.height == 0) //bad img url?
            return;

        elem.style.backgroundImage = BgSzEmu.prototype.genericEmptyBG;

        if ("background" in elem)
            elem.background = BgSzEmu.prototype.genericEmptyBG;

        var stylePosition = elem.style.position || elem.currentStyle.position;
        var styleZIndex = elem.style.zIndex || elem.currentStyle.zIndex;

        if (!stylePosition || stylePosition == "static")
            elem.style.position = "relative";

        if (!styleZIndex || styleZIndex == "auto")
            elem.style.zIndex = 0;

        var div = document.createElement("div");
        var img = document.createElement("img");

        div.style.margin = 0;
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.overflow = "hidden";
        //div.style.border = "dashed";
        //img.style.border = "double";
        div.style.zIndex = img.style.zIndex = -1;
        div.style.display = img.style.display = "block";
        div.style.position = img.style.position = "absolute";
        div.style.visibility = img.style.visibility = "inherit";

        img.alt = "";
        img.src = BgSzEmu.prototype.getPurePathFrom(prev_backgroundImage);

        if (elem.junkData)
        {
            elem.removeChild(elem.junkData.inner_div);
            elem.junkData = null;
        }

        var junkData = { orig_bgImg: prev_backgroundImage, orig_pos: prev_position, orig_zInd: prev_zIndex, inner_div: div, inner_img: img, inner_img_nat_size: img_natural_size };
        elem.junkData = junkData;

        div.appendChild(img);

        if (elem.firstChild)
            elem.insertBefore(div, elem.firstChild);
        else
            elem.appendChild(div);

        BgSzEmu.prototype.fixBgFor(elem);

        elem.onpropertychange = BgSzEmu.prototype.handlePropertyChange;
    };

    BgSzEmu.prototype.getImgNaturalSizeAndPassToCallback = function (elem, img_path, callback)
    {
        var pure_path = BgSzEmu.prototype.getPurePathFrom(img_path);

        var img = new Image();

        img.onload = function ()
        {
            var sz = { width: this.width, height: this.height };
            callback(elem, img_path, sz);
        };

        img.src = pure_path;
    };

    BgSzEmu.prototype.getAvailableAreaSizeIn = function (elem)
    {
        var sz = { width: elem.clientWidth || elem.offsetWidth, height: elem.clientHeight || elem.offsetHeight };

        return sz;
    };

    BgSzEmu.prototype.fixBgFor = function (elem)
    {
        var junkData = elem.junkData;
        var bg_sz = BgSzEmu.prototype.getCSSPropertyValue(elem, "background-size", "backgroundSize");

        if (junkData)
        {
            var available_size = BgSzEmu.prototype.getAvailableAreaSizeIn(elem);
            var div_width = available_size.width;
            var div_height = available_size.height;
            var divRatio = div_width / div_height;

            elem.junkData.lastSize = available_size;

            junkData.inner_div.style.width = div_width + "px";
            junkData.inner_div.style.height = div_height + "px";

            var img_nat_width = junkData.inner_img_nat_size.width;
            var img_nat_height = junkData.inner_img_nat_size.height;
            var img_curr_width = junkData.inner_img.width || junkData.inner_img.style.width;
            var img_curr_height = junkData.inner_img.height || junkData.inner_img.style.height;
            var imgRatio = (img_curr_width / img_curr_height) || (img_nat_width / img_nat_height);

            var new_img_top = "0px";
            var new_img_left = "0px";
            var new_img_width;
            var new_img_height;

            var elem_bg_pos = BgSzEmu.prototype.getElemBgPos(elem);

            if (bg_sz == "cover" || bg_sz == "contain")
            {
                if ((bg_sz == "cover" && divRatio > imgRatio) || (bg_sz == "contain" && imgRatio > divRatio))
                {
                    new_img_width = div_width;
                    new_img_height = new_img_width / imgRatio;

                    if (elem_bg_pos.v_pos.is_percents)
                        new_img_top = Math.floor((div_height - new_img_height) * elem_bg_pos.v_pos.value) + "px";
                }
                else
                {
                    new_img_height = div_height;
                    new_img_width = new_img_height * imgRatio;

                    if (elem_bg_pos.h_pos.is_percents)
                        new_img_left = Math.floor((div_width - new_img_width) * elem_bg_pos.h_pos.value) + "px";
                }

                elem.junkData.inner_img.width = new_img_width;
                elem.junkData.inner_img.height = new_img_height;

                elem.junkData.inner_img.style.left = elem_bg_pos.h_pos.is_percents ? new_img_left : elem_bg_pos.h_pos.value;
                elem.junkData.inner_img.style.top = elem_bg_pos.v_pos.is_percents ? new_img_top : elem_bg_pos.v_pos.value;
            }
            else
            {
                var splitted_size = bg_sz.split(" ");
                var t_width = splitted_size[0];
                var t_height = splitted_size[1];

                if (t_width.toLowerCase() == "auto" && t_height.toLowerCase() == "auto")
                {
                    t_width = img_nat_width;
                    t_height = img_nat_height;
                }
                else if (t_width.toLowerCase() == "auto")
                {
                    elem.junkData.inner_img.style.height = t_height;
                    var just_set_height = elem.junkData.inner_img.clientHeight || elem.junkData.inner_img.offsetHeight/* || elem.junkData.inner_img.scrollHeight*/;
                    var width_to_set = (img_nat_width * just_set_height) / img_nat_height;

                    if (!width_to_set || width_to_set < 1)
                        width_to_set = 1;

                    elem.junkData.inner_img.width = width_to_set;
                }
                else if (t_height.toLowerCase() == "auto")
                {
                    elem.junkData.inner_img.style.width = t_width;
                    var just_set_width = elem.junkData.inner_img.clientWidth || elem.junkData.inner_img.offsetWidth/* || elem.junkData.inner_img.scrollWidth*/;
                    var height_to_set = (just_set_width * img_nat_height) / img_nat_width;

                    if (!height_to_set || height_to_set < 1)
                        height_to_set = 1;

                    elem.junkData.inner_img.height = height_to_set;
                }
                else
                {
                    elem.junkData.inner_img.style.width = t_width;
                    elem.junkData.inner_img.style.height = t_height;
                }

                elem.junkData.inner_img.style.left = elem_bg_pos.h_pos.is_percents ? Math.floor((div_width - elem.junkData.inner_img.width) * elem_bg_pos.h_pos.value) + "px" : elem_bg_pos.h_pos.value;
                elem.junkData.inner_img.style.top = elem_bg_pos.v_pos.is_percents ? Math.floor((div_height - elem.junkData.inner_img.height) * elem_bg_pos.v_pos.value) + "px" : elem_bg_pos.v_pos.value;
            }
        }
        else if (bg_sz)
            BgSzEmu.prototype.replaceBgImgFor(elem);
    };

    BgSzEmu.prototype.parseBgPosVal = function (word)
    {
        var map = new Array();
        map["left"] = "0.0";
        map["center"] = "0.5";
        map["right"] = "1.0";
        map["top"] = "0.0";
        map["bottom"] = "1.0";

        if (word in map)
            return { value: map[word], is_percents: true };
        else if (BgSzEmu.prototype.endsWith(word, "%"))
            return { value: (word.substr(0, word.length - 1) / 100), is_percents: true };

        return { value: word, is_percents: false };
    };

    //common functions
    BgSzEmu.prototype.IsIE = function ()
    {
        return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
    };

    BgSzEmu.prototype.IsBadIE = function ()
    {
        return "attachEvent" in window && !("addEventListener" in window); //detects ie < 9 and ie9 in quirks mode
    };

    BgSzEmu.prototype.getElemsIn = function (start_elem, curr_elems)
    {
        var curr_elem = start_elem ? start_elem : document.body;

        for (var i = 0; i < curr_elem.children.length; i++)
        {
            curr_elems.push(curr_elem.children[i]);
            BgSzEmu.prototype.getElemsIn(curr_elem.children[i], curr_elems);
        }
    };

    BgSzEmu.prototype.getPurePathFrom = function (str_path)
    {
        var final_str = str_path;

        if (final_str.substring(0, ("url(").length) == "url(")
        {
            final_str = final_str.substr(4);

            if (final_str.lastIndexOf(")") == final_str.length - 1)
                final_str = final_str.substr(0, final_str.length - 1);
        }

        return final_str;
    };

    BgSzEmu.prototype.getElemBgPos = function (elem)
    {
        var splitted_pos = Array(
            BgSzEmu.prototype.getCSSPropertyValue(elem, "background-position-x", "backgroundPositionX"),
            BgSzEmu.prototype.getCSSPropertyValue(elem, "background-position-y", "backgroundPositionY")
    );

        var h_pos_ = (splitted_pos[0] ? BgSzEmu.prototype.parseBgPosVal(splitted_pos[0]) : { value: "0", is_percents: true });
        var v_pos_ = (splitted_pos[1] ? BgSzEmu.prototype.parseBgPosVal(splitted_pos[1]) : { value: "0", is_percents: true });

        return { h_pos: h_pos_, v_pos: v_pos_ };
    };

    BgSzEmu.prototype.stringContains = function (str, suffix)
    {
        if (!str)
            return false;

        return str.toString().indexOf(suffix) > -1;
    };

    BgSzEmu.prototype.startsWith = function (str, suffix)
    {
        if (!str)
            return false;

        return str.toString().substring(0, suffix.length) === suffix;
    };

    BgSzEmu.prototype.endsWith = function (str, suffix)
    {
        if (!str)
            return false;

        return str.toString().indexOf(suffix, str.length - suffix.length) >= 0;
    };

    BgSzEmu.prototype.isObjectInArray = function (obj, arr)
    {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == obj)
                return true;

        return false;
    };

    BgSzEmu.prototype.getCSSPropertyValue = function (elem, css_prop, runtime_prop)
    {
        /*var style_runtime = elem.style[runtime_prop];
        var currentStyle_runtime = elem.currentStyle[runtime_prop];
        var style_attribute = elem.style.getAttribute(css_prop);
        var currentStyle_attribute = elem.currentStyle.getAttribute(css_prop);*/
        return elem.style[runtime_prop] || elem.currentStyle[runtime_prop] || elem.style.getAttribute(css_prop) || elem.currentStyle.getAttribute(css_prop);
    };

    BgSzEmu.prototype.elemCanHaveDivAsChildren = function (elem)
    {
        if (elem.tagName.toLowerCase() == "tr") //hacky avoid of elemens that will become bugged after adding div
            return false;

        var div = document.createElement("div");
        div.style.display = "none";
        var check_result = true;

        try { elem.appendChild(div); }
        catch (exc) { check_result = false; }
        finally
        {
            if (BgSzEmu.prototype.isObjectInArray(div, elem.children))
                elem.removeChild(div);
        }

        return check_result;
    };
    //common functions end

    var bg_sz_emu = new BgSzEmu();
    bg_sz_emu.scanElems();
})();


/*!
 * Stickyfill -- `position: sticky` polyfill
 * v. 1.1.4 | https://github.com/wilddeer/stickyfill
 * Copyright Oleg Korsunsky | http://wd.dizaina.net/
 *
 * MIT License
 */
!function(a,b){function c(){y=D=z=A=B=C=K}function d(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}function e(a){return parseFloat(a)||0}function f(){F={top:b.pageYOffset,left:b.pageXOffset}}function g(){return b.pageXOffset!=F.left?(f(),void z()):void(b.pageYOffset!=F.top&&(f(),i()))}function h(a){setTimeout(function(){b.pageYOffset!=F.top&&(F.top=b.pageYOffset,i())},0)}function i(){for(var a=H.length-1;a>=0;a--)j(H[a])}function j(a){if(a.inited){var b=F.top<=a.limit.start?0:F.top>=a.limit.end?2:1;a.mode!=b&&p(a,b)}}function k(){for(var a=H.length-1;a>=0;a--)if(H[a].inited){var b=Math.abs(t(H[a].clone)-H[a].docOffsetTop),c=Math.abs(H[a].parent.node.offsetHeight-H[a].parent.height);if(b>=2||c>=2)return!1}return!0}function l(a){isNaN(parseFloat(a.computed.top))||a.isCell||"none"==a.computed.display||(a.inited=!0,a.clone||q(a),"absolute"!=a.parent.computed.position&&"relative"!=a.parent.computed.position&&(a.parent.node.style.position="relative"),j(a),a.parent.height=a.parent.node.offsetHeight,a.docOffsetTop=t(a.clone))}function m(a){var b=!0;a.clone&&r(a),d(a.node.style,a.css);for(var c=H.length-1;c>=0;c--)if(H[c].node!==a.node&&H[c].parent.node===a.parent.node){b=!1;break}b&&(a.parent.node.style.position=a.parent.css.position),a.mode=-1}function n(){for(var a=H.length-1;a>=0;a--)l(H[a])}function o(){for(var a=H.length-1;a>=0;a--)m(H[a])}function p(a,b){var c=a.node.style;switch(b){case 0:c.position="absolute",c.left=a.offset.left+"px",c.right=a.offset.right+"px",c.top=a.offset.top+"px",c.bottom="auto",c.width="auto",c.marginLeft=0,c.marginRight=0,c.marginTop=0;break;case 1:c.position="fixed",c.left=a.box.left+"px",c.right=a.box.right+"px",c.top=a.css.top,c.bottom="auto",c.width="auto",c.marginLeft=0,c.marginRight=0,c.marginTop=0;break;case 2:c.position="absolute",c.left=a.offset.left+"px",c.right=a.offset.right+"px",c.top="auto",c.bottom=0,c.width="auto",c.marginLeft=0,c.marginRight=0}a.mode=b}function q(a){a.clone=document.createElement("div");var b=a.node.nextSibling||a.node,c=a.clone.style;c.height=a.height+"px",c.width=a.width+"px",c.marginTop=a.computed.marginTop,c.marginBottom=a.computed.marginBottom,c.marginLeft=a.computed.marginLeft,c.marginRight=a.computed.marginRight,c.padding=c.border=c.borderSpacing=0,c.fontSize="1em",c.position="static",c.cssFloat=a.computed.cssFloat,a.node.parentNode.insertBefore(a.clone,b)}function r(a){a.clone.parentNode.removeChild(a.clone),a.clone=void 0}function s(a){var b=getComputedStyle(a),c=a.parentNode,d=getComputedStyle(c),f=a.style.position;a.style.position="relative";var g={top:b.top,marginTop:b.marginTop,marginBottom:b.marginBottom,marginLeft:b.marginLeft,marginRight:b.marginRight,cssFloat:b.cssFloat,display:b.display},h={top:e(b.top),marginBottom:e(b.marginBottom),paddingLeft:e(b.paddingLeft),paddingRight:e(b.paddingRight),borderLeftWidth:e(b.borderLeftWidth),borderRightWidth:e(b.borderRightWidth)};a.style.position=f;var i={position:a.style.position,top:a.style.top,bottom:a.style.bottom,left:a.style.left,right:a.style.right,width:a.style.width,marginTop:a.style.marginTop,marginLeft:a.style.marginLeft,marginRight:a.style.marginRight},j=u(a),k=u(c),l={node:c,css:{position:c.style.position},computed:{position:d.position},numeric:{borderLeftWidth:e(d.borderLeftWidth),borderRightWidth:e(d.borderRightWidth),borderTopWidth:e(d.borderTopWidth),borderBottomWidth:e(d.borderBottomWidth)}},m={node:a,box:{left:j.win.left,right:J.clientWidth-j.win.right},offset:{top:j.win.top-k.win.top-l.numeric.borderTopWidth,left:j.win.left-k.win.left-l.numeric.borderLeftWidth,right:-j.win.right+k.win.right-l.numeric.borderRightWidth},css:i,isCell:"table-cell"==b.display,computed:g,numeric:h,width:j.win.right-j.win.left,height:j.win.bottom-j.win.top,mode:-1,inited:!1,parent:l,limit:{start:j.doc.top-h.top,end:k.doc.top+c.offsetHeight-l.numeric.borderBottomWidth-a.offsetHeight-h.top-h.marginBottom}};return m}function t(a){for(var b=0;a;)b+=a.offsetTop,a=a.offsetParent;return b}function u(a){var c=a.getBoundingClientRect();return{doc:{top:c.top+b.pageYOffset,left:c.left+b.pageXOffset},win:c}}function v(){G=setInterval(function(){!k()&&z()},500)}function w(){clearInterval(G)}function x(){I&&(document[L]?w():v())}function y(){I||(f(),n(),b.addEventListener("scroll",g),b.addEventListener("wheel",h),b.addEventListener("resize",z),b.addEventListener("orientationchange",z),a.addEventListener(M,x),v(),I=!0)}function z(){if(I){o();for(var a=H.length-1;a>=0;a--)H[a]=s(H[a].node);n()}}function A(){b.removeEventListener("scroll",g),b.removeEventListener("wheel",h),b.removeEventListener("resize",z),b.removeEventListener("orientationchange",z),a.removeEventListener(M,x),w(),I=!1}function B(){A(),o()}function C(){for(B();H.length;)H.pop()}function D(a){for(var b=H.length-1;b>=0;b--)if(H[b].node===a)return;var c=s(a);H.push(c),I?l(c):y()}function E(a){for(var b=H.length-1;b>=0;b--)H[b].node===a&&(m(H[b]),H.splice(b,1))}var F,G,H=[],I=!1,J=a.documentElement,K=function(){},L="hidden",M="visibilitychange";void 0!==a.webkitHidden&&(L="webkitHidden",M="webkitvisibilitychange"),b.getComputedStyle||c();for(var N=["","-webkit-","-moz-","-ms-"],O=document.createElement("div"),P=N.length-1;P>=0;P--){try{O.style.position=N[P]+"sticky"}catch(Q){}""!=O.style.position&&c()}f(),b.Stickyfill={stickies:H,add:D,remove:E,init:y,rebuild:z,pause:A,stop:B,kill:C}}(document,window),window.jQuery&&!function($){$.fn.Stickyfill=function(a){return this.each(function(){Stickyfill.add(this)}),this}}(window.jQuery);



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
  tags: 15,
  categories: 5,
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

    var storeWithExpiration = {
      set: function(key, val) {
        var exp = 10000000;
        store.set(key, { val:val, exp:exp, time:new Date().getTime() })
      },
      get: function(key) {
        var info = store.get(key)

        if (!info) {
          return null
        }

        if (new Date().getTime() - info.time > info.exp) {
          console.log( 'too old' );
          return null
        }

        return info.val
      }
    };

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




      // autocomplete_data = store.get('autocomplete_data');//autocomplete_data_json;
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
          $('<a>').addClass('btn btn-lg').attr('href', 'http://housingcourtanswers.org/?s=' + encodeURIComponent( $(search_input_selector).val() ) ).text('See All Results')
        )
      }
    }



    function setup_input() {
      $(search_input_selector).on('input', function(e) {

        if( $(search_input_selector).val().trim().length < 1 ) {
          show_suggested_terms()

          $('#terms-results-label').text('Suggested Terms');
          $('#topics-results-label').text('Suggested Topics');
        } else {

          showing_suggested_terms = false;


          // TAGS
          var num_tags_added = 0;
          $('#tag-results').empty();
          var results = tags_idx.search( $(this).val() );
          $(results).each(function(index, result){
            $(autocomplete_data.tags).each(function(tagIndex, tag){
              if( result.ref == tag.id ) {

                if( num_tags_added < RESULT_LIMITS.tags ) {
                  var t = tmpl('autocomplete-template-tags', tag);
                  $('#tag-results').append( t );
                  num_tags_added++;
                }
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


          // CATEGORIES
          var num_categories_added = 0;

          $('#category-results').empty();
          results = categories_idx.search( $(this).val() );
          $(results).each(function(index, result){
            $(autocomplete_data.categories).each(function(categoryIndex, category){
              if( result.ref == category.id ) {
                if( num_categories_added < RESULT_LIMITS.categories ) {
                  var t = tmpl('autocomplete-template-categories', category);
                  $('#category-results').append( t );
                  num_categories_added++;
                }
              }
            })
          })


          if( results.length == 1 ) {
            $('#topics-results-label').text( '1 Matched Topic' );
          } else {
            $('#topics-results-label').text( results.length + ' Matched Topics' );
          }


          // FOR TENANTS

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
            $('#for-landlords-results').append('<div class="count">' + results.length + ' Tips</div>');
          } else {
            $('#for-landlords-results').append('<div class="count">' + results.length + ' Tips</div>');
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


      var stored_autocomplete_data = storeWithExpiration.get('autocomplete_data');

      console.log(stored_autocomplete_data);

      if( stored_autocomplete_data == undefined || stored_autocomplete_data == null ) {
        $.getJSON(autocomplete_base_url.base_url + '/wp-json/housing-court/v1/autocomplete', function( data ) {
          storeWithExpiration.set('autocomplete_data', data);
          autocomplete_data = data;
          autocomplete_init();
        })
      } else {
        autocomplete_data = stored_autocomplete_data;
        autocomplete_init();
      }
    }

  });
})(jQuery);



(function($){
  $(document).ready(function(){
    $('.sticky').Stickyfill();
    // $("#nav").affix({
    //     offset: {
    //         top: $('#nav').offset().top
    //     }
    // });

    // $('#nav').affix({
    //   offset: {
    //     bottom: ($('footer').outerHeight(true) + $('.application').outerHeight(true)) + 60
    //   }
    // });

  });
})(jQuery);

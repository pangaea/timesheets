/*
* jQuery UI Sexy Select
*
* Authors:
*  Nico VanHaaster
* 
* Liscenced under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
* 
*
* Requirments
* jQuery 1.4.2  
* jQuery Ui 1.8.4
* 
* Notes
* When autoSort = true the drag drop sorting features are not available.
*
* usage $('select').sexyselect();
*/



;(function ($) {
    $.widget("ui.sexyselect", {
        createEventArgs: {
            create : true,
            errorText : '',
            timeOut : 2500
        },
         options: {  
            onItemSelected: null, //event for onitem selected
            allowDebug: false, //used for debugging purposes
            nooptionstext : 'no options added...', //no opptions text, will be shown if no options have been added.
            onitemcreating: null, //event called when the items are being created. return true to continue or return false to cancel 
            expanded: true,
            width : 200, //width of the outside container
            height : 200, //total height of the container
            background : '#fff', //background of the container
            title : 'Multi-Select', //title bar text
            showTitle : true, //show the title bar
            allowInput : false, //allow the input bar to create new options
            addValueMaxLength : 50, //maxValue for the input bar
            defaultInputText : 'add new option', //default watermark for the inputText blank for none
            autoSort : false, //auto sort the list? false will allow for drag & drop sorting
            minSize : 0, //minimum size : used for validation. If you set the value to 2 and use the method $(elem).sexyselect('validateSize') will return true or false against minimum requirements
            onitemcreated : null, //event fired when an Item is created (new items only)
            autoExpand : false, //not functioning
            onItemsSync : null, //event fired when the Items are Synronized
            allowDelete : true, //allow items to be removed.
            allowCollapse : true,
            selectionMode : 'none' //type of selection required : this function will be overriden if the select has the attr multiple added to it.
                                   //                             none = no selection
                                   //                             single = radio button list
                                   //                             multiple = checkbox
        },
        _init: function(){
            var self = this;
            var initElem = this.element;
            options = this.options;
            if(!options.allowDebug)
            {
                initElem.hide();
                initElem.css({'position':'absolute','z-index':'-10','left' : '-3000000','top':'-30000'});
            }
            if(initElem.attr('multiple') == true && options.selectionMode == 'none')
                options.selectionMode = 'multiple';
            if(options.selectionMode == 'multiple')
                initElem.attr('multiple','multiple');
            else if(options.selectionMode == 'single')
                initElem.removeAttr('multiple');
            this.sselect = $('<div />')
                           .css({'height': ((!options.expanded && options.allowCollapse) ? 28 : (!options.allowInput ? 28 - options.height : options.height)) + 'px', 'width' : options.width + 'px', 'background' : options.background, 'padding' : '0', 'margin' : '0','overflow' : 'hidden'})
                           .attr('id',initElem.attr('id') + '_ssWrapper')
                           .addClass('ui-widget')
                           .addClass('ui-widget-content')
                           .addClass('ui-corner-all');
            if(options.showTitle)
            {
                this.header = $('<div />')
                            .css({ 'height' : '22px', 'line-height' : '22px', 'padding' : '0 0 0 4px', 'margin':'2px' })
                            .addClass('ui-widget-header')
                            .addClass('ui-corner-all')
                            .attr('id',initElem.attr('id') + '_header');
                if(options.allowCollapse)
                {
                    this.header.click(function(){
                                        self._expand();
                                    });
                    this.header.append($('<span />')
                                       .css({'width' : options.width - 40 + 'px', 'display':'inline-block','overflow':'hidden'})
                                       .html(options.title)
                                       );
                    this.header.append($('<span />')
                                       .addClass('ui-icon')
                                       .addClass((options.expanded ? 'ui-icon-circle-triangle-s' : 'ui-icon-circle-triangle-n'))
                                       .css({'margin-top' : '2px' ,'cursor':'pointer', 'display' : 'inline-block'})
                                       .attr('id',initElem.attr('id') + '_icon')
                                       .attr('ex',(options.expanded ? '1' : '0'))
                                       );
                   
                }
                else
                    this.header.html(options.title);
                this.sselect.append(this.header);
            }
            if(options.allowInput)
            {
                this.input = $('<div />')
                             .css({'border-bottom' : 'solid 1px #f1f1f1', 'font-size' : '0.8em' , 'color' : '#666','height' : '23px', 'line-height' : '23px'});
                
                var inputBox = $('<input />')
                               .attr('type','text')
                               .attr('id',initElem.attr('id') + '_addText')
                               .val(options.defaultInputText)
                               .addClass('ui-widget-content')
                               .attr('maxlength',options.addValueMaxLength)
                               .css({'color' : '#999', 
                                     'width' : options.width - 65 + 'px' ,
                                     'padding-left' : '5px',
                                     'font-style' : 'italic',
                                     'font-weight' : 'normal',
                                     '-moz-border-radius': '4px', 
                                     'display':'inline-block',
                                     '-webkit-border-radius': '4px',
                                     'border-radius' : '4px' })
                               .attr('wmt',options.defaultInputText)
                               .hover(
                                    function(){
                                        $(this).addClass('ui-state-hover');
                                    },
                                    function() {
                                       $(this).removeClass('ui-state-hover');
                                    }
                               )
                               .focus(function()
                               {
                                    x = $(this);
                                    var t = x.val();
                                    if(t == x.attr('wmt'))
                                    {
                                        x.val('')
                                         .addClass('ui-state-active')
                                         .css({'color' : '#666', 
                                               'font-style' : 'normal' });
                                    }
                               })
                               .blur(function()
                               {
                                    x = $(this);
                                    x.removeClass('ui-state-active');
                                    var t = x.val();
                                    if(t == '')
                                    {
                                        x.css({'color' : '#999',
                                               'font-style' : 'italic'})
                                         .val(x.attr('wmt'));
                                        
                                    }
                               });
                var inputBtn = $('<input />')
                               .attr('type','button')
                               .attr('id' ,initElem.attr('id') + '_addBtn')
                               .addClass('ui-widget-content')
                               .addClass('ui-corner-all')
                               .val('add')
                               .mouseenter(function()
                               {
                                    $(this).removeClass('ui-state-highlight');
                                    $(this).addClass('ui-state-active');
                                    $(this).css('font-weight','normal');
                               })
                               .mouseout(function()
                               {
                                    $(this).removeClass('ui-state-highlight');
                                    $(this).removeClass('ui-state-active');
                                    $(this).css('font-weight','normal');
                               })
                               .mousedown(function()
                               {
                                    $(this).removeClass('ui-state-active');
                                    $(this).addClass('ui-state-highlight');
                                    $(this).css('font-weight','normal');
                               })
                               .mouseup(function()
                               {
                                    $(this).removeClass('ui-state-highlight');
                                    $(this).removeClass('ui-state-active');
                                    $(this).css('font-weight','normal');
                               })
                               .click(function(){
                                    var x = $(this).parent().children('input[type=text]');
                                    var t = x.val().trim();
                                    self._resetCreateEventArgs();
                                    var complete = true;
                                    if($.isFunction(self.options.onitemcreating))
                                    {
                                        var result = self.options.onitemcreating(x, self.createEventArgs);
                                        if(result !== undefined) self.createEventArgs = result;
                                    }
                                    if(self.createEventArgs.create)
                                        self._addItem(t, x);
                                    else if(!self.createEventArgs.create && self.createEventArgs.errorText != '')
                                        self.showError(self.createEventArgs.errorText, self.createEventArgs.timeOut);
                               });
                var inputError = $('<div />')
                                 .attr('id',initElem.attr('id') + '_addText_e')
                                 .addClass('ui-state-error')
                                 .addClass('ui-corner-bottom')
                                 .css({'display':'none' , 'padding' :'5px', 'position' : 'relative', 'z-index' :'10000', 'margin' : '0', 'cursor':'default' })
                                 .html('');
                this.input.append(inputBox);
                this.input.append(inputBtn);
                this.input.append(inputError);
                this.sselect.append(this.input);
            }
            this.itemHolder = $('<div />')
                            .css({'height': options.height - (options.showTitle ? 53 : 22) + 'px', 'width' : options.width , 'overflow' : 'hidden','overflow-y' : 'auto', 'margin' : '0px' , 'padding' : '0px'})
                            .attr('id',initElem.attr('id') + '_items')
                            .append($('<ul />')
                                    .css({'list-style-type' : 'none' , 'padding' : '0' , 'margin' : '0' }));
                this.sselect.append(this.itemHolder);
            initElem.after(this.sselect);
            this._syncItems();
        },
        _resetCreateEventArgs: function()
        {
            var self = this;
            self.createEventArgs.create = true;
            self.createEventArgs.errorText ='';
        },
        _addItem: function(inputText, inputCtrl)
        {
            var self = this;
            var initElem = this.element;
            var x = inputCtrl;
            var t = inputText;
            if(t != x.attr('wmt') && t != '')
            {
                if(self.searchItem(t))
                {
                    self.showError('!! New item already exists...',2500);
                }
                else{
                    var newOption = $('<option />')
                                    .val(t)
                                    .text(t);
                    initElem.append(newOption);
                    if($.isFunction(self.options.onitemcreated))
                    {
                        try {
                            self.options.onitemcreated(newOption, initElem);
                        } catch (ex) {
                            if(self.options.allowDebug)
                            {
                                alert('creation function failed: ' + ex.Description);
                            }
                        }
                    }
                    self._syncItems();
                }
            }
            else if(t == '')
            {
                self.showError('!! New option text empty..',2500);
            }
            else if(t == x.attr('wmt'))
            {
                self.showError('!! Enter new option text..',2500);
            }
            x.css({'color' : '#999',
                    'font-style' : 'italic'})
                    .val(x.attr('wmt'));
        },
        _syncItems : function()
        {
            var alt = false;
            var self = this;
            var initElem = this.element;
            var itemsWrapper = $('#' + initElem.attr('id') + '_items ul');
            var init = self.element.children().size();
            itemsWrapper.html('');
            
            if(this.options.autoSort)
            {
                listitems = initElem.children('option').get().sort(function (a,b){ a1 = $(a).text().toUpperCase(); b1 = $(b).text().toUpperCase(); return (a1 < b1) ? -1 : (a1 > b1) ? 1 : 0; });
                initElem.html('');
                $.each(listitems,function(idx,itm){
                    initElem.append(itm);
                });
            }

            initElem.children().each(function(){
                    var opt = $(this);
                    var text = opt.text();
                    var value = opt.val();
                    var checked = opt.attr('selected');
                    var item = self._createItem(text,value,alt, checked);
                    itemsWrapper.append(item);
                    alt = (alt ? false : true);
            });
            
            if(self.totalItems() > 1 && !self.options.autoSort)
            {
                itemsWrapper.sortable('destroy');
                itemsWrapper.sortable({ revert:true, update: function(event, ui) {
                        items = itemsWrapper.children('li').get();
                        oItems = initElem.children('option').get();
                        initElem.html('');
                        $.each(items,function(idx,itm)
                        {
                            var i = $($(itm).children('span').get(2))
                            var text = i.html();
                            $($(itm).children('span').get(0)).removeClass('ui-icon-carat-2-n-s').removeClass('ui-icon-carat-1-s').removeClass('ui-icon-carat-1-n').addClass('ui-icon-carat-2-n-s');
                            var child = null;
                            $.each(oItems,function(idx,itm){
                                if($(itm).html() == text)
                                {
                                    child = $(itm);
                                    return;
                                }
                            });
                            initElem.append(child);
                        });
                        $($(itemsWrapper.children('li').get(0)).children('span').get(0)).removeClass('ui-icon-carat-2-n-s').addClass('ui-icon-carat-1-s');
                        $($(itemsWrapper.children('li').get(-1)).children('span').get(0)).removeClass('ui-icon-carat-2-n-s').addClass('ui-icon-carat-1-n');
                        if($.isFunction(self.options.onItemsSync))
                        {
                            try {
                                self.options.onItemsSync(initElem);
                            } catch (ex) {
                                if(self.options.allowDebug)
                                {
                                    alert('creation function failed: ' + ex.Description);
                                }
                            }
                        }
                    }
                });
                $($(itemsWrapper.children('li').get(0)).children('span').get(0)).removeClass('ui-icon-carat-2-n-s').addClass('ui-icon-carat-1-s');
                $($(itemsWrapper.children('li').get(-1)).children('span').get(0)).removeClass('ui-icon-carat-2-n-s').addClass('ui-icon-carat-1-n');
            }
            else if(self.totalItems() == 1 && !self.options.autoSort)
            {
                itemsWrapper.sortable('destroy');
                $($(itemsWrapper.children('li').get(0)).children('span').get(0)).removeClass('ui-icon').css({'display':'inline-block','width': '16px'});
            }
            if(self.totalItems() == 0)
            {
                itemsWrapper.append($('<div />')
                                    .css({ 'color' : '#999', 'font-style' : 'italic', 'font-size' : '0.8em'})
                                    .attr('align','center')
                                    .html(self.options.nooptionstext));
                if(self.options.autoExpand)
                {
                    $('#' +initElem.attr('id') + '_ssWrapper').animate({
                        height: '+=' + add
                    });
                }
            }
            if($.isFunction(self.options.onItemsSync))
            {
                try {
                    self.options.onItemsSync(initElem);
                } catch (ex) {
                    if(self.options.allowDebug)
                        alert('onItemsSync function failed: ' + ex.Description);
                }
            }
        },
        searchItem: function(text)
        {
            var x = false; var self = this; var initElem = this.element;
            initElem.children().each(function(){
                if($(this).text().toLowerCase() == text.toLowerCase())
                    return x = true;
            });
            return x;
        },
        destroy: function()
        {
            var self = this; var initElem = this.element;
            $('#' +initElem.attr('id') + '_ssWrapper').remove();
            initElem.show();
        },
        validateSize: function()
        {
            var x = true;
            if(this.options.minSize !== undefined)
                if(this.totalItems() < parseInt(this.options.minSize))
                {
                    x = false;
                    return false;
                }
            return x;
        },
        totalItems: function()
        {
            var x = false; var self = this; var initElem = this.element;
            return initElem.children().size();
        },
        showError: function(text, timeOut)
        {
            var self = this;
            var initElem = this.element;
            $($('#' + initElem.attr('id') + '_ssWrapper').children('div').get(1)).children('div').each(function (i,idx){
                $(this).html(text);
                $(this).slideDown(300,function() { setTimeout("$('#"+ $(this).attr('id') + "').slideUp(300);",timeOut); });

            });
        },
        _removeItem: function(value)
        {
            var x = false; var self = this; var initElem = this.element;
            initElem.children().each(function(){
                if($(this).text().toLowerCase() == value.toLowerCase())
                {
                    $(this).remove();
                    return false;
                }
            });
            self._syncItems();
        },
        _createItem: function(text, value, alt, checked)
        {
            var self = this;
            var item = $('<li />')
                        .css({'cursor' : 'pointer', 'cursor':'default', 'font-weight':'normal','margin':'1px' })
                        .addClass('ui-state-default')
                        .attr('value', text)
                        .attr('sel','sel_option')
                        .append($('<span />')
                                .addClass('ui-icon')
                                .addClass('ui-icon-carat-2-n-s')
                                .css({'display' : (self.options.autoSort ? 'none' : 'inline-block'), 'margin' : '0' , 'padding' : '0', 'cursor':'pointer', 'width' :  (!self.options.autoSort ? '16px' : '1px') })
                                .attr('title','drag to sort')
                                .attr('value',text))
                        .append($('<span  />')
                                .addClass((self.options.allowDelete ? 'ui-icon' : ''))
                                .addClass((self.options.allowDelete ? 'ui-icon-trash' : ''))
                                .css({'display' : 'inline-block', 'cursor':'pointer', 'width' : (self.options.allowDelete ? '16px' : '1px'), 'vertical-align':'middle' })
                                .attr('value',text)
                                .attr('title','remove this option')
                                .click(function()
                                {
                                    if(self.options.allowDelete)
                                    {
                                        var id = $(this).attr('value');
                                        self._removeItem(id);
                                    }
                                }))
                        .append($('<span />')
                                .css({ 'cursor':'default'  } )
                                .html(text));
            if(self.options.selectionMode == 'multiple')
            {
                $(item.children('span').get(2)).css({'display':'none'});
                item.append($('<input />')
                            .attr('type','checkbox')
                            .attr('id',self.element.attr('id') + '_chk_' + text.replace(' ','_'))
                            .click(function(){
                                self._handleClick($(this));
                            })
                            .val(text));
                item.append($('<label />')
                            .attr('for',self.element.attr('id') + '_chk_' + text.replace(' ','_'))
                            .html(text));
                if(checked)
                    $(item.children('input[type=checkbox]').get(0)).attr('checked','checked');
            }
            else if(self.options.selectionMode == 'single')
            {
                 $(item.children('span').get(2)).css({'display':'none'});
                item.append($('<input />')
                            .attr('type','radio')
                            .attr('name',self.element.attr('id') + '_radio')
                            .attr('id',self.element.attr('id') + '_chk_' + text.replace(' ','_'))
                            .click(function(){
                                self._handleClick($(this));
                            })
                            .val(text));
                item.append($('<label />')
                            .attr('for',self.element.attr('id') + '_chk_' + text.replace(' ','_'))
                            .html(text));
                if(checked)
                    $(item.children('input[type=radio]').get(0)).attr('checked','checked');
            }
            if(alt)
                item.addClass('ui-widget-content').attr('uialt','1');
            else
                item.attr('uialt','0');
            item.hover(
                function()
                {
                    $(this).addClass('ui-state-hover');
                },
                function()
                {
                    $(this).removeClass('ui-state-hover');
                }
            );
            return item;
        },
        _handleClick : function(elem)
        {
            var self = this; var initElem = this.element;
            var checked = $(elem).attr('checked');
           
            initElem.children('option').each(function(o,i){
                if($(i).html() == $(elem).val())
                    if(checked)
                        $(i).attr('selected','selected');
                    else
                        $(i).removeAttr('selected');
            });
             if($.isFunction(self.options.onItemSelected)){
                try{
                    self.options.onItemSelected(elem,initElem.children('option').get());
                } catch (ex) {
                    if(self.options.allowDebug)
                    alert('select function failed: ' + ex.Description);
                }
            }
        },
        _expand: function()
        {
            var self = this; var initElem = this.element; var dir = (self.options.expanded = (!self.options.expanded));
            var ico = $('#' + initElem.attr('id') + '_icon');
            ico.removeClass('ui-icon-circle-triangle-n')
               .removeClass('ui-icon-circle-triangle-s')
               .addClass((dir ? 'ui-icon-circle-triangle-s' : 'ui-icon-circle-triangle-n'));
            $('#' +initElem.attr('id') + '_ssWrapper').animate({
                height: (!dir ? 28 : self.options.height)  + 'px'
            },500,function(){});
        },
        elements: function()
        {
            return this.element.children('option').get();
        },
        selectOption: function(element, checked)
        {
            var self = this;
            var initElem = this.element;
            if(checked)
                $(element).attr('selected','selected');
            else
                $(element).removeAttr('selected');
            this._syncItems();
        }
    });
})(jQuery);
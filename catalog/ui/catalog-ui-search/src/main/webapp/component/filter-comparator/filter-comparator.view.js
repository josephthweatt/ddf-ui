/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define*/
define([
    'marionette',
    'underscore',
    'jquery',
    'text!./filter-comparator.hbs',
    'js/CustomElements',
    'js/store'
], function (Marionette, _, $, template, CustomElements, store) {

    var geometryComparators = ['intersects'];
    var dateComparators = ['before', 'after'];
    var stringComparators = ['contains', 'matchcase', 'equals'];

    return Marionette.ItemView.extend({
        template: template,
        tagName: CustomElements.register('filter-comparator'),
        modelEvents: {
            'all': 'render'
        },
        events: {
            'click .choice': 'handleChoice'
        },
        ui: {
        },
        initialize: function(){
        },
        onRender: function(){
            this.handleValue();
        },
        handleValue: function(){
            this.$el.find('[data-value]').removeClass('is-selected');
            this.$el.find('[data-value="'+this.model.get('comparator')+'"]').addClass('is-selected');
        },
        handleChoice: function(e){
            var value = $(e.currentTarget).attr('data-value');
            this.model.set('comparator', value);
            this.$el.trigger('closeDropdown.'+CustomElements.getNamespace());
        },
        serializeData: function(){
            console.log(store.metacardTypes[this.model.get('type')]);
            console.log(this.model.get('type'));
            switch(store.metacardTypes[this.model.get('type')].type) {
                case 'GEOMETRY':
                    if (geometryComparators.indexOf(this.model.get('comparator')) === -1){
                        this.model.set('comparator', geometryComparators[0]);
                    }
                    return geometryComparators;
                    break;
                case 'DATE':
                    if (dateComparators.indexOf(this.model.get('comparator')) === -1){
                        this.model.set('comparator', dateComparators[0]);
                    }
                    return dateComparators;
                    break;
                default:
                    if (stringComparators.indexOf(this.model.get('comparator')) === -1){
                        this.model.set('comparator', stringComparators[0]);
                    }
                    return stringComparators;
                    break;
            }
        }
    });
});
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
    'text!./metacard-restore.hbs',
    'text!./metacard-restore-item.hbs',
    'js/CustomElements',
    'js/store',
    'js/cql',
    'js/model/Query'
], function (Marionette, _, $, template, itemTemplate, CustomElements, store, cql, Query) {

    var getDeletedMetacards = function () {
        var filter = {
            type: 'AND',
            filters: [
                { type: '=', property: '"metacard-tags"', value: 'history' },
                { type: '=', property: '"metacard.history.action"', value: 'Deleted' }
            ]
        };

        return new Query.Model({
            federation: 'local',
            cql: cql.write(filter),
            sortField: 'metacard.history.versioned',
            sortOrder: 'desc'
        });
    }

    var RestoreItemView = Marionette.ItemView.extend({
        className: 'row',
        events: {
            'click .restore': 'restore'
        },
        modelEvents: {
            change: 'render'
        },
        template: itemTemplate,
        serializeData: function () {
            var properties = this.model.get('metacard').get('properties').toJSON();
            return {
                message: this.model.get('message'),
                messageClass: this.model.get('messageClass'),
                title: properties.title,
                editedBy: properties['metacard.history.edited-by'],
                deleted: properties['metacard.history.versioned']
            }
        },
        restore: function () {
            var model = this.model;

            var historyId = model.get('metacard').get('properties').get('metacard.history.id');
            var metacardId = model.get('metacard').get('id');
            var revert = '/search/catalog/internal/history/' + historyId + '/revert/' + metacardId;

            $.get(revert).then(function () {
                model.set({
                    message: 'Successfully restored item',
                    messageClass: 'is-positive'
                });
            }, function () {
                model.set({
                    message: 'Failed to restore item.',
                    messageClass: 'is-negative'
                });
            });
        }
    });

    var RestoreCollectionView = Marionette.CollectionView.extend({
        childView: RestoreItemView,
    });

    return Marionette.LayoutView.extend({
        template: template,
        tagName: CustomElements.register('metacard-restore'),
        modelEvents: {
            'change': 'render'
        },
        events: {
        },
        regions: {
            table: '.metacard-restore-table'
        },
        initialize: function () {
            this.model = getDeletedMetacards();
            this.model.startSearch();
        },
        onRender: function () {
            this.table.show(new RestoreCollectionView({
                collection: this.model.get('result').get('results')
            }));
        }
    });
});
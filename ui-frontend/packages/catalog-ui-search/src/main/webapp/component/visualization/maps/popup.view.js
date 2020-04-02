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

import * as React from 'react'
const Marionette = require('marionette')
const store = require('../../../js/store.js')

import PopupPreview from '../../../react-component/popup-preview'

const PopupPreviewView = Marionette.ItemView.extend({
  selectionInterface: store,
  initialize(options) {
    this.map = options.map
    this.mapModel = options.mapModel

    this.map.onLeftClick(this.onLeftClick.bind(this))

    this.listenForCameraChange()
  },
  template() {
    this.component = <PopupPreview map={this.mapModel} />
    return this.component
  },
  /**
   * Determine whether the component should be shown
   */
  getMetacard() {
    return this.mapModel.get('popupMetacard')
  },
  /**
          Update the event position in the model, will trigger popup to check if it needs to be shown
          TODO: add the event position so that its not distance info position
         */
  onLeftClick(event, mapEvent) {
    event.preventDefault()
    this.$el
      .find('.map-context-menu')
      .css('left', event.offsetX)
      .css('bottom', event.offsetY)
    this.mapModel.setPopupLocation({
      left: event.clientX,
      bottom: event.clientY,
    })
    this.mapModel.setPopupMetacard(this.mapModel.get('targetMetacard'))
  },
  /**
   * Methods for moving the popup when there is camera movement
   */
  listenForCameraChange() {
    this.map.onCameraMoveStart(this.handleCameraMoveStart.bind(this))
    this.map.onCameraMoveEnd(this.handleCameraMoveEnd.bind(this))
  },
  handleCameraMoveStart() {
    if (this.getMetacard()) {
      this.startPopupAnimating()
    }
  },
  handleCameraMoveEnd() {
    if (this.getMetacard()) {
      window.cancelAnimationFrame(this.popupAnimationFrameId)
    }
  },
  /**
   * Maps give the points location using 'top', but 'bottom' must be used since the
   * popup grows up from the location of the point
   */
  convertTopToBottom(top) {
    return window.screen.availHeight - top
  },
  startPopupAnimating() {
    const map = this.map
    const mapModel = this.mapModel
    this.popupAnimationFrameId = window.requestAnimationFrame(() => {
      const location = map.getWindowLocationsOfResults([this.getMetacard()])[0]
      mapModel.setPopupLocation({
        left: location[0],
        bottom: this.convertTopToBottom(location[1]),
      })
      this.startPopupAnimating()
    })
  },
})

module.exports = PopupPreviewView

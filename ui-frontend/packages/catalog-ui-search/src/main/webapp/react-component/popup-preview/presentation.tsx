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
import styled from 'styled-components'

type Props = {
  titleText: string
  previewText: string
  left: number
  bottom: number
}

const Root = styled.div<Props>`
  font-family: 'Inconsolata', 'Lucida Console', monospace;
  background: ${props => props.theme.backgroundModal};
  display: block;
  width: auto;
  height: auto;
  font-size: ${props => props.theme.mediumFontSize};
  position: absolute;
  text-align: left;
  padding: 4px;
  max-width: 50%;

  &::before {
    top: 100%;
    content: ' ';
    border-top: 15px solid ${props => props.theme.backgroundModal};
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    height: 0;
    width: 0;
    left: 50%
    position: absolute;
    pointer-events: none;
  }
`

const Title = styled.div`
  font-size: 20px;
  margin: 0;
  padding: 2px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Open Sans', arial, sans-serif;
`

const Preview = styled.div`
  position: relative;
  min-width: 200px;
  min-height: 150px;
  height: 100%;
  max-height: 250px;
  padding: 2px;
  white-space: normal;
  background-color: @backgroundAccentContent;
  border: 2px solid;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

const PreviewText = styled.p`
  font-family: 'Open Sans', arial, sans-serif;
  font-size: 14px;
  padding: 2px 4px;
  margin-bottom: 15px;
`

const render = (props: Props) => {
  return (
    <Root {...props} style={{ left: props.left, bottom: props.bottom }}>
      <Title>{props.titleText}</Title>
      {props.previewText ? (
        <Preview>{<PreviewText>{props.previewText}</PreviewText>}</Preview>
      ) : (
        undefined
      )}
    </Root>
  )
}

export default render

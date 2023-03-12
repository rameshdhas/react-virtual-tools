import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  width: 64px;
  height: 64px;
  background: rgba(227, 73, 28, 0.8);
  outline: none;
  border: none;
  cursor: pointer;
  z-index: 5;
  :hover {
    background: #fb6d42;
  }
`

const Border = styled.div`
//  background: rgba(255, 255, 255, 0.4);
//  height: 80px;
//  width: 80px;
//  border-radius: 50%;
`

Button.defaultProps = {
  color: 'black',
  backgroundColor: 'white'
}

export default (props) => (
  <Border>
    <Button {...props} />
  </Border>
)

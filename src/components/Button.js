import React from 'react'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  background: ${props => props.bg};
  background-blend-mode: soft-light, normal;
  border-radius: ${props => props.radius};
  width: ${props => props.width};
  height: ${props => props.height};
  &.active {
    background: ${props => props.activeBg};
  }
  position: relative;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: ${props => props.padding ? props.padding + ' !important' : null};
`

export default function Button({disabled, children, className, onClick, ...rest}) {
  return (
    <ButtonContainer
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={`rounded-3xl py-3.5 text-sm text-white flex items-center justify-center ${className}`}
      {...rest}
    >
      {
        disabled &&
          <div
            style={{
              background: "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
              borderRadius: rest.radius
            }}
            className="absolute left-0 top-0 w-full h-full rounded-3xl"
          />
      }
      {
        children
      }
    </ButtonContainer>
  )
}
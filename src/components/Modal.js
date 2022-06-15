import React, { useEffect } from 'react'

import { MdClose } from 'react-icons/md'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
`
const ModalContainer = styled.div`
  background: linear-gradient(311.99deg,rgba(0,0,0,0.3) -22.55%,rgba(255,255,255,0.3) 131.34%),#4E555D;
  background-blend-mode: soft-light, normal;
`
const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #FFFFFF44;
  opacity: 0.3;
`

function CloseButton({onClick}) {
  return (
    <div className="cursor-pointer icon-btn" onClick={onClick}>
      <MdClose />
    </div>
  )
}

function Modal({title, children, hasClose, onClose, show, ModalFooter}) {

  const handleClick = (e, callback) => {

    e.stopPropagation()
    if(callback)
      callback()
  }

  useEffect(() => {
    if(show)
      document.body.className = "overflow-hidden"
    else
      document.body.className = ""
  }, [show])

  return (
    show?
    <ModalOverlay
      className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 fade-in"
      onClick={(e) => handleClick(e, onClose)}
    >
      <ModalContainer
        className="rounded-2xl mx-3 w-full max-w-2xl modal-content-fade"
        onClick={(e) => handleClick(e)}
      >
        <div className="text-white text-md flex items-center justify-between px-5 py-3 ">
          <span>{title}</span>
          {
            hasClose && <CloseButton onClick={(e) => handleClick(e, onClose)} />
          }
        </div>
        <ModalDivider />
        <div className="p-4">
          {children}
        </div>
        <ModalDivider />
        {
          ModalFooter &&
            <div className="px-5 py-3">
              <ModalFooter />
            </div>
        }
      </ModalContainer>
    </ModalOverlay>:null
  )
}

export default Modal

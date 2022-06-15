import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWalletSwitchModal } from '../state/application/hooks'
const TestbtnContainer =styled.div`
backgorund:${props => props.backcolor};
width:${props=>props.btnwidth};
height:${props=>props.btnheight};
border.radius:${props =>props.btnborderradius};
&.active {
    background:${props =>props.activecolor};
}
position: relative;

cursor:${props => props.disabled ? 'not-allowd':'pointer'};
padding: ${props => props.padding ? props.padding + ' !important' : null};
`

const btnclassname = 'rounded-2xl  mt-3 py-1.1 text-lg text-red-900   justify-center w-full  bg-gray-400'
function TestBtnModal()
{
    
}

export default function TestBanner({title,btnwidth,eventType})
{
    const [login,Setlogin] =useState(0);
    const modalreuse = useWalletSwitchModal()
    return (
        <>
        {
            
            <TestbtnContainer btnwidth= {btnwidth} className={btnclassname} onClick ={eventType}>{title}</TestbtnContainer>
        

        }
      </>
    )
}
import React from 'react'
import styled from 'styled-components'
import { Pie } from "react-chartjs-2";
import { AiOutlineArrowRight } from 'react-icons/ai'

import { useGetBalance, useGetPrice } from '../../state/token/hooks';
import { formatValue, toFloat } from '../../utils/number'

import bamboo_logo from '../../assets/tokens/bamboo.png'
import bnb_logo from '../../assets/tokens/bnb.png'
import spnd_logo from '../../assets/tokens/panda.png'
import wow_logo from '../../assets/tokens/wow.png'
import { Tokens } from '../../constants/tokens'

const WalletContainer = styled.div`
  background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.3) -62.55%, rgba(255, 0, 255, 0.3) 131.34%), #4E555D;
  background-blend-mode: soft-light, normal;
  border-radius: 45px;
  position: relative;
  margin: 10px 0;
`

function BalancePanel({icon, title, balance, price, change}) {
  return (
    <WalletContainer
      className="w-full max-w-2xl dark-box-shadow flex flex-row items-center justify-content text-white p-3"
    >
      <img src={icon} width={48} height={48} alt="" className="mr-3" />
      <div
        className="flex flex-col flex-grow items-center justify-start text-left"
      >
        <span className="w-full">{title}</span>
        <span className="w-full text-xs number-font opacity-60">{formatValue((Math.trunc(toFloat(balance) * 100) / 100))}</span>
      </div>
      <div
        className="flex flex-col items-center justify-end text-right"
      >
        <span className="w-full number-font">${formatValue((Math.trunc(toFloat(price) * 100) / 100).toFixed(2))}</span>
        <div
          className="w-full flex flex-row justify-end items-center hidden"
        >
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "5px solid #30CC2D",
              marginRight: '3px'
            }}
          />
          <span className="text-xs number-font opacity-60">{(Math.trunc(toFloat(change) * 100) / 100).toFixed(2)}%</span>
        </div>
      </div>
    </WalletContainer>
  )

}

function WalletPage() {
  const balanceBNB = useGetBalance('BNB')
  const priceBNB = useGetPrice('BNB')
  
  const balanceSPND = useGetBalance('SPND')
  const priceSPND = useGetPrice('SPND')
  
  const balanceBMBO = useGetBalance('BMBO')
  const priceBMBO = useGetPrice('BMBO')

  const balanceWOW = useGetBalance('WOW')
  const priceWOW = useGetPrice('WOW')

  
  const pieOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: false
  }

  const balanceColors = [
    Tokens.BNB.color,
    Tokens.SPND.color,
    Tokens.BMBO.color,
    Tokens.WOW.color,
  ]

  const data = {
    labels: [
        Tokens.BNB.name, Tokens.SPND.name, Tokens.BMBO.name, Tokens.WOW.name,
    ],
    datasets: [
      {
        data: [
            (balanceBNB * priceBNB),
            (balanceSPND * priceSPND * priceBNB),
            (balanceBMBO * priceBMBO * priceBNB),
            (balanceWOW * priceWOW * priceBNB),
        ],
        backgroundColor: balanceColors,
        borderWidth: 0
      }
    ]
  }

  const totalFund = (
      (balanceBNB * priceBNB) +
      (balanceSPND * priceSPND * priceBNB) +
      (balanceBMBO * priceBMBO * priceBNB) +
      (balanceWOW * priceWOW * priceBNB)
  );

  const Balance = ({icon, value, color}) => {
    return (
      <div className="flex flex-row items-center justify-start">
        <img src={icon} width={24} height={24} alt="" className="mr-1.5" />
        <span className="number-font text-xs" style={{color}}>{(Math.trunc(value === 0 ? 0 : value / totalFund * 10000) / 100).toFixed(2)}%</span>
      </div>
    )
  }

  return (
    <>
      <WalletContainer
        className="w-full max-w-2xl dark-box-shadow flex flex-col items-center justify-content text-white p-3"
      >
        {
          totalFund === 0 ?
            <>
              <div
                className="w-full relative"
              >
                <div className="w-full" style={{marginBottom: '100%'}} />
                <div
                  className="absolute left-0 top-0 w-full h-full"
                  style={{
                    padding: '30px 50px 0 50px'
                  }}
                >
                  <div
                    className="rounded-full w-full"
                    style={{
                      background: "linear-gradient(125deg, #7CF4D7, #ED21FA)",
                      height: 'calc(100% - 70px)'
                    }}
                  />

                  <div
                    className="absolute rounded-full"
                    style={{
                      width: "calc(100% - 130px)", height: "calc(100% - 130px)",
                      left: "50%", top: "calc(50% - 20px)", transform: "translate(-50%, -50%)",
                      background: "#4E555D"
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-white opacity-60">
                      <span>Anji Balance</span>
                      <span className="number-font mt-3" style={{fontSize: 20}}>$00.00</span>
                      <div className="flex flex-col items-center justify-center mt-6 hidden">
                        <span>Need help</span>
                        <span>getting started?</span>
                        <AiOutlineArrowRight className="cursor-pointer mt-2" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3"
                style={{
                  marginTop: '-55px'
                }}
              >
                <Balance icon={spnd_logo} value={0} color={Tokens.SPND.color} />
                <Balance icon={bamboo_logo} value={0} color={Tokens.BMBO.color} />
                <Balance icon={wow_logo} value={0} color={Tokens.WOW.color} />
                <Balance icon={bnb_logo} value={0} color={Tokens.BNB.color} />
              </div>
            </>
          :
            <>
              <div
                className="w-full relative"
                style={{
                  padding: '30px 50px 0 50px'
                }}
              >
                <Pie data={data} options={pieOptions} width={1} height={1} />
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "calc(100% - 130px)", height: "calc(100% - 60px)",
                    left: "50%", top: "calc(50% + 15px)", transform: "translate(-50%, -50%)",
                    background: "#4E555D"
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center text-white">
                    <span>Anji Balance</span>
                    <span className="number-font mt-3" style={{fontSize: 20}}>${formatValue((Math.trunc(toFloat(totalFund) * 100) / 100).toFixed(2))}</span>
                  </div>
                </div>
              </div>
              <div
                className="grid grid-cols-4 gap-3 mt-3"
              >
                <Balance icon={spnd_logo} value={balanceSPND * priceSPND * priceBNB} color={Tokens.SPND.color} />
                <Balance icon={bamboo_logo} value={balanceBMBO * priceBMBO * priceBNB} color={Tokens.BMBO.color} />
                <Balance icon={wow_logo} value={balanceWOW * priceWOW * priceBNB} color={Tokens.WOW.color} />
                <Balance icon={bnb_logo} value={balanceBNB * priceBNB} color={Tokens.BNB.color} />
              </div>
            </>
        }
      </WalletContainer>
      <BalancePanel
        icon={spnd_logo}
        title={Tokens.SPND.name}
        balance={balanceSPND}
        price={balanceSPND * priceSPND * priceBNB}
        change={100}
      />
      <BalancePanel
        icon={bamboo_logo}
        title={Tokens.BMBO.name}
        balance={balanceBMBO}
        price={balanceBMBO * priceBMBO * priceBNB}
        change={100}
      />
      <BalancePanel
        icon={wow_logo}
        title={Tokens.WOW.name}
        balance={balanceWOW}
        price={balanceWOW * priceWOW * priceBNB}
        change={100}
      />
      <BalancePanel
        icon={bnb_logo}
        title={Tokens.BNB.name}
        balance={balanceBNB}
        price={balanceBNB * priceBNB}
        change={100}
      />
    </>
  )
}

export default WalletPage

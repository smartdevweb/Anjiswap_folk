/*global chrome*/
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BsArrowLeft, BsExclamationCircle } from "react-icons/bs";
import { IoLockClosedSharp } from "react-icons/io5";
import { MdLockOpen } from "react-icons/md";

import Modal from "../../components/Modal";
import { injected, walletconnect } from "../../constants/web3";
import Button from "../../components/Button";
import TokenSelect from "../../components/TokenSelect";
import { useStakingContract } from "../../hooks/useContract";
import { useChromeStorageLocal } from "use-chrome-storage";
import {
  TokenKeys,
  resetToken,
  setCurrentToken,
  setToken,
} from "../../state/swap/actions";
import {
  useModalOpen,
  useWalletModalToggle,
} from "../../state/application/hooks";
import { useGetToken } from "../../state/swap/hooks";
import { setTx } from "../../state/tx/actions";
import { formatValue, noExponents, toFloat } from "../../utils/number";
import {
  formatBN,
  formatBalance,
  getAllowance,
  getBalance,
  getContract,
  getEarned,
  getShare,
  getStakable,
  getStaked,
  isRightNetwork,
} from "../../utils/web3";
import { ApplicationModal } from "../../state/application/actions";
import { BiRefresh } from "react-icons/bi";

import TestBanner from "../../containers/testbanner";
import { useWalletSwitchModal } from "../../state/application/hooks";
import MetamaskIcon from "../../assets/wallet/metamask.png";

import TrustWalletIcon from "../../assets/wallet/trustWallet.png";
import WalletConnectIcon from "../../assets/wallet/walletConnectIcon.svg";
import { isIOS } from "react-device-detect";
import usePrevious from "../../hooks/usePrevious";
import BEP20_ABI from "../../assets/contracts/bep20_abi.json";
import { BMBO_WOW_STAKE } from "../../constants/contracts";
import { Tokens } from "../../constants/tokens";

export default function TestPage() {
  const { account, connector, deactivate, chainId, library } = useWeb3React();
  const modalreuse = useWalletSwitchModal();
  const testtest = () => {
    modalreuse();
    const x = localStorage.getItem("data");
    document.onkeydown = function (e) {
      alert("dd");
    };
    window.setInterval(function () {});
  };
  const [balance1, setBalance1] = useState(0);
  useEffect(() => {
    async function fatchbalance() {
      try {
        let newValue = await getBalance(account, undefined, library);
        console.log(newValue);
        newValue = formatBalance(newValue);

        setBalance1(Math.trunc(toFloat(newValue) * 100) / 100);
      } catch (e) {
        console.log(e);
      }
    }
    fatchbalance();
  }, [account]);
  const logout = () => {
    deactivate();
    if (typeof connector.close === "function") {
      connector.close();
    }
  };

  return !account ? (
    <TestBanner
      title="Connect"
      btnwidth="8em"
      eventType={testtest}
    ></TestBanner>
  ) : (
    <>
      <TestBanner
        title="Disconnect"
        btnwidth="8em"
        eventType={logout}
      ></TestBanner>
      <div className="inline-block animate-bounce  bg-gray-500 text-white text-xl border-solid m-2">
        {account}
      </div>
      <div className="inline-block animate-bounce  bg-gray-500 text-white text-xl border-solid m-2">
        {balance1} BNB
      </div>
    </>
  );
}

import { InlineFooter } from "./Footer";
import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/logos/AnjiLogo-colour.png";
import styled from "styled-components";
import usePath from "../hooks/usePath";

const Menus = styled.div`
  background: linear-gradient(
      134.85deg,
      rgba(0, 0, 0, 0.4) -9.62%,
      rgba(255, 255, 255, 0.4) 136.92%
    ),
    #4e555d;
  background-blend-mode: soft-light, normal;
  box-shadow: inset 2.5px 2.5px 5px #35373e;
  border-radius: 20px;
  @media (min-width: 961px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;
const MenuItem = styled.div`
  background: ${(props) =>
    props.active
      ? "linear-gradient(313.34deg, rgba(0, 0, 0, 0.3) -28.92%, rgba(255, 255, 255, 0.3) 130.82%), #4E555D"
      : ""};
  box-shadow: ${(props) =>
    props.active
      ? "-5px -1px 10px rgb(250 251 255 / 20%), 5px 5px 10px #35373E"
      : ""};
  background-blend-mode: soft-light, normal;
  border-radius: 20px;
  user-select: none;
  width: 60px;
  height: 29px;
`;

const HeaderContainer = styled.div`
  background: linear-gradient(
      316.23deg,
      rgba(0, 0, 0, 0.3) -12.29%,
      rgba(255, 255, 255, 0.3) 112.77%
    ),
    #4e555d;
  background-blend-mode: soft-light, normal;
  box-shadow: -15px -15px 20px rgba(250, 251, 255, 0.4), 15px 15px 30px #35373e;
  border-radius: 0px 0px 20px 20px;
  height: 60px;
`;

function Header() {
  const path = usePath();

  const paths = [
    {
      path: "/swap",
      label: "Swap",
    },
    {
      path: "/stake",
      label: "Stake",
    },
    {
      path: "/",
      label: "Wallet",
    },
  ];

  return (
    <HeaderContainer className="w-full flex flex-row items-center justify-between p-4 header-container">
      <img className="w-10 md:w-14" src={logo} alt="logo" />
      <Menus className="p-0.5 flex flex-row items-center justify-center h-10 dark-box-shadow">
        {paths.map((item, index) => (
          <MenuItem
            className="m-1 text-white text-sm font-medium flex items-center justify-center"
            active={path === item.path}
            key={index}
          >
            <Link to={item.path}>{item.label}</Link>
          </MenuItem>
        ))}
      </Menus>
      <InlineFooter />
    </HeaderContainer>
  );
}

export default Header;

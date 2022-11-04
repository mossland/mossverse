import React from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { Container } from "./Container";
import { Menu, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";

export const Header = ({ accountName, logout }: any) => {
  return (
    <StyledHeader>
      <Container>
        <Title>
          <Link to="/">
            <h1>연리지</h1>
          </Link>
        </Title>
        <StyledMenu mode="horizontal" triggerSubMenuAction="click">
          <Menu.Item key="marketing">
            <NavLink to="/marketing">Marketing</NavLink>
          </Menu.Item>
          <Menu.Item key="users">
            <NavLink to="/users">Users</NavLink>
          </Menu.Item>
          <Menu.Item key="messenger">
            <NavLink to="/messenger">Messenger</NavLink>
          </Menu.Item>
          {/* <Menu.Item key="calls">
            <NavLink to="/calls">Calls</NavLink>
          </Menu.Item>*/}
          <Menu.Item key="stories">
            <NavLink to="/stories">Stories</NavLink>
          </Menu.Item>
          {/* <Menu.Item key="interviews">
            <NavLink to="/interviews">Interviews</NavLink>
          </Menu.Item> */}
          <Menu.Item key="services">
            <NavLink to="/services">Services</NavLink>
          </Menu.Item>
          <Menu.Item key="admins">
            <NavLink to="/admins">Admins</NavLink>
          </Menu.Item>
          <Menu.Item key="resources">
            <NavLink to="/resources">Resources</NavLink>
          </Menu.Item>
          {/* <Menu.Item key="lab">
            <NavLink to="/lab">Lab</NavLink>
          </Menu.Item> */}
          <Menu.SubMenu key="SubMenu" title={accountName} icon={<EditOutlined />}>
            <Menu.Item key="factory">
              <NavLink to="/factory">Factory</NavLink>
            </Menu.Item>
            <Menu.Item key="summary">
              <NavLink to="/summary">Analysis</NavLink>
            </Menu.Item>
            <Menu.Item key="crawlUser">
              <NavLink to="/crawlUser">Crawl</NavLink>
            </Menu.Item>
            <Divider />
            <Menu.Item key="logout" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu.SubMenu>
        </StyledMenu>
      </Container>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  background: #4a4a4a;
  margin-bottom: 1rem;
  box-shadow: 0 1px 2px 0 rgba(34, 36, 38, 0.15);
  min-height: 96px;
  display: flex;
  align-items: center;
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Title = styled.div`
  display: inline-block;
  h1 {
    color: #babdbf !important;
  }
`;

const StyledMenu = styled(Menu)`
  display: inline-block;
  flex: auto;
  text-align: right;
  background-color: transparent;
  &.ant-menu-horizontal {
    border-bottom: 0px;
  }
  .ant-menu-item-selected .ant-menu-title-content *,
  .ant-menu-item:hover .ant-menu-title-content *,
  .ant-menu-submenu:hover *,
  .ant-menu-submenu-open *,
  .ant-menu-submenu-selected * {
    color: white;
  }

  .ant-menu-horizontal,
  .ant-menu-item::after,
  .ant-menu-submenu::after {
    border: none !important;
  }

  .ant-menu-submenu {
    background-color: #79858c;
    color: #fff;
  }

  a {
    color: #fff !important;
  }
  a:hover {
    color: #ccc !important;
  }
  .active {
    font-weight: bold;
  }
`;

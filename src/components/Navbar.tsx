import {
  Button,
  Dropdown,
  MenuProps,
  Select,
  Slider,
  Space,
  Switch,
} from "antd";
import styled from "styled-components";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import { VisualizeState } from "../types";

interface NavbarStyle {
  $height: number;
}

interface NavbarProps {
  navbarStyle: NavbarStyle;
  visualizeState: VisualizeState;
  changeAlgoOnClick: (value: string) => void;
  onChangeAnimationSpeed: (value: number | [number, number]) => void;
  onChangeAnimationEnabled: (value: boolean) => void;
  visualizeOnClick: () => void;
  resetGridOnClick: () => void;
  resetWallsOnClick: () => void;
  resetVisualizationOnClick: () => void;
}

export default function Navbar({
  navbarStyle,
  visualizeState,
  changeAlgoOnClick,
  onChangeAnimationSpeed,
  onChangeAnimationEnabled,
  visualizeOnClick,
  resetGridOnClick,
  resetWallsOnClick,
  resetVisualizationOnClick,
}: NavbarProps) {
  const items: MenuProps["items"] = [
    {
      label: (
        <>
          <span>Animation Speed</span>
          <Slider
            defaultValue={10}
            min={1}
            max={10}
            onChange={onChangeAnimationSpeed}
          />
        </>
      ),
      key: "animation-speed-slider",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Space>
          <span>Enable Animation</span>
          <Switch defaultChecked onChange={onChangeAnimationEnabled} />
        </Space>
      ),
      key: "animation-switch",
    },
  ];

  const [open, setOpen] = useState(false);

  const disabled = visualizeState === "running";

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <StyledNav $height={navbarStyle.$height}>
      <LogoButton>Pathfinding Visualizer</LogoButton>
      <Space>
        <Select
          defaultValue="bfs"
          style={{ width: 180 }}
          bordered={false}
          onChange={changeAlgoOnClick}
          disabled={disabled}
          options={[
            {
              label: "Unweighted",
              options: [
                { label: "Breath First Search", value: "bfs" },
                { label: "Depth First Search", value: "dfs" },
              ],
            },
            {
              label: "Weighted",
              options: [
                { label: "Dijkstra's Algorithm", value: "dijkstra" },
                { label: "A* Search", value: "astar" },
              ],
            },
          ]}
        />
        <Button type="primary" disabled={disabled} onClick={visualizeOnClick}>
          Visualize
        </Button>
        <Button type="text" disabled={disabled} onClick={resetGridOnClick}>
          Reset Board
        </Button>
        <Button type="text" disabled={disabled} onClick={resetWallsOnClick}>
          Reset Walls
        </Button>
        <Button
          type="text"
          disabled={disabled}
          onClick={resetVisualizationOnClick}
        >
          Reset Visualization
        </Button>
      </Space>
      <Dropdown
        menu={{ items }}
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["click"]}
        disabled={disabled}
      >
        <ClearButton>
          <IoSettingsOutline size={24} />
        </ClearButton>
      </Dropdown>
    </StyledNav>
  );
}

const StyledNav = styled.nav<NavbarStyle>`
  height: ${(props) => props.$height}px;

  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: Helvetica;
  color: rgba(0, 0, 0, 85);
  cursor: pointer;

  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`;

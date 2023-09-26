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
import * as Consts from "../constants";
import { DownOutlined } from "@ant-design/icons";

interface NavbarStyle {
  $height: number;
}

interface NavbarProps {
  navbarStyle: NavbarStyle;
  visualizeState: VisualizeState;
  changeAlgoOnClick: (value: string) => void;
  onClickMazeAndPatternOption: MenuProps["onClick"];
  onChangeAnimationSpeed: (value: number | [number, number]) => void;
  onChangeAnimationEnabled: (value: boolean) => void;
  visualizeOnClick: () => void;
  resetGridOnClick: () => void;
  resetWallsOnClick: () => void;
  resetVisualizationOnClick: () => void;
}

const mazeAndPatternGenerationOptions: MenuProps["items"] = [
  {
    key: "maze-generation",
    type: "group",
    label: "Maze Generation",
    children: [
      { label: "Recursive Division", key: "recursive-division" },
      { label: "Random Walls", key: "random-walls" },
    ],
  },
  {
    key: "pattern-generation",
    type: "group",
    label: "Pattern Generation",
    children: [
      { label: "Simple Stair", key: "simple-stair" },
      { label: "Diagonal Line", key: "diagonal-line" },
      { label: "Concentric Circles", key: "concentric-circles" },
      { label: "Vertical Stripes", key: "vertical-stripes" },
      { label: "Horizontal Stripes", key: "horizontal-stripes" },
    ],
  },
];

export default function Navbar({
  navbarStyle,
  visualizeState,
  changeAlgoOnClick,
  onClickMazeAndPatternOption,
  onChangeAnimationSpeed,
  onChangeAnimationEnabled,
  visualizeOnClick,
  resetGridOnClick,
  resetWallsOnClick,
  resetVisualizationOnClick,
}: NavbarProps) {
  const visualizationConfigItems: MenuProps["items"] = [
    {
      label: (
        <>
          <span>Animation Speed</span>
          <Slider
            defaultValue={Consts.DEFAULT_ANIMATION_SPEED}
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
          <Switch
            defaultChecked={Consts.DEFAULT_IS_ANIMATION_ENABLED}
            onChange={onChangeAnimationEnabled}
          />
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
      <Space>
        <LogoButton>Pathfinding Visualizer</LogoButton>
        <Dropdown
          menu={{
            items: mazeAndPatternGenerationOptions,
            onClick: onClickMazeAndPatternOption,
          }}
          trigger={["click"]}
          disabled={disabled}
        >
          <Button type="text">
            Mazes & Patterns <DownOutlined />
          </Button>
        </Dropdown>
        <Select
          defaultValue={Consts.DEFAULT_ALGO_VALUE}
          style={{ width: "180px" }}
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
        menu={{ items: visualizationConfigItems }}
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
  justify-content: space-between;
  padding: 0 32px;
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
  font-family: inherit;

  display: flex;
  align-items: center;
  justify-content: center;
`;

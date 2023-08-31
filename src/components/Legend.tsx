import styled from "styled-components";

interface LegendStyle {
  $height: number;
}

interface LegendProps {
  legendStyle: LegendStyle;
}

export default function Legend({ legendStyle }: LegendProps) {
  return <StyledLegend $height={legendStyle.$height}></StyledLegend>;
}

const StyledLegend = styled.div<LegendStyle>`
  display: flex;
  flex-direction: column;
  height: ${(props) => props.$height}px;
  width: 100%;
`;

import * as React from 'react';
import styled from 'styled-components';
import { Seat } from '../model/models';

const Row = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const cellColor = {
  0: '#d2ffd2',
  1: 'yellow',
  2: 'blue'
};

type CellProps = {
  state: number       // 0表示可选择，1表示已被他人选择，2表示已被自己选择
};

const Cell = styled.li`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid lightgray;
    background-color: ${(props: CellProps) => cellColor[props.state]};

    transition: all 0.3s;

    &:hover{
        cursor: pointer;
    }
`;

type Props = {
  seatMap: number[][]
  selectedSeats: Seat[]
  onToggle: (rowNum: number, columnNum: number) => void
  hidden?: boolean
};

export function SeatPicker({ onToggle, seatMap, hidden = false, selectedSeats }: Props) {
  return (
    <div style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      {seatMap.map((row, rowNum) =>
        <Row key={rowNum}>
          {row.map((state, columnNum) => {
            const isSelected = !!selectedSeats.find(
              s => s.rowNum === rowNum && s.columnNum === columnNum
            );
            return (
              <Cell
                key={columnNum}
                state={isSelected ? 2 : state}
                onClick={() => onToggle(rowNum, columnNum)}
              />
            );
          })}
        </Row>)}
    </div>
  );
}

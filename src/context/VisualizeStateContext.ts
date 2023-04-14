import { createContext } from "react";
import { VisualizeState, VisualizeStateReducerAction } from "../types";


export const VisualizeStateContext = createContext<VisualizeState>('idle');
export const VisualizeStateDispatchContext = createContext<React.Dispatch<VisualizeStateReducerAction>>(() => {});
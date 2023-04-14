import { createContext } from "react";
import { VisualizeState } from "../types";


export const VisualizeStateContext = createContext<VisualizeState>('idle');
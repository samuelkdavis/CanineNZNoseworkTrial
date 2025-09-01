import React from "react";
import { ServiceContainer } from "./ServiceContainer";

export const ServiceContext = React.createContext<ServiceContainer | null>(null);
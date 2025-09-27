import usePresenceHub from "@/hooks/usePresenceHub ";
import type { HubConnection } from "@microsoft/signalr";
import { createContext, type ReactNode } from "react";

type HubContextType = {
  hubConnection: HubConnection | null;
};

const HubContext = createContext<HubContextType>({ hubConnection: null });

type THubProviderProps = {
  children: ReactNode;
};

function HubProvider({ children }: THubProviderProps) {
  const hubConnection = usePresenceHub();

  return (
    <HubContext.Provider value={{ hubConnection }}>
      {children}
    </HubContext.Provider>
  );
}

export { HubContext };
export default HubProvider;

import { Language } from "../src/resources.js";

interface ProtoBufHeader {
  steamid: Long;
  clientSessionid: number;
  jobidSource?: Long;
  jobidTarget?: Long;
  targetJobName?: string;
  eresult?: number;
  errorMessage?: string;
}

interface ClientChangeStatus {
  personaState?: keyof typeof Language.EPersonaState;
  playerName?: string;
}

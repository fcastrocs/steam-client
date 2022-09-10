interface ProtoBufHeader {
  steamid: Long;
  clientSessionid: number;
  jobidSource?: Long;
  jobidTarget?: Long;
  targetJobName?: string;
  eresult?: number;
  errorMessage?: string;
}

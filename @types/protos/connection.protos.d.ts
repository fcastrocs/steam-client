type CMsgProtoBufHeader = {
  steamid: Long;
  clientSessionid: number;
  jobidSource?: Long;
  jobidTarget?: Long;
  targetJobName?: string;
  eresult?: number;
  errorMessage?: string;
}

type CMsgMulti = {
  sizeUnzipped: number;
  messageBody: Buffer;
}
interface NebPay {
  pay(to: Address, value: string, options?: NebPayOptions): SerialNumber
  nrc20Pay(currency: string, to: Address, value: string, options?: NebPayOptions): SerialNumber
  deploy(code: string, language: string, args: string, options?: NebPayOptions): SerialNumber
  call(to: Address, value: string, functionName: string, args: string, options?: NebPayOptions): SerialNumber
  simulateCall(to: Address, value: string, functionName: string, args: string, options?: NebPayOptions): SerialNumber
  queryPayInfo(serialNumber: string, options?: NebPayOptions): string
}

interface NebPayOptions {
  goods?: {
    name: string,
    desc?: string,
    orderId?: string,
    ext?: string
  }
  qrcode?: {
    showQrCode: boolean,
    container?
  }
  callback?: string
  listener?: (response: ContractCallResult) => void
  nrc20?: Nrc20Currency
}

interface Nrc20Currency {
  address: Address
  name: string
  symbol: string
  decimals: number
}

type SerialNumber = string

interface Block {
  hash: Hash
  parentHash: Hash
  height: number
  nonce: number
  coinbase: Hash
  timestamp: Timestamp
  chainId: ChainId
  stateRootHash: Hash
  txsRootHash: Hash
  eventsRootHash: Hash
  consensusRoot: Consensus
  minerAddress: Address
  isFinality: boolean
  transactions: Transaction[]
}

interface NebState {
  chainId: ChainId
  tailHash: Hash
  libHash: Hash
  height: number
  protocolVersion: string
  isSynchronized: boolean
  version: string
}

interface Transaction {
  chainID: number,
  from: Account,
  to: Account |Address,
  value: string,
  nonce: number,
  gasPrice: number,
  gasLimit: number,
  contract: Contract
}

interface AccountState {
  balance: Value
  nonce: number
  type: AddressType
}

interface Consensus {
  timestamp: Timestamp
  proposer: string
  dynastyRoot: string
}

interface ContractCallResult {
  result: any
  executionError: string
  estimatedGas: number
}

interface Contract {
  source?: string
  sourceType?: 'js' | 'ts'
  function: string
  args: string
}

interface TransactionOptions {
  from: Address
  to: Address
  value: Value
  nonce: number
  gasPrice: number
  gasLimit: number
  contract?: Contract
  binary?: string
}

interface TransactionResult {
  txHash: string,
  contractAddress?: Address
}

interface TransactionReceipt {
  hash: Hash
  chainId: number
  from: Address
  to: Address
  value: Value
  nonce: number
  timestamp: Timestamp
  type: number
  data: {}
  gasPrice: number
  gasLimit: number
  contractAddress: Address
  status: Status
  gasUsed: number
}

interface NodeInfo {
  id: Hash
  chainId: number
  coinbase: Hash
  peerCount: number
  isSynchronized: boolean
  bucketSize: number
  protocolVersion: string
  routes: Route[]
}

interface Route {
  id: Hash
  address: string[]
}

interface KeyOptions {
  salt: Buffer
  iv: Buffer
  kdf: string
  dklen: number
  c: number
  n: number
  r: number
  p: number
  cipher: string
  uuid: Buffer
}

interface ApiOptions {
  testnet?: boolean,
  localNode?: boolean,
  mainnet?: boolean
}

interface Key {
  version: number
  id: Buffer
  address: Address
  crypto: {}
}

interface Dynasty {
  miners: Address[]
}

type Address = string
type Hash = string
type Timestamp = string
type ChainId = number
type Value = string

type Status = Failed | Succeeded | Pending

type AddressType = NormalAddress | ContractAddress

type NormalAddress = 87
type ContractAddress = 88

type Failed = 0
type Succeeded = 1
type Pending = 2

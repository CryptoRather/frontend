import BigNumber from 'bignumber.js'
import * as NebulasPay from '../nebPay/nebpay.js'
import Nebulas from '../nebulify/Nebulas'
import Account from '../nebulify/Account'
import { Question } from '../models/Question'

export const testnetContractAddress = 'n1hmFq3UqbFCUgm6eNajZ3nxLLvwMSP1BxK'
export const mainnetContractAddress = 'n1gPix5ZnSzxKkdrUJtZmQzLLS9SyxYa5qL'
export const cryptoEitherAccount = Account.fromAddress('n1FhdXhRaDQWvCMwC29JBMuuCxUczUuecYU')

export type CallResult = NebulasCallResult & {
  serialNumber?: string
}

export type NebulasCallResult = ContractCallResult & {
  transaction?: {
    txHash: Hash,
    contractAddress: Address
  }
}

export default class Api {
  public isTestnet: boolean

  private nebulas: Nebulas
  private nebPay: NebPay
  private contractAddress: string

  get chainId() {
    return this.isTestnet ? 1001 : 100 // TODO: 1 might not be mainnet
  }

  constructor() {
    this.nebulas = new Nebulas()

    this.setApi(false)

    this.nebPay = new NebulasPay()
  }

  async get(id: string): Promise<Question> {
    try {
      let question

      do {
        question = await this.nebulasCall<Question>('get', [id], new BigNumber(0))
      } while (question === null)

      return question
    } catch {
    }
  }

  async getExact(idA: string, idB: string): Promise<Question> {
    return await this.nebulasCall<Question>('getExact', [idA, idB], new BigNumber(0))
  }

  async vote(question: Question, optionA: boolean, dryRun: boolean = false): Promise<boolean> {
    return await this.call<boolean>('vote', [question.scenarioA.id, question.scenarioB.id, optionA], new BigNumber(0), dryRun)
  }

  async add(scenarioA: string, scenarioB: string, dryRun = false) {
    return await this.call('add', [{
      scenario: scenarioA
    }, {
      scenario: scenarioB
    }], new BigNumber(0), dryRun)
  }

  async getScenarioCount(): Promise<number> {
    return await this.nebulasCall<number>('getScenarioCount', [], new BigNumber(0))
  }

  async getTransactionInfo(serialNumber: SerialNumber, options?: NebPayOptions) {
    return this.nebPay.queryPayInfo(serialNumber, options)
  }

  async call<T>(functionName: string, payload: {}, value: BigNumber, dryRun: boolean = false): Promise<T> {
    return new Promise<T>((resolve) => {
      const args = JSON.stringify(payload)
      const callbackUrl = this.isTestnet ? NebulasPay.config.testnetUrl : NebulasPay.config.mainnetUrl

      if (dryRun) {
        this.nebPay.simulateCall(this.contractAddress, value.toString(), functionName, args, {
          listener: (response) => {
            let json = response.result

            if (json === '') {
              json = '[]'
            }

            try {
              resolve({
                ...JSON.parse(json),
                serialNumber: response.serialNumber
              })
            } catch (error) {
              throw new Error(json)
            }
          },
          callback: callbackUrl
        })
      } else {
        const serialNumber = this.nebPay.call(this.contractAddress, value.toString(), functionName, args, {
          listener: (response: any) => {
            if (typeof response === 'string') {
              resolve({
                response,
                serialNumber
              } as any)
            } else {
              resolve({
                ...response,
                result: response.result,
                serialNumber
              })
            }
          },
          callback: callbackUrl
        })
      }
    })
  }

  async nebulasCall<T>(functionName: string, payload: {}, value: BigNumber = new BigNumber(0)): Promise<T> {
    const nonce = (await this.nebulas.api.getAccountState(cryptoEitherAccount.getAddress())).nonce + 1

    const contract = {
      function: functionName,
      args: JSON.stringify(payload)
    }

    let json = (await this.nebulas.api.call({
      from: cryptoEitherAccount.getAddress(),
      to: this.contractAddress,
      value: value.toString(),
      nonce,
      gasPrice: 1000000,
      gasLimit: 200000,
      contract
    })).result

    if (json === '') {
      json = '[]'
    }

    try {
      return JSON.parse(json)
    } catch (error) {
      throw new Error(json)
    }
  }

  setApi(testnet: boolean) {
    this.isTestnet = testnet
    this.contractAddress = this.isTestnet ? testnetContractAddress : mainnetContractAddress

    this.nebulas.setApi({
      mainnet: !testnet,
      testnet
    })
  }
}
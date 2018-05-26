import * as Neb from 'nebulas'
import Account from './Account'

export default class Transaction {
  public timestamp: Timestamp

  private underlyingInstance: any

  constructor(public chainId: ChainId, public from: Account, public to: Account | Address, public value: Value, public nonce: number, public gasPrice: number = 0, public gasLimit: number = 0, contract?: Contract, public contractAddress?: Address, public data?: {}) {
    if (from == null || to == null) {
      return
    }

    this.underlyingInstance = new Neb.Transaction({
      chainID: chainId,
      from: from.getUnderlyingInstance(),
      to: typeof to === 'string' ? to : to.getUnderlyingInstance(),
      value,
      nonce,
      gasPrice,
      gasLimit,
      contract
    })

    this.timestamp = this.underlyingInstance.timestamp
  }

  sign() {
    this.underlyingInstance.signTransaction()
  }

  hash(): Uint8Array {
    return this.underlyingInstance.hashTransaction()
  }

  toPlainObject(): {
    chainId: ChainId
    from: Address
    to: Address
    value: Value
    nonce: number
    gasPrice: number
    gasLimit: number
    contract: Contract
  } {
    return this.underlyingInstance.toPlainObject()
  }

  toString(): string {
    return this.underlyingInstance.toString()
  }

  toProto(): Uint8Array {
    return this.underlyingInstance.toProto()
  }

  toProtoString(): string {
    return this.underlyingInstance.toProtoString()
  }

  getUnderlyingInstance() {
    return this.underlyingInstance
  }

  // TODO: Fix
/*  static fromProto(proto: string) {
    const transaction = new Transaction(null, null, null, null, null, null, null, null, null)

    transaction.underlyingInstance = new Neb.Transaction().fromProto(proto)

    return transaction
  }*/
}
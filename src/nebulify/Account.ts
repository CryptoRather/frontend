import * as Neb from 'nebulas'

export default class Account {
  private underlyingInstance: any

  constructor(private privateKey?: string, path?: string) {
    if (privateKey) {
      this.underlyingInstance = new Neb.Account(privateKey, path)

      return
    }

    this.underlyingInstance = new Neb.Account()
  }

  setPrivateKey(key: Key | string) {
    this.underlyingInstance.setPrivateKey(key)
  }

  getPublicKey(): string {
    return this.underlyingInstance.getPublicKeyString()
  }

  getPublicKeyBuffer(): Uint8Array {
    return this.underlyingInstance.getPublicKey()
  }

  getPrivateKey(): string {
    return this.underlyingInstance.getPrivateKeyString()
  }

  getPrivateKeyBuffer(): Uint8Array {
    return this.underlyingInstance.getPrivateKey()
  }

  getAddress(): string {
    return this.underlyingInstance.getAddressString()
  }

  getAddressBuffer(): Uint8Array {
    return this.underlyingInstance.getAddress()
  }

  toKey(password: string, options: KeyOptions = {} as KeyOptions): Key {
    return this.underlyingInstance.toKey(password, options)
  }

  toKeyString(password: string, options: KeyOptions = {} as KeyOptions): string {
    return this.underlyingInstance.toKeyString(password, options)
  }

  getUnderlyingInstance() {
    return this.underlyingInstance
  }

  static fromKey(key: Key | string, password: string, nonStrict: boolean): Account {
    const account = new Account()

    account.underlyingInstance = new Neb.Account().fromKey(key, password, nonStrict)

    return account
  }

  static fromAddress(address: Address): Account {
    const account = new Account()

    account.underlyingInstance = Neb.Account.fromAddress(address)

    return account
  }

  static createRandomAccount(): Account {
    const account = new Account()

    account.underlyingInstance = Neb.Account.NewAccount()

    return account
  }

  static isAddressValid(address: Address, type: AddressType): boolean {
    return Neb.Account.isValidAddress(address, type)
  }
}
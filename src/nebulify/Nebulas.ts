import * as Neb from 'nebulas'
import NebulasAPI from './NebulasAPI'
import NebulasAdmin from './NebulasAdmin'

export default class Nebulas {
  private readonly underlyingInstance: any

  public api: NebulasAPI
  public admin: NebulasAdmin

  constructor(apiOptions: ApiOptions = {
    testnet: false,
    localNode: false,
    mainnet: true
  }) {
    this.underlyingInstance = new Neb.Neb()

    this.setApi(apiOptions)

    this.api = new NebulasAPI(this.underlyingInstance)
    this.admin = new NebulasAdmin(this.underlyingInstance)
  }

  setApi(options: ApiOptions) {
    let apiUrl = 'https://mainnet.nebulas.io'

    if (options.testnet) {
      apiUrl = 'https://testnet.nebulas.io'
    }

    if (options.localNode) {
      apiUrl = 'http://localhost:8685'
    }

    this.underlyingInstance.setRequest(new Neb.HttpRequest(apiUrl))
  }
}

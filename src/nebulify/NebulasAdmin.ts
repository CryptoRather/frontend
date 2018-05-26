import Transaction from './Transaction'

export default class NebulasAdmin {
  private underlyingInstance: any

  constructor(private nebulasInstance: any) {
    this.underlyingInstance = nebulasInstance.admin
  }

  // TODO: Not implemented?
/*  getNodeInfo(): Promise<NodeInfo> {
    return new Promise<NodeInfo>((resolve, reject) => {
      this.underlyingInstance.nodeInfo().then((info) => {
        resolve({
          id: info.id,
          chainId: info.chain_id,
          coinbase: info.coinbase,
          peerCount: info.peer_count,
          isSynchronized: info.synchronized,
          bucketSize: info.bucket_size,
          protocolVersion: info.protocol_version,
          routes: info.routeTable.map((route) => {
            return route
          })
        } as NodeInfo)
      }).catch((error) => reject(error))
    })
  }*/

  sendTransactionWithPassphrase(transaction: Transaction, passphrase: string): Promise<TransactionResult> {
    return new Promise<TransactionResult>((resolve, reject) => {
      this.underlyingInstance.sendTransactionWithPassphrase({
        ...transaction.getUnderlyingInstance(),
        passphrase
      }).then((result) => {
        resolve({
          txHash: result.hash,
          contractAddress: result.contract_address || null
        } as TransactionResult)
      }).catch((error) => reject(error))
    })
  }
}
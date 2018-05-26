import BigNumber from 'bignumber.js'

export interface Scenario {
  id: string
  scenario: string
  category: string
  votes: BigNumber
}
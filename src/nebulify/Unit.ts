import * as Neb from 'nebulas'
import BigNumber from 'bignumber.js'

export default class Unit {
  private static underlyingInstance = Neb.Unit

  static toBasic(value: BigNumber, fromUnit: string): BigNumber {
    return this.underlyingInstance.toBasic(value, fromUnit)
  }

  static fromBasic(value: BigNumber, toUnit: string): BigNumber {
    return this.underlyingInstance.fromBasic(value, toUnit)
  }

  static nasToBasic(value: BigNumber) {
    return this.underlyingInstance.nasToBasic(value)
  }

  static nasFromBasic(value: BigNumber) {
    return value.div(1000000000000000000)
  }
}
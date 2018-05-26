import * as React from 'react'
import Api from './Api'

type InjectedProps = {
  api?: Api
}

const api = new Api()

export function withApi<Props>() {
  return function decorateConsume<T extends React.ComponentClass<InjectedProps>>(DecoratedComponent: T): T {
    class Wrapper extends React.Component {
      render() {
        const { ...rest } = this.props

        return (
          <DecoratedComponent {...rest} api={api}/>
        )
      }
    }

    (Wrapper as any).displayName = DecoratedComponent.displayName || DecoratedComponent.name

    return Wrapper as T
  }
}
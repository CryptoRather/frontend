import { Theme } from '@material-ui/core/styles/createMuiTheme'
import originalWithStyles, { ClassNameMap, StyleRules, StyleRulesCallback, WithStylesOptions } from '@material-ui/core/styles/withStyles'
import { IReactComponent } from 'mobx-react'

export interface WithStyles<ClassKey extends string = string> {
  classes?: ClassNameMap<ClassKey>,
  theme?: Theme
}

type StyleDecorator = <T extends IReactComponent>(clazz: T) => void

export function withStyles<ClassKey extends string>(
  style: StyleRules<ClassKey> | StyleRulesCallback<ClassKey>,
  options?: WithStylesOptions
): StyleDecorator {
  // Use the original withStyles function from material-ui, but override the type.
  return originalWithStyles(style, options) as any as StyleDecorator
}

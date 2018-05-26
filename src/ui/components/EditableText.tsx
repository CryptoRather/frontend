import CloseIcon from '@material-ui/icons/Close'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import createTypography, { Style, TypographyStyle } from '@material-ui/core/styles/createTypography'
import createPalette from '@material-ui/core/styles/createPalette'
import { IconButton, TextField, Theme, Tooltip, Typography } from '@material-ui/core'

import { TypographyProps } from '@material-ui/core/Typography'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { WithStyles, withStyles } from '../withStyles'

const styles = (theme: Theme) => ({
  typography: {
    wordWrap: 'break-word',
    width: '90%',
    display: 'inline'
  } as CSSProperties,
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    width: '36px',
    height: '36px'
  },
  editableTextField: {
    'flex': 1,
    '& div input': {
      wordWrap: 'break-word',
      wordBreak: 'break-all'
    } as CSSProperties
  }
})

type EditableTextProps = WithStyles & {
  defaultValue: string,
  typographyVariant?: Style,
  typographyComponent?: React.ReactType<TypographyProps>,
  onValueApplied: (value: string) => void
}

@withStyles(styles)
@observer
export default class EditableText extends React.Component<EditableTextProps> {
  @observable editState = false
  savedValue = this.props.defaultValue
  @observable currentValue = this.savedValue
  valueUpdated = false

  constructor(props: EditableTextProps) {
    super(props)
  }

  updateValue(event: React.ChangeEvent<HTMLInputElement>) {
    this.currentValue = event.target.value
    this.valueUpdated = this.currentValue !== this.savedValue
  }

  updateEditState(shouldUpdateValue?: boolean) {
    this.editState = !this.editState

    if (!this.editState && this.valueUpdated) {
      this.valueUpdated = false
      if (shouldUpdateValue) {
        this.savedValue = this.currentValue
        this.props.onValueApplied(this.savedValue)
      } else {
        this.currentValue = this.savedValue
      }

    }
  }

  componentWillUpdate(nextProps: EditableTextProps, nextState: any) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.currentValue = nextProps.defaultValue
    }

    return true
  }

  render() {
    const { classes } = this.props
    const typography: TypographyStyle = createTypography(createPalette({}), {})[this.props.typographyVariant]
    const nativeInputProps = { style: typography }
    if (this.editState) {
      return (
        <div className={classes.root}>
          <TextField className={classes.editableTextField} InputProps={nativeInputProps} value={this.currentValue} onChange={(e) => this.updateValue(e)} multiline={true}/>
          <Tooltip title='Cancel'>
            <IconButton color='primary' className={classes.button} aria-label='Stop editing and discard changes' onClick={() => this.updateEditState(false)}>
              <CloseIcon/>
            </IconButton>
          </Tooltip>
          {this.valueUpdated &&
          <Tooltip title='Save'>
            <IconButton color='primary' className={classes.button} aria-label='Stop editing and save changes' onClick={() => this.updateEditState(true)}>
              <DoneIcon/>
            </IconButton>
          </Tooltip>}
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <Typography variant={this.props.typographyVariant} component={this.props.typographyComponent} className={classes.typography}>
          {this.currentValue}
        </Typography>
        <Tooltip title='Edit'>
          <IconButton color='primary' className={classes.button} aria-label='Edit value' onClick={() => this.updateEditState()}>
            <EditIcon/>
          </IconButton>
        </Tooltip>
      </div>
    )
  }
}
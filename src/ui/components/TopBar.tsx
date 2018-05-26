import classNames = require('classnames')
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { LibraryAdd } from '@material-ui/icons'
import { Theme } from '@material-ui/core/styles/'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { WithStyles, withStyles } from '../withStyles'
import { withApi } from '../../api/withApi'
import Api from '../../api/Api'
import * as Logo from '../../assets/Logo.svg'
import SubmitQuestion from './SubmitQuestion'

const styles = (theme: Theme) => ({
  flex: {
    flex: 1
  },
  title: {
    cursor: 'pointer',
    paddingLeft: '10px'
  },
  titleIcon: {
    width: '40px',
    height: '50px',
    cursor: 'pointer'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

type TopBarProps = WithStyles & RouteComponentProps<any> & {
  api: Api
}

@withStyles(styles)
@withApi()
class TopBar extends React.Component<TopBarProps, {
  showSubmitDialog: boolean
}> {
  state = {
    currentEndpoint: 'Mainnet',
    showSubmitDialog: false
  }

  constructor(props: any) {
    super(props)
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position='absolute' className={classes.appBar}>
          <Toolbar>
            <img src={Logo} className={classes.titleIcon} onClick={() => this.props.history.push('/')}/>
            <Typography variant='title' color='inherit' >
              <a className={classes.title} onClick={() => this.props.history.push('/')}>CryptoRather</a>
            </Typography>
            <Typography style={{
              color: 'white',
              marginTop: '2px',
              marginLeft: '10px'
            }} className={classNames(classes.flex)}>powered by <a style={{
              color: 'white'
            }} href='https://nebulas.io/' target='_blank'>Nebulas</a></Typography>
            <Button color='inherit' onClick={() => this.setState({
              showSubmitDialog: true
            })}>
              <LibraryAdd style={{
                marginRight: '10px'
              }}/> Submit a question
            </Button>
            {
              <SubmitQuestion showDialog={this.state.showSubmitDialog} onClose={() => this.setState({
                showSubmitDialog: false
              })}/>
            }
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withRouter(TopBar)
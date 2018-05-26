import { createMuiTheme, CssBaseline, LinearProgress, MuiThemeProvider, Typography } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import * as React from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { indigo, red } from '@material-ui/core/colors'
import QuestionPage from './ui/components/QuestionPage'
import TopBar from './ui/components/TopBar'
import { WithStyles, withStyles } from './ui/withStyles'
import { withApi } from './api/withApi'
import Api from './api/Api'

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    minHeight: '100vh'
  } as CSSProperties,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  drawerPaper: {
    position: 'relative',
    width: 240,
    height: '100%'
  } as CSSProperties,
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  toolbar: theme.mixins.toolbar as CSSProperties,
  versionText: {
    position: 'fixed',
    left: 0,
    bottom: 0
  } as CSSProperties
})

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: red
  }
})

type AppProps = WithStyles & RouteComponentProps<{}> & {
  api?: Api
}

@withStyles(styles)
@withApi()
class App extends React.Component<AppProps, {
  scenarioCount: number
}> {
  state = {
    scenarioCount: null
  }

  async componentWillMount() {
    const scenarioCount = await this.props.api.getScenarioCount()

    this.setState({
      scenarioCount
    })
  }

  async componentWillReceiveProps() {
    const scenarioCount = await this.props.api.getScenarioCount()

    this.setState({
      scenarioCount
    })
  }

  render() {
    const { classes } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline/>
          <TopBar/>
          <div className={classes.content}>
            <div className={classes.toolbar}/>
            {
              !this.state.scenarioCount ? <LinearProgress variant='indeterminate'/> : <Switch>
                <Route exact path='/' component={QuestionPage}/>
                <Route exact path='/:id' render={({ match }) => {
                  if (match.params.id >= this.state.scenarioCount) {
                    return <Typography variant='headline' style={{
                      textAlign: 'center'
                    }}>Question not found</Typography>
                  }

                  return <QuestionPage/>
                }}/>
                <Route exact path='/:idA/:idB' render={({ match }) => {
                  if (match.params.idA >= this.state.scenarioCount || match.params.idB >= this.state.scenarioCount) {
                    return <Typography variant='headline'>Question not found</Typography>
                  }

                  return <QuestionPage/>
                }}/>
              </Switch>
            }
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withRouter(App)

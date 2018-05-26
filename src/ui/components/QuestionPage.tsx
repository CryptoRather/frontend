import * as React from 'react'
import { Button, Card, CardContent, CircularProgress, createMuiTheme, IconButton, MuiThemeProvider, Snackbar, Theme, Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { KeyboardArrowLeft, KeyboardArrowRight, Poll, Link, Close } from '@material-ui/icons'
import { RouteComponentProps, withRouter } from 'react-router'
import BigNumber from 'bignumber.js'
import * as deepEqual from 'deep-equal'
import * as _ from 'lodash'
import { Motion, spring } from 'react-motion'
import * as classnames from 'classnames'
import { WithStyles, withStyles } from '../withStyles'
import { Question } from '../../models/Question'
import { withApi } from '../../api/withApi'
import Api from '../../api/Api'
import { copyTextToClipboard, pluralize } from '../../utils'

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  } as CSSProperties,
  optionA: {
    width: '650px',
    height: 'auto',
    minHeight: '330px',
    textTransform: 'none',
    fontSize: '24px',
    marginRight: '5px',
    [theme.breakpoints.down('lg')]: {
      width: '480px',
      minHeight: '300px'
    },
    [theme.breakpoints.down('md')]: {
      width: '400px',
      fontSize: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '300px'
    }
  } as CSSProperties,
  optionB: {
    width: '650px',
    height: 'auto',
    minHeight: '330px',
    fontSize: '24px',
    textTransform: 'none',
    marginLeft: '5px',
    [theme.breakpoints.down('lg')]: {
      width: '480px',
      minHeight: '300px'
    },
    [theme.breakpoints.down('md')]: {
      width: '400px',
      fontSize: '20px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '300px'
    }
  } as CSSProperties,
  leftFab: {
    marginRight: '30px',
    color: 'white',
    [theme.breakpoints.down('lg')]: {
      marginRight: '20px'
    }
  },
  rightFab: {
    marginLeft: '30px',
    color: 'white',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '20px'
    }
  },
  optionAHighlighted: {
    border: '10px solid #212b66'
  },
  optionBHighlighted: {
    border: '10px solid #aa003d'
  }
})

type QuestionPageProps = WithStyles & RouteComponentProps<{
  id: string,
  idA?: string
  idB?: string
}> & {
  api?: Api
}

@withStyles(styles)
@withApi()
class QuestionPage extends React.Component<QuestionPageProps, {
  question: Question,
  showVoteCounts: boolean,
  optionA: boolean,
  lerpingPercentage: boolean,
  updated: boolean,
  snackbarOpen: boolean,
  loadingVoteCounts: boolean,
  questionHistory: Question[]
}> {
  state = {
    question: null as Question,
    showVoteCounts: false,
    optionA: null,
    lerpingPercentage: false,
    updated: false,
    snackbarOpen: false,
    loadingVoteCounts: false,
    questionHistory: []
  }

  async componentWillMount() {
    const { match, api, history } = this.props

    const randomQuestionId = await this.getRandomQuestionId()

    let question: Question

    if (match.params.idA && match.params.idB) {
      question = (await api.getExact(match.params.idA, match.params.idB))
    } else {
      question = (await api.get(match.params.id || randomQuestionId.toString()))

      if (!match.params.id) {
        history.push(`/${randomQuestionId}`)
      }

      while (question.scenarioA === null || question.scenarioB === null) {
        question = (await api.get(match.params.id || randomQuestionId.toString()))
      }
    }

    question.scenarioA.scenario = _.upperFirst(question.scenarioA.scenario)
    question.scenarioB.scenario = _.upperFirst(question.scenarioB.scenario)

    const questionHistory = this.state.questionHistory

    questionHistory.push(question)

    this.setState({
      question,
      showVoteCounts: false,
      updated: true,
      questionHistory
    })
  }

  async componentDidUpdate(nextProps: QuestionPageProps) {
    if (deepEqual(this.props, nextProps)) {
      return
    }

    const { match, api, history } = this.props

    this.setState({
      question: null,
      optionA: false
    })

    const questionId = await this.getRandomQuestionId()

    let question: Question = (await api.get(match.params.id || questionId.toString()))

    if (!match.params.id) {
      history.push(`/${questionId}`)

      return
    }

    while (question.scenarioA === null || question.scenarioB === null || _.takeRight(this.state.questionHistory, 30).includes(question)) {
      question = (await api.get(match.params.id))
    }

    question.scenarioA.scenario = _.upperFirst(question.scenarioA.scenario)
    question.scenarioB.scenario = _.upperFirst(question.scenarioB.scenario)

    const questionHistory = this.state.questionHistory

    questionHistory.push(question)

    this.setState({
      question,
      showVoteCounts: false,
      updated: true,
      optionA: false,
      questionHistory
    })
  }

  async getRandomQuestionId() {
    const { api } = this.props

    return Math.floor(Math.random() * (await api.getScenarioCount()))
  }

  handleScenarioClick = (optionA: boolean) => {
    if (this.state.question && !this.state.showVoteCounts) {
      const { api } = this.props

      this.setState({
        loadingVoteCounts: true
      })

      api.vote(this.state.question, optionA).then((response: any) => {
        if (typeof response.response === 'string' && response.response as string === 'Error: Transaction rejected by user') {
          this.setState({
            loadingVoteCounts: false,
            showVoteCounts: false
          })

          return
        }

        this.setState({
          showVoteCounts: true,
          optionA
        })
      })
    }
  }

  handleBackButtonClick = async () => {
    const { history } = this.props

    this.setState({
      showVoteCounts: false,
      question: null,
      optionA: false
    })

    history.goBack()
  }

  handleNextButtonClick = async () => {
    const { history } = this.props

    this.setState({
      showVoteCounts: false,
      question: null
    })

    history.push(`/${await this.getRandomQuestionId()}`)

    this.setState({
      optionA: false
    })
  }

  handleLinkClick = () => {
    this.setState({
      snackbarOpen: true
    })

    copyTextToClipboard(`${window.location.host}/${this.state.question.scenarioA.id}/${this.state.question.scenarioB.id}`)
  }

  render() {
    const { classes } = this.props
    const { question } = this.state

    let allVotes = new BigNumber(0)
    let scenarioAVotes = new BigNumber(0)
    let scenarioBVotes = new BigNumber(0)

    if (question) {
      allVotes = new BigNumber(question.scenarioA.votes).plus(question.scenarioB.votes)

      if (this.state.optionA !== null) {
        if (this.state.optionA) {
          scenarioAVotes = new BigNumber(question.scenarioA.votes).plus(1)
          scenarioBVotes = new BigNumber(question.scenarioB.votes)
        } else {
          scenarioAVotes = new BigNumber(question.scenarioA.votes)
          scenarioBVotes = new BigNumber(question.scenarioB.votes).plus(1)
        }

        allVotes = allVotes.plus(1)
      }
    }

    return (
      <div className={classes.root}>
        <Typography variant='display1' style={{
          marginBottom: '35px',
          color: 'black'
        }}>
          Would you rather
        </Typography>
        <div style={{
          flexDirection: 'row'
        }}>
          <MuiThemeProvider theme={createMuiTheme({
            overrides: {
              MuiButton: {
                root: {
                  fontSize: '18px'
                }
              }
            }
          })}>
            <Button variant='fab' color='primary' className={classes.leftFab} onClick={this.handleBackButtonClick}>
              <KeyboardArrowLeft/>
            </Button>
            <Button variant='raised' color='primary' className={classnames({
              [classes.optionA]: true,
              [classes.optionAHighlighted]: this.state.optionA && this.state.showVoteCounts
            })} onClick={() => this.handleScenarioClick(true)}>
              {this.state.showVoteCounts &&
              this.state.question ? (
                  <React.Fragment>
                    {scenarioAVotes.div(allVotes).times(new BigNumber(100)).abs().toFixed(0).toString() + '%'}
                    <br/>
                    {
                      this.state.optionA ? scenarioAVotes.toString() + (scenarioAVotes.eq(0) || scenarioAVotes.gt(1) ? ' agree' : ' agrees') : scenarioAVotes.toString() + (scenarioAVotes.eq(0) || scenarioAVotes.gt(1) ? ' disagree' : ' disagrees')
                    }
                  </React.Fragment>
                )
                : this.state.question && !this.state.loadingVoteCounts ? this.state.question.scenarioA.scenario
                  : <CircularProgress color='secondary'/>}
            </Button>
            <Motion defaultStyle={{ fill: 50, rotate: 0 }} style={{ fill: this.state.showVoteCounts ? spring(parseInt(new BigNumber(scenarioAVotes).div(allVotes).times(new BigNumber(100)).abs().toFixed(0).toString(), 10)) : 50, rotate: this.state.showVoteCounts ? spring(45) : 0 }}>
              {
                (style) => {
                  return <Button variant='fab' style={{
                    background: `linear-gradient(to top right,
                      #3f51b5 0%,
                      #3f51b5 ${style.fill}%,
                      #f50057 ${style.fill}%,
                      #f50057 100%)`,
                    color: 'white',
                    width: '70px',
                    height: '70px',
                    pointerEvents: 'none',
                    transform: `rotate(${style.rotate}deg)`,
                    fontWeight: 'bold'
                  }}><span style={{
                    transform: `rotate(${-style.rotate}deg)`
                  }}>OR</span></Button>
                }
              }
            </Motion>
            <Button variant='raised' color='secondary' className={classnames({
              [classes.optionB]: true,
              [classes.optionBHighlighted]: !this.state.optionA && this.state.showVoteCounts
            })} onClick={() => this.handleScenarioClick(false)}>
              {this.state.showVoteCounts &&
              this.state.question ?
                <React.Fragment>
                  {scenarioBVotes.div(allVotes).times(new BigNumber(100)).abs().toFixed(0).toString() + '%'}
                  <br/>
                  {
                    !this.state.optionA ? scenarioBVotes.toString() + (scenarioBVotes.eq(0) || scenarioBVotes.gt(1) ? ' agree' : ' agrees') : scenarioBVotes.toString() + (scenarioBVotes.eq(0) || scenarioBVotes.gt(1) ? ' disagree' : ' disagrees')
                  }
                </React.Fragment>
                : this.state.question && !this.state.loadingVoteCounts ? this.state.question.scenarioB.scenario
                  : <CircularProgress/>}
            </Button>
            <Button variant='fab' color='secondary' className={classes.rightFab} onClick={this.handleNextButtonClick}>
              <KeyboardArrowRight/>
            </Button>
          </MuiThemeProvider>
        </div>
        <Card style={{
          marginTop: '75px'
        }}>
          <CardContent>
            {
              this.state.question ?
                <React.Fragment>
                  <Typography variant='subheading' style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Poll style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '10px'
                    }}/>{allVotes.toString()} {pluralize('vote', parseInt(allVotes.toString(), 10))}
                  </Typography>
                  <Typography variant='subheading' style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }} onClick={this.handleLinkClick}>
                    <Link style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '10px'
                    }}/>{`${window.location.host}/${question.scenarioA.id}/${question.scenarioB.id}`}
                  </Typography>
                </React.Fragment>
                : <CircularProgress/>
            }
          </CardContent>
        </Card>
        <Snackbar open={this.state.snackbarOpen} autoHideDuration={2500} onClose={() => this.setState({
          snackbarOpen: false
        })} message={<span>Link copied!</span>} action={[
          <IconButton key='close' aria-label='Close' color='inherit' className={classes.close} onClick={() => this.setState({
            snackbarOpen: false
          })}>
            <Close/>
          </IconButton>
        ]}/>
      </div>
    )
  }
}

export default withRouter(QuestionPage)
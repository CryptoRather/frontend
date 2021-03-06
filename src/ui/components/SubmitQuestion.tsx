import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, Input, InputLabel, Snackbar, TextField, Typography } from '@material-ui/core'
import { withApi } from '../../api/withApi'
import Api from '../../api/Api'

@withApi()
export default class SubmitQuestion extends React.Component<{
  showDialog: boolean,
  onClose: () => void,
  api?: Api
}, {
  blueOptionText: string,
  redOptionText: string,
  showDialog: boolean,
  isLoading: boolean,
  showFinishedDialog: boolean,
  submittedId: number,
  errors: {
    blueOptionText: string,
    redOptionText: string
  }
}> {
  state = {
    blueOptionText: '',
    redOptionText: '',
    showDialog: false,
    isLoading: false,
    showFinishedDialog: false,
    submittedId: null,
    errors: {
      blueOptionText: '',
      redOptionText: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.showDialog !== nextProps.showDialog) {
      this.setState({
        showDialog: nextProps.showDialog
      })
    }
  }

  handleDialogSubmitClick = async () => {
    let errored = false

    if (this.state.blueOptionText.trim().length === 0) {
      errored = true

      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          blueOptionText: 'This field cannot be empty.'
        }
      }))
    }

    if (this.state.redOptionText.trim().length === 0) {
      errored = true

      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          redOptionText: 'This field cannot be empty.'
        }
      }))
    }

    if (this.state.blueOptionText.trim().length > 350) {
      errored = true

      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          blueOptionText: 'Blue option text cannot be longer than 350 characters.'
        }
      }))
    }

    if (this.state.redOptionText.trim().length > 350) {
      errored = true

      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          redOptionText: 'Red option text cannot be longer than 350 characters.'
        }
      }))
    }

    if (errored) {
      return
    }

    this.setState({
      isLoading: true
    })

    this.props.api.add(this.state.blueOptionText, this.state.redOptionText).then(async (response: any) => {
      if (typeof response.response === 'string' && response.response as string === 'Error: Transaction rejected by user') {
        this.setState({
          showDialog: false,
          blueOptionText: '',
          errors: {
            blueOptionText: '',
            redOptionText: ''
          },
          redOptionText: ''
        })

        this.setState({
          isLoading: false,
          showDialog: false
        })

        this.props.onClose()
      } else {
        this.setState({
          submittedId: await this.props.api.getScenarioCount()
        })

        const timer = setInterval(async () => {
          const result = JSON.parse((await this.props.api.getTransactionInfo(response.serialNumber)))

          if (result.data.status === 1) {
            clearInterval(timer)

            this.setState({
              isLoading: false,
              showDialog: false,
              showFinishedDialog: true
            })
          }
        }, 10100)
      }
    })
  }

  handleBlueOptionChange = (event) => {
    this.setState({
      blueOptionText: event.target.value,
      errors: {
        ...this.state.errors,
        blueOptionText: ''
      }
    })
  }

  handleRedOptionChange = (event) => {
    this.setState({
      redOptionText: event.target.value,
      errors: {
        ...this.state.errors,
        redOptionText: ''
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.showDialog ? <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.showDialog}>
              <DialogTitle>{this.state.isLoading ? 'Submitting...' : 'Submit a question'}</DialogTitle>
              <DialogContent style={this.state.isLoading ? {
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              } : {
                width: '450px'
              }}>
                {
                  this.state.isLoading ? <CircularProgress/> : <React.Fragment>
                    <FormControl fullWidth error={this.state.errors.blueOptionText.length > 0}>
                      <InputLabel htmlFor='blueOption'>Blue option</InputLabel>
                      <Input id='blueOption' value={this.state.blueOptionText} onChange={this.handleBlueOptionChange} multiline fullWidth/>
                      <FormHelperText>{this.state.errors.blueOptionText}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={this.state.errors.redOptionText.length > 0}>
                      <InputLabel htmlFor='redOption'>Red option</InputLabel>
                      <Input id='redOption' value={this.state.redOptionText} onChange={this.handleRedOptionChange} multiline fullWidth/>
                      <FormHelperText>{this.state.errors.redOptionText}</FormHelperText>
                    </FormControl>
                  </React.Fragment>
                }
              </DialogContent>
              {
                !this.state.isLoading && <DialogActions>
                    <Button onClick={() => {
                      this.setState({
                        showDialog: false,
                        showFinishedDialog: false,
                        blueOptionText: '',
                        errors: {
                          blueOptionText: '',
                          redOptionText: ''
                        },
                        redOptionText: ''
                      })

                      this.props.onClose()
                    }} color='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={this.handleDialogSubmitClick} color='primary'>
                        Submit
                    </Button>
                </DialogActions>
              }
            </Dialog>
            : <Dialog open={this.state.showFinishedDialog} onClose={() => {
              this.setState({
                showDialog: false,
                blueOptionText: '',
                errors: {
                  blueOptionText: '',
                  redOptionText: ''
                },
                redOptionText: '',
                showFinishedDialog: false
              })

              this.props.onClose()
            }}>
              <DialogTitle>Question submitted</DialogTitle>
              <DialogContent>
                {
                  <Typography>Your question has been submitted successfully and you can check it out <a href={`${window.location.origin}/${this.state.submittedId}/${this.state.submittedId + 1}`} target='_blank'>here</a>.</Typography>
                }
              </DialogContent>
              {
                !this.state.isLoading && <DialogActions>
                    <Button onClick={() => {
                      this.setState({
                        showDialog: false,
                        blueOptionText: '',
                        errors: {
                          blueOptionText: '',
                          redOptionText: ''
                        },
                        redOptionText: '',
                        showFinishedDialog: false
                      })

                      this.props.onClose()
                    }} color='primary'>
                        Ok
                    </Button>
                </DialogActions>
              }
            </Dialog>
        }
      </React.Fragment>
    )
  }
}
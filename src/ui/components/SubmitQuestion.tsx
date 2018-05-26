import * as React from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField } from '@material-ui/core'
import { withApi } from '../../api/withApi'
import Api from '../../api/Api'
import { Close } from '@material-ui/icons'

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
  snackbarOpen: boolean
}> {
  state = {
    blueOptionText: '',
    redOptionText: '',
    showDialog: false,
    isLoading: false,
    snackbarOpen: true
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.showDialog !== nextProps.showDialog) {
      this.setState({
        showDialog: nextProps.showDialog
      })
    }
  }

  handleDialogSubmitClick = async () => {
    this.setState({
      isLoading: true
    })

    await this.props.api.add(this.state.blueOptionText, this.state.redOptionText)

    this.setState({
      isLoading: false,
      showDialog: false
    })
  }

  handleBlueOptionChange = (event) => {
    this.setState({
      blueOptionText: event.target.value
    })
  }

  handleRedOptionChange = (event) => {
    this.setState({
      redOptionText: event.target.value
    })
  }

  render() {
    return (
      <React.Fragment>
        <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.showDialog}>
          <DialogTitle>Submit a question</DialogTitle>
          <DialogContent>
            {
              this.state.isLoading ? <CircularProgress/> : <React.Fragment>
                <TextField label='Blue option' value={this.state.blueOptionText} onChange={this.handleBlueOptionChange} multiline fullWidth margin='normal'/>
                <TextField label='Red option' value={this.state.redOptionText} onChange={this.handleRedOptionChange} multiline fullWidth margin='normal'/>
              </React.Fragment>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({
                showDialog: false
              })
              this.props.onClose()
            }} color='secondary'>
              Cancel
            </Button>
            <Button onClick={this.handleDialogSubmitClick} color='primary'>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
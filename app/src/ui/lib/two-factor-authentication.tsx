import * as React from 'react'
import { Loading } from './loading'
import { Button } from './button'
import { TextBox } from './text-box'
import { Form } from './form'
import { Errors } from './errors'

import {
  getWelcomeMessage,
  AuthenticationMode,
 } from '../../lib/2fa'

interface ITwoFactorAuthenticationProps {

  /**
   * A callback which is invoked once the user has entered a
   * OTP token and submitted it either by clicking on the submit
   * button or by submitting the form through other means (ie hitting Enter).
   */
  readonly onOTPEntered: (otp: string) => void

  /** An array of additional buttons to render after the "Sign In" button. */
  readonly additionalButtons?: ReadonlyArray<JSX.Element>

  /**
   * An error which, if present, is presented to the
   * user in close proximity to the actions or input fields
   * related to the current step.
   */
  readonly error: Error | null

  /**
   * A value indicating whether or not the sign in store is
   * busy processing a request. While this value is true all
   * form inputs and actions save for a cancel action will
   * be disabled.
   */
  readonly loading: boolean

  /**
   * The 2FA type expected by the GitHub endpoint.
   */
  readonly type: AuthenticationMode
}

interface ITwoFactorAuthenticationState {
  readonly otp: string
}

/** The two-factor authentication component. */
export class TwoFactorAuthentication extends React.Component<ITwoFactorAuthenticationProps, ITwoFactorAuthenticationState> {
  public constructor(props: ITwoFactorAuthenticationProps) {
    super(props)

    this.state = { otp: '' }
  }

  public render() {
    const textEntryDisabled = this.props.loading
    const signInDisabled = !this.state.otp.length || this.props.loading
    const errors =  this.props.error
      ? <Errors>{this.props.error.message}</Errors>
      : null

    return (
      <div>
        <p className='welcome-text'>
          { getWelcomeMessage(this.props.type) }
        </p>

        <Form onSubmit={this.signIn}>
          <TextBox
            label='Authentication code'
            disabled={textEntryDisabled}
            autoFocus={true}
            onChange={this.onOTPChange}/>

          {errors}

          <Button type='submit' disabled={signInDisabled}>Verify</Button>
          {this.props.additionalButtons}

          {this.props.loading ? <Loading/> : null}
        </Form>
      </div>
    )
  }

  private onOTPChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ otp: event.currentTarget.value })
  }

  private signIn = () => {
    this.props.onOTPEntered(this.state.otp)
  }
}

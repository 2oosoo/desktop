import { spawn } from 'child_process'
import { fatalError } from './fatal-error'

/** Opens a shell setting the working directory to fullpath. If a shell is not specified, OS defaults are used. */
export function openShell(fullPath: string, shell?: string) {
  if ( __DARWIN__) {
    // fullPath argument ensures a new terminal is always shown
    const commandArgs = [ '-a', shell || 'Terminal', fullPath ]
    return spawn('open', commandArgs, { 'shell': true })
  }

  if (__WIN32__) {
    // not sure what other sorts of arguments we expect here
    // so for now let's just try and launch this other shell
    return spawn('START', [ shell || 'cmd' ], { 'shell': true, cwd: fullPath })
  }

  return fatalError('Unsupported OS')
}

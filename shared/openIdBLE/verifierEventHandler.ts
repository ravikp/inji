import {VerifierDataEvent} from '../tuvali/types/events';
import {verifier} from '../tuvali/tuvali';

export function subscribe(callback: (event: VerifierDataEvent) => void) {
  return verifier.handleDataEvents(e => {
    callback(e);
  });
}

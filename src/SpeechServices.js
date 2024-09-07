/* global process */

import createSpeechRecognitionPonyfill, {
  createSpeechRecognitionPonyfillFromRecognizer
} from './SpeechServices/SpeechToText';
import createSpeechSynthesisPonyfill from './SpeechServices/TextToSpeech';
import fetchAuthorizationToken from './SpeechServices/fetchAuthorizationToken';

export default function createSpeechServicesPonyfill(options = {}, ...args) {
  return {
    ...createSpeechRecognitionPonyfill(options, ...args),
    ...createSpeechSynthesisPonyfill(options, ...args)
  };
}

export {
  createSpeechRecognitionPonyfill,
  createSpeechRecognitionPonyfillFromRecognizer,
  createSpeechSynthesisPonyfill,
  fetchAuthorizationToken
};

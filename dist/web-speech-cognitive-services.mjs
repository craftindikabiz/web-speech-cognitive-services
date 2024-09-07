// src/SpeechServices/SpeechToText/createSpeechRecognitionPonyfill.js
import { Event, EventTarget, getEventAttributeValue, setEventAttributeValue } from "event-target-shim";

// src/Util/arrayToMap.js
function arrayToMap_default(array, extras) {
  const map = {
    ...[].reduce.call(
      array,
      (map2, value, index) => {
        map2[index] = value;
        return map2;
      },
      {}
    ),
    ...extras,
    length: array.length,
    [Symbol.iterator]: () => [].slice.call(map)[Symbol.iterator]()
  };
  return map;
}

// src/SpeechServices/SpeechSDK.js
import {
  AudioConfig,
  OutputFormat,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk/distrib/lib/microsoft.cognitiveservices.speech.sdk";
var SpeechSDK_default = {
  AudioConfig,
  OutputFormat,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer
};

// src/SpeechServices/SpeechToText/cognitiveServiceEventResultToWebSpeechRecognitionResultList.js
var {
  ResultReason: { RecognizingSpeech, RecognizedSpeech }
} = SpeechSDK_default;
function cognitiveServiceEventResultToWebSpeechRecognitionResultList_default(result, { maxAlternatives = Infinity, textNormalization = "display" } = {}) {
  if (result.reason === RecognizingSpeech || result.reason === RecognizedSpeech && !result.json.NBest) {
    const resultList = [
      {
        confidence: 0.5,
        transcript: result.text
      }
    ];
    if (result.reason === RecognizedSpeech) {
      resultList.isFinal = true;
    }
    return resultList;
  } else if (result.reason === RecognizedSpeech) {
    const resultList = arrayToMap_default(
      (result.json.NBest || []).slice(0, maxAlternatives).map(({ Confidence: confidence, Display: display, ITN: itn, Lexical: lexical, MaskedITN: maskedITN }) => ({
        confidence,
        transcript: textNormalization === "itn" ? itn : textNormalization === "lexical" ? lexical : textNormalization === "maskeditn" ? maskedITN : display
      })),
      { isFinal: true }
    );
    return resultList;
  }
  return [];
}

// ../../node_modules/p-defer/index.js
function pDefer() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

// src/Util/createPromiseQueue.js
function createPromiseQueue_default() {
  let shiftDeferred;
  const queue = [];
  const push = (value) => {
    if (shiftDeferred) {
      const { resolve } = shiftDeferred;
      shiftDeferred = null;
      resolve(value);
    } else {
      queue.push(value);
    }
  };
  const shift = () => {
    if (queue.length) {
      return Promise.resolve(queue.shift());
    }
    return (shiftDeferred || (shiftDeferred = pDefer())).promise;
  };
  return {
    push,
    shift
  };
}

// src/SpeechServices/resolveFunctionOrReturnValue.ts
function isFunction(value) {
  return typeof value === "function";
}
function resolveFunctionOrReturnValue(fnOrValue) {
  return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
}

// src/SpeechServices/patchOptions.js
var shouldWarnOnSubscriptionKey = true;
function patchOptions({
  authorizationToken,
  credentials,
  looseEvent,
  looseEvents,
  region = "westus",
  subscriptionKey,
  ...otherOptions
} = {}) {
  if (typeof looseEvent !== "undefined") {
    console.warn('web-speech-cognitive-services: The option "looseEvent" should be named as "looseEvents".');
    looseEvents = looseEvent;
  }
  if (!credentials) {
    if (!authorizationToken && !subscriptionKey) {
      throw new Error("web-speech-cognitive-services: Credentials must be specified.");
    } else {
      console.warn(
        "web-speech-cognitive-services: We are deprecating authorizationToken, region, and subscriptionKey. Please use credentials instead. The deprecated option will be removed on or after 2020-11-14."
      );
      credentials = async () => authorizationToken ? { authorizationToken: await resolveFunctionOrReturnValue(authorizationToken), region } : { region, subscriptionKey: await resolveFunctionOrReturnValue(subscriptionKey) };
    }
  }
  return {
    ...otherOptions,
    fetchCredentials: async () => {
      const {
        authorizationToken: authorizationToken2,
        customVoiceHostname,
        region: region2,
        speechRecognitionHostname,
        speechSynthesisHostname,
        subscriptionKey: subscriptionKey2
      } = await resolveFunctionOrReturnValue(credentials);
      if (!authorizationToken2 && !subscriptionKey2 || authorizationToken2 && subscriptionKey2) {
        throw new Error(
          'web-speech-cognitive-services: Either "authorizationToken" or "subscriptionKey" must be provided.'
        );
      } else if (!region2 && !(speechRecognitionHostname && speechSynthesisHostname)) {
        throw new Error(
          'web-speech-cognitive-services: Either "region" or "speechRecognitionHostname" and "speechSynthesisHostname" must be set.'
        );
      } else if (region2 && (customVoiceHostname || speechRecognitionHostname || speechSynthesisHostname)) {
        throw new Error(
          'web-speech-cognitive-services: Only either "region" or "customVoiceHostname", "speechRecognitionHostname" and "speechSynthesisHostname" can be set.'
        );
      } else if (authorizationToken2) {
        if (typeof authorizationToken2 !== "string") {
          throw new Error('web-speech-cognitive-services: "authorizationToken" must be a string.');
        }
      } else if (typeof subscriptionKey2 !== "string") {
        throw new Error('web-speech-cognitive-services: "subscriptionKey" must be a string.');
      }
      if (shouldWarnOnSubscriptionKey && subscriptionKey2) {
        console.warn(
          "web-speech-cognitive-services: In production environment, subscription key should not be used, authorization token should be used instead."
        );
        shouldWarnOnSubscriptionKey = false;
      }
      const resolvedCredentials = authorizationToken2 ? { authorizationToken: authorizationToken2 } : { subscriptionKey: subscriptionKey2 };
      if (region2) {
        resolvedCredentials.region = region2;
      } else {
        resolvedCredentials.customVoiceHostname = customVoiceHostname;
        resolvedCredentials.speechRecognitionHostname = speechRecognitionHostname;
        resolvedCredentials.speechSynthesisHostname = speechSynthesisHostname;
      }
      return resolvedCredentials;
    },
    looseEvents
  };
}

// src/SpeechServices/SpeechToText/SpeechGrammarList.js
var SpeechGrammarList_default = class {
  constructor() {
    this._phrases = [];
  }
  addFromString() {
    throw new Error("JSGF is not supported");
  }
  get phrases() {
    return this._phrases;
  }
  set phrases(value) {
    if (Array.isArray(value)) {
      this._phrases = value;
    } else if (typeof value === "string") {
      this._phrases = [value];
    } else {
      throw new Error(`The provided value is not an array or of type 'string'`);
    }
  }
};

// src/SpeechServices/SpeechToText/createSpeechRecognitionPonyfill.js
var { AudioConfig: AudioConfig2, OutputFormat: OutputFormat2, ResultReason: ResultReason2, SpeechConfig: SpeechConfig2, SpeechRecognizer: SpeechRecognizer2 } = SpeechSDK_default;
function serializeRecognitionResult({ duration, errorDetails, json, offset, properties, reason, resultId, text }) {
  return {
    duration,
    errorDetails,
    json: JSON.parse(json),
    offset,
    properties,
    reason,
    resultId,
    text
  };
}
function averageAmplitude(arrayBuffer) {
  const array = new Int16Array(arrayBuffer);
  return [].reduce.call(array, (averageAmplitude2, amplitude) => averageAmplitude2 + Math.abs(amplitude), 0) / array.length;
}
function cognitiveServicesAsyncToPromise(fn) {
  return (...args) => new Promise((resolve, reject) => fn(...args, resolve, reject));
}
var SpeechRecognitionEvent = class extends Event {
  constructor(type, { data, emma, interpretation, resultIndex, results } = {}) {
    super(type);
    this.data = data;
    this.emma = emma;
    this.interpretation = interpretation;
    this.resultIndex = resultIndex;
    this.results = results;
  }
};
function prepareAudioConfig(audioConfig) {
  const originalAttach = audioConfig.attach;
  const boundOriginalAttach = audioConfig.attach.bind(audioConfig);
  let firstChunk;
  let muted;
  audioConfig.attach = async () => {
    const reader = await boundOriginalAttach();
    return {
      ...reader,
      read: async () => {
        const chunk = await reader.read();
        if (!firstChunk && averageAmplitude(chunk.buffer) > 150) {
          audioConfig.events.onEvent({ name: "FirstAudibleChunk" });
          firstChunk = true;
        }
        if (muted) {
          return { buffer: new ArrayBuffer(0), isEnd: true, timeReceived: Date.now() };
        }
        return chunk;
      }
    };
  };
  return {
    audioConfig,
    pause: () => {
      muted = true;
    },
    unprepare: () => {
      audioConfig.attach = originalAttach;
    }
  };
}
function createSpeechRecognitionPonyfillFromRecognizer({
  createRecognizer,
  enableTelemetry,
  looseEvents,
  referenceGrammars,
  textNormalization
}) {
  SpeechRecognizer2.enableTelemetry(enableTelemetry !== false);
  class SpeechRecognition extends EventTarget {
    constructor() {
      super();
      this._continuous = false;
      this._interimResults = false;
      this._lang = typeof window !== "undefined" ? window.document.documentElement.getAttribute("lang") || window.navigator.language : "en-US";
      this._grammars = new SpeechGrammarList_default();
      this._maxAlternatives = 1;
    }
    emitCognitiveServices(type, event) {
      this.dispatchEvent(
        new SpeechRecognitionEvent("cognitiveservices", {
          data: {
            ...event,
            type
          }
        })
      );
    }
    get continuous() {
      return this._continuous;
    }
    set continuous(value) {
      this._continuous = value;
    }
    get grammars() {
      return this._grammars;
    }
    set grammars(value) {
      if (value instanceof SpeechGrammarList_default) {
        this._grammars = value;
      } else {
        throw new Error(`The provided value is not of type 'SpeechGrammarList'`);
      }
    }
    get interimResults() {
      return this._interimResults;
    }
    set interimResults(value) {
      this._interimResults = value;
    }
    get maxAlternatives() {
      return this._maxAlternatives;
    }
    set maxAlternatives(value) {
      this._maxAlternatives = value;
    }
    get lang() {
      return this._lang;
    }
    set lang(value) {
      this._lang = value;
    }
    get onaudioend() {
      return getEventAttributeValue(this, "audioend");
    }
    set onaudioend(value) {
      setEventAttributeValue(this, "audioend", value);
    }
    get onaudiostart() {
      return getEventAttributeValue(this, "audiostart");
    }
    set onaudiostart(value) {
      setEventAttributeValue(this, "audiostart", value);
    }
    get oncognitiveservices() {
      return getEventAttributeValue(this, "cognitiveservices");
    }
    set oncognitiveservices(value) {
      setEventAttributeValue(this, "cognitiveservices", value);
    }
    get onend() {
      return getEventAttributeValue(this, "end");
    }
    set onend(value) {
      setEventAttributeValue(this, "end", value);
    }
    get onerror() {
      return getEventAttributeValue(this, "error");
    }
    set onerror(value) {
      setEventAttributeValue(this, "error", value);
    }
    get onresult() {
      return getEventAttributeValue(this, "result");
    }
    set onresult(value) {
      setEventAttributeValue(this, "result", value);
    }
    get onsoundend() {
      return getEventAttributeValue(this, "soundend");
    }
    set onsoundend(value) {
      setEventAttributeValue(this, "soundend", value);
    }
    get onsoundstart() {
      return getEventAttributeValue(this, "soundstart");
    }
    set onsoundstart(value) {
      setEventAttributeValue(this, "soundstart", value);
    }
    get onspeechend() {
      return getEventAttributeValue(this, "speechend");
    }
    set onspeechend(value) {
      setEventAttributeValue(this, "speechend", value);
    }
    get onspeechstart() {
      return getEventAttributeValue(this, "speechstart");
    }
    set onspeechstart(value) {
      setEventAttributeValue(this, "speechstart", value);
    }
    get onstart() {
      return getEventAttributeValue(this, "start");
    }
    set onstart(value) {
      setEventAttributeValue(this, "start", value);
    }
    start() {
      this._startOnce().catch((err) => {
        this.dispatchEvent(new ErrorEvent("error", { error: err, message: err && (err.stack || err.message) }));
      });
    }
    async _startOnce() {
      const recognizer = await createRecognizer(this.lang);
      const { pause, unprepare } = prepareAudioConfig(recognizer.audioConfig);
      try {
        const queue = createPromiseQueue_default();
        let soundStarted;
        let speechStarted;
        let stopping;
        const { detach: detachAudioConfigEvent } = recognizer.audioConfig.events.attach((event) => {
          const { name } = event;
          if (name === "AudioSourceReadyEvent") {
            queue.push({ audioSourceReady: {} });
          } else if (name === "AudioSourceOffEvent") {
            queue.push({ audioSourceOff: {} });
          } else if (name === "FirstAudibleChunk") {
            queue.push({ firstAudibleChunk: {} });
          }
        });
        recognizer.canceled = (_, { errorDetails, offset, reason, sessionId }) => {
          queue.push({
            canceled: {
              errorDetails,
              offset,
              reason,
              sessionId
            }
          });
        };
        recognizer.recognized = (_, { offset, result, sessionId }) => {
          queue.push({
            recognized: {
              offset,
              result: serializeRecognitionResult(result),
              sessionId
            }
          });
        };
        recognizer.recognizing = (_, { offset, result, sessionId }) => {
          queue.push({
            recognizing: {
              offset,
              result: serializeRecognitionResult(result),
              sessionId
            }
          });
        };
        recognizer.sessionStarted = (_, { sessionId }) => {
          queue.push({ sessionStarted: { sessionId } });
        };
        recognizer.sessionStopped = (_, { sessionId }) => {
          queue.push({ sessionStopped: { sessionId } });
        };
        recognizer.speechStartDetected = (_, { offset, sessionId }) => {
          queue.push({ speechStartDetected: { offset, sessionId } });
        };
        recognizer.speechEndDetected = (_, { sessionId }) => {
          queue.push({ speechEndDetected: { sessionId } });
        };
        const { phrases } = this.grammars;
        const { dynamicGrammar } = recognizer.privReco;
        referenceGrammars && referenceGrammars.length && dynamicGrammar.addReferenceGrammar(referenceGrammars);
        phrases && phrases.length && dynamicGrammar.addPhrase(phrases);
        await cognitiveServicesAsyncToPromise(recognizer.startContinuousRecognitionAsync.bind(recognizer))();
        if (recognizer.stopContinuousRecognitionAsync) {
          this.abort = () => queue.push({ abort: {} });
          this.stop = () => queue.push({ stop: {} });
        } else {
          this.abort = this.stop = void 0;
        }
        let audioStarted;
        let finalEvent;
        let finalizedResults = [];
        for (let loop = 0; !stopping || audioStarted; loop++) {
          const event = await queue.shift();
          const {
            abort,
            audioSourceOff,
            audioSourceReady,
            canceled,
            firstAudibleChunk,
            recognized,
            recognizing,
            stop
          } = event;
          Object.keys(event).forEach((name) => this.emitCognitiveServices(name, event[name]));
          const errorMessage = canceled && canceled.errorDetails;
          if (/Permission\sdenied/u.test(errorMessage || "")) {
            finalEvent = {
              error: "not-allowed",
              type: "error"
            };
            break;
          }
          if (!loop) {
            this.dispatchEvent(new SpeechRecognitionEvent("start"));
          }
          if (errorMessage) {
            if (/1006/u.test(errorMessage)) {
              if (!audioStarted) {
                this.dispatchEvent(new SpeechRecognitionEvent("audiostart"));
                this.dispatchEvent(new SpeechRecognitionEvent("audioend"));
              }
              finalEvent = {
                error: "network",
                type: "error"
              };
            } else {
              finalEvent = {
                error: "unknown",
                type: "error"
              };
            }
            break;
          } else if (abort || stop) {
            if (abort) {
              finalEvent = {
                error: "aborted",
                type: "error"
              };
              stopping = "abort";
            } else {
              pause();
              stopping = "stop";
            }
            if (abort && recognizer.stopContinuousRecognitionAsync) {
              await cognitiveServicesAsyncToPromise(recognizer.stopContinuousRecognitionAsync.bind(recognizer))();
            }
          } else if (audioSourceReady) {
            this.dispatchEvent(new SpeechRecognitionEvent("audiostart"));
            audioStarted = true;
          } else if (firstAudibleChunk) {
            this.dispatchEvent(new SpeechRecognitionEvent("soundstart"));
            soundStarted = true;
          } else if (audioSourceOff) {
            speechStarted && this.dispatchEvent(new SpeechRecognitionEvent("speechend"));
            soundStarted && this.dispatchEvent(new SpeechRecognitionEvent("soundend"));
            audioStarted && this.dispatchEvent(new SpeechRecognitionEvent("audioend"));
            audioStarted = soundStarted = speechStarted = false;
            break;
          } else if (stopping !== "abort") {
            if (recognized && recognized.result && recognized.result.reason === ResultReason2.NoMatch) {
              finalEvent = {
                error: "no-speech",
                type: "error"
              };
            } else if (recognized || recognizing) {
              if (!audioStarted) {
                this.dispatchEvent(new SpeechRecognitionEvent("audiostart"));
                audioStarted = true;
              }
              if (!soundStarted) {
                this.dispatchEvent(new SpeechRecognitionEvent("soundstart"));
                soundStarted = true;
              }
              if (!speechStarted) {
                this.dispatchEvent(new SpeechRecognitionEvent("speechstart"));
                speechStarted = true;
              }
              if (recognized) {
                const result = cognitiveServiceEventResultToWebSpeechRecognitionResultList_default(recognized.result, {
                  maxAlternatives: this.maxAlternatives,
                  textNormalization
                });
                const recognizable = !!result[0].transcript;
                if (recognizable) {
                  finalizedResults = [...finalizedResults, result];
                  this.continuous && this.dispatchEvent(
                    new SpeechRecognitionEvent("result", {
                      results: finalizedResults
                    })
                  );
                }
                if (this.continuous && recognizable) {
                  finalEvent = null;
                } else {
                  finalEvent = {
                    results: finalizedResults,
                    type: "result"
                  };
                }
                if (!this.continuous && recognizer.stopContinuousRecognitionAsync) {
                  await cognitiveServicesAsyncToPromise(recognizer.stopContinuousRecognitionAsync.bind(recognizer))();
                }
                if (looseEvents && finalEvent && recognizable) {
                  this.dispatchEvent(new SpeechRecognitionEvent(finalEvent.type, finalEvent));
                  finalEvent = null;
                }
              } else if (recognizing) {
                this.interimResults && this.dispatchEvent(
                  new SpeechRecognitionEvent("result", {
                    results: [
                      ...finalizedResults,
                      cognitiveServiceEventResultToWebSpeechRecognitionResultList_default(recognizing.result, {
                        maxAlternatives: this.maxAlternatives,
                        textNormalization
                      })
                    ]
                  })
                );
              }
            }
          }
        }
        if (speechStarted) {
          this.dispatchEvent(new SpeechRecognitionEvent("speechend"));
        }
        if (soundStarted) {
          this.dispatchEvent(new SpeechRecognitionEvent("soundend"));
        }
        if (audioStarted) {
          this.dispatchEvent(new SpeechRecognitionEvent("audioend"));
        }
        if (finalEvent) {
          if (finalEvent.type === "result" && !finalEvent.results.length) {
            finalEvent = {
              error: "no-speech",
              type: "error"
            };
          }
          if (finalEvent.type === "error") {
            this.dispatchEvent(new ErrorEvent("error", finalEvent));
          } else {
            this.dispatchEvent(new SpeechRecognitionEvent(finalEvent.type, finalEvent));
          }
        }
        this.dispatchEvent(new SpeechRecognitionEvent("end"));
        detachAudioConfigEvent();
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        unprepare();
        recognizer.dispose();
      }
    }
  }
  return {
    SpeechGrammarList: SpeechGrammarList_default,
    SpeechRecognition,
    SpeechRecognitionEvent
  };
}
var createSpeechRecognitionPonyfill_default = (options) => {
  const {
    audioConfig = AudioConfig2.fromDefaultMicrophoneInput(),
    // We set telemetry to true to honor the default telemetry settings of Speech SDK
    // https://github.com/Microsoft/cognitive-services-speech-sdk-js#data--telemetry
    enableTelemetry = true,
    fetchCredentials,
    looseEvents,
    referenceGrammars,
    speechRecognitionEndpointId,
    textNormalization = "display"
  } = patchOptions(options);
  if (!audioConfig && (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia)) {
    console.warn(
      "web-speech-cognitive-services: This browser does not support WebRTC and it will not work with Cognitive Services Speech Services."
    );
    return {};
  }
  const createRecognizer = async (lang) => {
    const { authorizationToken, region, speechRecognitionHostname, subscriptionKey } = await fetchCredentials();
    let speechConfig;
    if (speechRecognitionHostname) {
      const host = { hostname: speechRecognitionHostname, port: 443, protocol: "wss:" };
      if (authorizationToken) {
        speechConfig = SpeechConfig2.fromHost(host);
        speechConfig.authorizationToken = authorizationToken;
      } else {
        speechConfig = SpeechConfig2.fromHost(host, subscriptionKey);
      }
    } else {
      speechConfig = authorizationToken ? SpeechConfig2.fromAuthorizationToken(authorizationToken, region) : SpeechConfig2.fromSubscription(subscriptionKey, region);
    }
    if (speechRecognitionEndpointId) {
      speechConfig.endpointId = speechRecognitionEndpointId;
    }
    speechConfig.outputFormat = OutputFormat2.Detailed;
    speechConfig.speechRecognitionLanguage = lang || "en-US";
    return new SpeechRecognizer2(speechConfig, audioConfig);
  };
  return createSpeechRecognitionPonyfillFromRecognizer({
    audioConfig,
    createRecognizer,
    enableTelemetry,
    looseEvents,
    referenceGrammars,
    textNormalization
  });
};

// src/SpeechServices/SpeechToText.js
var SpeechToText_default = createSpeechRecognitionPonyfill_default;

// src/SpeechServices/TextToSpeech/createSpeechSynthesisPonyfill.js
import { EventTarget as EventTarget3, getEventAttributeValue as getEventAttributeValue3, setEventAttributeValue as setEventAttributeValue3 } from "event-target-shim";
import { onErrorResumeNext } from "on-error-resume-next/async";

// src/SpeechServices/TextToSpeech/AudioContextQueue.js
import memoize from "memoize-one";

// src/SpeechServices/TextToSpeech/AudioContextConsumer.js
var AudioContextConsumer_default = class {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }
  pause() {
    this.audioContext && this.audioContext.suspend();
    this.playingUtterance && this.playingUtterance.dispatchEvent(new CustomEvent("pause"));
  }
  resume() {
    this.audioContext && this.audioContext.resume();
    this.playingUtterance && this.playingUtterance.dispatchEvent(new CustomEvent("resume"));
  }
  async start(queue) {
    let utterance;
    while (utterance = queue.shift()) {
      this.playingUtterance = utterance;
      await utterance.play(this.audioContext);
      this.playingUtterance = null;
    }
  }
  stop() {
    this.playingUtterance && this.playingUtterance.stop();
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
};

// src/SpeechServices/TextToSpeech/AudioContextQueue.js
var AudioContextQueue_default = class {
  constructor({ audioContext, ponyfill }) {
    this.consumer = null;
    this.paused = false;
    this.queue = [];
    this.getAudioContext = memoize(() => audioContext || new ponyfill.AudioContext());
  }
  pause() {
    this.paused = true;
    this.consumer && this.consumer.pause();
  }
  push(utterance) {
    this.queue.push(utterance);
    this.startConsumer();
  }
  resume() {
    this.paused = false;
    if (this.consumer) {
      this.consumer.resume();
    } else {
      this.startConsumer();
    }
  }
  get speaking() {
    return !!this.consumer;
  }
  async startConsumer() {
    while (!this.paused && this.queue.length && !this.consumer) {
      this.consumer = new AudioContextConsumer_default(this.getAudioContext());
      await this.consumer.start(this.queue);
      this.consumer = null;
    }
  }
  stop() {
    this.queue.splice(0);
    this.consumer && this.consumer.stop();
  }
};

// src/SpeechServices/TextToSpeech/SpeechSynthesisEvent.js
import { Event as Event2 } from "event-target-shim";
var SpeechSynthesisEvent = class extends Event2 {
  constructor(type) {
    super(type);
  }
};

// src/SpeechServices/TextToSpeech/SpeechSynthesisUtterance.js
import { EventTarget as EventTarget2, getEventAttributeValue as getEventAttributeValue2, setEventAttributeValue as setEventAttributeValue2 } from "event-target-shim";
import EventAsPromise from "event-as-promise";

// src/SpeechServices/TextToSpeech/fetchSpeechData.js
import { decode } from "base64-arraybuffer";

// src/SpeechServices/TextToSpeech/buildSSML.js
function relativePercentage(value) {
  let relative = Math.round((value - 1) * 100);
  if (relative >= 0) {
    relative = "+" + relative;
  }
  return relative + "%";
}
function buildSSML({ lang, pitch = 1, rate = 1, text, voice, volume }) {
  return `<speak version="1.0" xml:lang="${lang}">
  <voice xml:lang="${lang}" name="${voice}">
    <prosody pitch="${relativePercentage(pitch)}" rate="${relativePercentage(rate)}" volume="${relativePercentage(
    volume
  )}">
      ${text}
    </prosody>
  </voice>
</speak>`;
}

// src/SpeechServices/TextToSpeech/isSSML.js
var SPEAK_TAG_PATTERN = /^\s*<speak(\s|\/?>)/u;
var XML_PROLOG_PATTERN = /^\s*<\?xml\s/u;
function isSSML(text) {
  return SPEAK_TAG_PATTERN.test(text) || XML_PROLOG_PATTERN.test(text);
}

// src/SpeechServices/TextToSpeech/fetchSpeechData.js
var DEFAULT_LANGUAGE = "en-US";
var DEFAULT_OUTPUT_FORMAT = "riff-16khz-16bit-mono-pcm";
var DEFAULT_VOICE = "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)";
var EMPTY_MP3_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMQAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU3LjY0AAAAAAAAAAAAAAAAJAUHAAAAAAAAAYYoRBqpAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMQpg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
async function fetchSpeechData_default({
  deploymentId,
  fetchCredentials,
  lang = DEFAULT_LANGUAGE,
  outputFormat = DEFAULT_OUTPUT_FORMAT,
  pitch,
  rate,
  text,
  voice = DEFAULT_VOICE,
  volume
}) {
  if (!text) {
    return decode(EMPTY_MP3_BASE64);
  }
  const { authorizationToken, region, speechSynthesisHostname, subscriptionKey } = await fetchCredentials();
  if (authorizationToken && subscriptionKey || !authorizationToken && !subscriptionKey) {
    throw new Error('Only "authorizationToken" or "subscriptionKey" should be set.');
  } else if (region && speechSynthesisHostname || !region && !speechSynthesisHostname) {
    throw new Error('Only "region" or "speechSynthesisHostnamename" should be set.');
  }
  const ssml = isSSML(text) ? text : buildSSML({ lang, pitch, rate, text, voice, volume });
  const hostname = speechSynthesisHostname || (deploymentId ? `${encodeURI(region)}.voice.speech.microsoft.com` : `${encodeURI(region)}.tts.speech.microsoft.com`);
  const search = deploymentId ? `?deploymentId=${encodeURI(deploymentId)}` : "";
  const url = `https://${hostname}/cognitiveservices/v1${search}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": outputFormat,
      ...authorizationToken ? {
        Authorization: `Bearer ${authorizationToken}`
      } : {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    },
    method: "POST",
    body: ssml
  });
  if (!res.ok) {
    throw new Error(`web-speech-cognitive-services: Failed to syntheis speech, server returned ${res.status}`);
  }
  return res.arrayBuffer();
}

// src/SpeechServices/TextToSpeech/subscribeEvent.js
function subscribeEvent(target, name, handler) {
  target.addEventListener(name, handler);
  return () => target.removeEventListener(name, handler);
}

// src/SpeechServices/TextToSpeech/SpeechSynthesisUtterance.js
function asyncDecodeAudioData(audioContext, arrayBuffer) {
  return new Promise((resolve, reject) => {
    const promise = audioContext.decodeAudioData(arrayBuffer, resolve, reject);
    promise && typeof promise.then === "function" && resolve(promise);
  });
}
function playDecoded(audioContext, audioBuffer, source) {
  return new Promise((resolve, reject) => {
    const audioContextClosed = new EventAsPromise();
    const sourceEnded = new EventAsPromise();
    const unsubscribe = subscribeEvent(
      audioContext,
      "statechange",
      ({ target: { state } }) => state === "closed" && audioContextClosed.eventListener()
    );
    try {
      source.buffer = audioBuffer;
      source.onended = sourceEnded.eventListener;
      source.connect(audioContext.destination);
      source.start(0);
      Promise.race([audioContextClosed.upcoming(), sourceEnded.upcoming()]).then(resolve);
    } catch (err) {
      reject(err);
    } finally {
      unsubscribe();
    }
  });
}
var SpeechSynthesisUtterance = class extends EventTarget2 {
  constructor(text) {
    super();
    this._lang = null;
    this._pitch = 1;
    this._rate = 1;
    this._voice = null;
    this._volume = 1;
    this.text = text;
    this.onboundary = null;
    this.onend = null;
    this.onerror = null;
    this.onmark = null;
    this.onpause = null;
    this.onresume = null;
    this.onstart = null;
  }
  get lang() {
    return this._lang;
  }
  set lang(value) {
    this._lang = value;
  }
  get onboundary() {
    return getEventAttributeValue2(this, "boundary");
  }
  set onboundary(value) {
    setEventAttributeValue2(this, "boundary", value);
  }
  get onend() {
    return getEventAttributeValue2(this, "end");
  }
  set onend(value) {
    setEventAttributeValue2(this, "end", value);
  }
  get onerror() {
    return getEventAttributeValue2(this, "error");
  }
  set onerror(value) {
    setEventAttributeValue2(this, "error", value);
  }
  get onmark() {
    return getEventAttributeValue2(this, "mark");
  }
  set onmark(value) {
    setEventAttributeValue2(this, "mark", value);
  }
  get onpause() {
    return getEventAttributeValue2(this, "pause");
  }
  set onpause(value) {
    setEventAttributeValue2(this, "pause", value);
  }
  get onresume() {
    return getEventAttributeValue2(this, "resume");
  }
  set onresume(value) {
    setEventAttributeValue2(this, "resume", value);
  }
  get onstart() {
    return getEventAttributeValue2(this, "start");
  }
  set onstart(value) {
    setEventAttributeValue2(this, "start", value);
  }
  get pitch() {
    return this._pitch;
  }
  set pitch(value) {
    this._pitch = value;
  }
  get rate() {
    return this._rate;
  }
  set rate(value) {
    this._rate = value;
  }
  get voice() {
    return this._voice;
  }
  set voice(value) {
    this._voice = value;
  }
  get volume() {
    return this._volume;
  }
  set volume(value) {
    this._volume = value;
  }
  preload({ deploymentId, fetchCredentials, outputFormat }) {
    this.arrayBufferPromise = fetchSpeechData_default({
      fetchCredentials,
      deploymentId,
      lang: this.lang || window.navigator.language,
      outputFormat,
      pitch: this.pitch,
      rate: this.rate,
      text: this.text,
      voice: this.voice && this.voice.voiceURI,
      volume: this.volume
    });
    this.arrayBufferPromise.catch();
  }
  async play(audioContext) {
    try {
      this.dispatchEvent(new SpeechSynthesisEvent("start"));
      const source = audioContext.createBufferSource();
      const audioBuffer = await asyncDecodeAudioData(audioContext, await this.arrayBufferPromise);
      this._playingSource = source;
      await playDecoded(audioContext, audioBuffer, source);
      this._playingSource = null;
      this.dispatchEvent(new SpeechSynthesisEvent("end"));
    } catch (error) {
      this.dispatchEvent(new ErrorEvent("error", { error: "synthesis-failed", message: error.stack }));
    }
  }
  stop() {
    this._playingSource && this._playingSource.stop();
  }
};
var SpeechSynthesisUtterance_default = SpeechSynthesisUtterance;

// src/SpeechServices/TextToSpeech/SpeechSynthesisVoice.js
var SpeechSynthesisVoice_default = class {
  constructor({ gender, lang, voiceURI }) {
    this._default = false;
    this._gender = gender;
    this._lang = lang;
    this._localService = false;
    this._name = voiceURI;
    this._voiceURI = voiceURI;
  }
  get default() {
    return this._default;
  }
  get gender() {
    return this._gender;
  }
  get lang() {
    return this._lang;
  }
  get localService() {
    return this._localService;
  }
  get name() {
    return this._name;
  }
  get voiceURI() {
    return this._voiceURI;
  }
};

// src/SpeechServices/TextToSpeech/fetchCustomVoices.js
async function fetchCustomVoices({ customVoiceHostname, deploymentId, region, subscriptionKey }) {
  const hostname = customVoiceHostname || `${region}.customvoice.api.speech.microsoft.com`;
  const res = await fetch(
    `https://${encodeURI(hostname)}/api/texttospeech/v2.0/endpoints/${encodeURIComponent(deploymentId)}`,
    {
      headers: {
        accept: "application/json",
        "ocp-apim-subscription-key": subscriptionKey
      }
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch custom voices");
  }
  return res.json();
}
async function fetchCustomVoices_default({ customVoiceHostname, deploymentId, region, subscriptionKey }) {
  const { models } = await fetchCustomVoices({ customVoiceHostname, deploymentId, region, subscriptionKey });
  return models.map(
    ({ properties: { Gender: gender }, locale: lang, name: voiceURI }) => new SpeechSynthesisVoice_default({ gender, lang, voiceURI })
  ).sort(({ name: x }, { name: y }) => x > y ? 1 : x < y ? -1 : 0);
}

// src/SpeechServices/TextToSpeech/fetchVoices.js
async function fetchVoices({ authorizationToken, region, speechSynthesisHostname, subscriptionKey }) {
  const hostname = speechSynthesisHostname || `${encodeURI(region)}.tts.speech.microsoft.com`;
  const res = await fetch(`https://${hostname}/cognitiveservices/voices/list`, {
    headers: {
      "content-type": "application/json",
      ...authorizationToken ? {
        authorization: `Bearer ${authorizationToken}`
      } : {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch voices");
  }
  const voices = await res.json();
  return voices.map(({ Gender: gender, Locale: lang, Name: voiceURI }) => new SpeechSynthesisVoice_default({ gender, lang, voiceURI })).sort(({ name: x }, { name: y }) => x > y ? 1 : x < y ? -1 : 0);
}

// src/SpeechServices/TextToSpeech/createSpeechSynthesisPonyfill.js
var DEFAULT_OUTPUT_FORMAT2 = "audio-24khz-160kbitrate-mono-mp3";
var EMPTY_ARRAY = [];
var createSpeechSynthesisPonyfill_default = (options) => {
  const {
    audioContext,
    fetchCredentials,
    ponyfill = {
      AudioContext: window.AudioContext || window.webkitAudioContext
    },
    speechSynthesisDeploymentId,
    speechSynthesisOutputFormat = DEFAULT_OUTPUT_FORMAT2
  } = patchOptions(options);
  if (!audioContext && !ponyfill.AudioContext) {
    console.warn(
      "web-speech-cognitive-services: This browser does not support Web Audio and it will not work with Cognitive Services Speech Services."
    );
    return {};
  }
  class SpeechSynthesis extends EventTarget3 {
    constructor() {
      super();
      this.queue = new AudioContextQueue_default({ audioContext, ponyfill });
      this.updateVoices();
    }
    cancel() {
      this.queue.stop();
    }
    getVoices() {
      return EMPTY_ARRAY;
    }
    get onvoiceschanged() {
      return getEventAttributeValue3(this, "voiceschanged");
    }
    set onvoiceschanged(value) {
      setEventAttributeValue3(this, "voiceschanged", value);
    }
    pause() {
      this.queue.pause();
    }
    resume() {
      this.queue.resume();
    }
    speak(utterance) {
      if (!(utterance instanceof SpeechSynthesisUtterance_default)) {
        throw new Error("invalid utterance");
      }
      const { reject, resolve, promise } = pDefer();
      const handleError = ({ error: errorCode, message }) => {
        const error = new Error(errorCode);
        error.stack = message;
        reject(error);
      };
      utterance.addEventListener("end", resolve);
      utterance.addEventListener("error", handleError);
      utterance.preload({
        deploymentId: speechSynthesisDeploymentId,
        fetchCredentials,
        outputFormat: speechSynthesisOutputFormat
      });
      this.queue.push(utterance);
      return promise.finally(() => {
        utterance.removeEventListener("end", resolve);
        utterance.removeEventListener("error", handleError);
      });
    }
    get speaking() {
      return this.queue.speaking;
    }
    async updateVoices() {
      const { customVoiceHostname, region, speechSynthesisHostname, subscriptionKey } = await fetchCredentials();
      if (speechSynthesisDeploymentId) {
        if (subscriptionKey) {
          console.warn(
            "web-speech-cognitive-services: Listing of custom voice models are only available when using subscription key."
          );
          await onErrorResumeNext(async () => {
            const voices = await fetchCustomVoices_default({
              customVoiceHostname,
              deploymentId: speechSynthesisDeploymentId,
              region,
              speechSynthesisHostname,
              subscriptionKey
            });
            this.getVoices = () => voices;
          });
        }
      } else {
        await onErrorResumeNext(async () => {
          const voices = await fetchVoices(await fetchCredentials());
          this.getVoices = () => voices;
        });
      }
      this.dispatchEvent(new SpeechSynthesisEvent("voiceschanged"));
    }
  }
  return {
    speechSynthesis: new SpeechSynthesis(),
    SpeechSynthesisEvent,
    SpeechSynthesisUtterance: SpeechSynthesisUtterance_default
  };
};

// src/SpeechServices/TextToSpeech.js
var TextToSpeech_default = createSpeechSynthesisPonyfill_default;

// src/SpeechServices/fetchAuthorizationToken.js
var TOKEN_URL_TEMPLATE = "https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken";
async function fetchAuthorizationToken_default({ region, subscriptionKey }) {
  const res = await fetch(TOKEN_URL_TEMPLATE.replace(/\{region\}/u, region), {
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey
    },
    method: "POST"
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch authorization token, server returned ${res.status}`);
  }
  return res.text();
}

// src/SpeechServices.js
function createSpeechServicesPonyfill(options = {}, ...args) {
  return {
    ...SpeechToText_default(options, ...args),
    ...TextToSpeech_default(options, ...args)
  };
}
export {
  SpeechToText_default as createSpeechRecognitionPonyfill,
  createSpeechRecognitionPonyfillFromRecognizer,
  createSpeechServicesPonyfill,
  TextToSpeech_default as createSpeechSynthesisPonyfill,
  fetchAuthorizationToken_default as fetchAuthorizationToken
};
//# sourceMappingURL=web-speech-cognitive-services.mjs.map
import * as memoize_one from 'memoize-one';

declare class SpeechSynthesisUtterance {
    constructor(text: any);
    _lang: any;
    _pitch: number;
    _rate: number;
    _voice: any;
    _volume: number;
    text: any;
    set onboundary(value: any);
    get onboundary(): any;
    set onend(value: any);
    get onend(): any;
    set onerror(value: any);
    get onerror(): any;
    set onmark(value: any);
    get onmark(): any;
    set onpause(value: any);
    get onpause(): any;
    set onresume(value: any);
    get onresume(): any;
    set onstart(value: any);
    get onstart(): any;
    set lang(value: any);
    get lang(): any;
    set pitch(value: number);
    get pitch(): number;
    set rate(value: number);
    get rate(): number;
    set voice(value: any);
    get voice(): any;
    set volume(value: number);
    get volume(): number;
    preload({ deploymentId, fetchCredentials, outputFormat }: {
        deploymentId: any;
        fetchCredentials: any;
        outputFormat: any;
    }): void;
    arrayBufferPromise: Promise<ArrayBuffer> | undefined;
    play(audioContext: any): Promise<void>;
    _playingSource: any;
    stop(): void;
}

declare class SpeechSynthesisEvent {
    constructor(type: any);
}

declare class _default$5 {
    constructor(audioContext: any);
    audioContext: any;
    pause(): void;
    resume(): void;
    start(queue: any): Promise<void>;
    playingUtterance: any;
    stop(): void;
}

declare class _default$4 {
    constructor({ audioContext, ponyfill }: {
        audioContext: any;
        ponyfill: any;
    });
    consumer: _default$5 | null;
    paused: boolean;
    queue: any[];
    getAudioContext: memoize_one.MemoizedFn<() => any>;
    pause(): void;
    push(utterance: any): void;
    resume(): void;
    get speaking(): boolean;
    startConsumer(): Promise<void>;
    stop(): void;
}

declare class _default$3 {
    _phrases: any[];
    addFromString(): void;
    set phrases(value: any[]);
    get phrases(): any[];
}

declare function createSpeechRecognitionPonyfillFromRecognizer({ createRecognizer, enableTelemetry, looseEvents, referenceGrammars, textNormalization }: {
    createRecognizer: any;
    enableTelemetry: any;
    looseEvents: any;
    referenceGrammars: any;
    textNormalization: any;
}): {
    SpeechGrammarList: typeof _default$3;
    SpeechRecognition: {
        new (): {
            _continuous: boolean;
            _interimResults: boolean;
            _lang: string;
            _grammars: _default$3;
            _maxAlternatives: number;
            emitCognitiveServices(type: any, event: any): void;
            continuous: boolean;
            grammars: _default$3;
            interimResults: boolean;
            maxAlternatives: number;
            lang: string;
            onaudioend: any;
            onaudiostart: any;
            oncognitiveservices: any;
            onend: any;
            onerror: any;
            onresult: any;
            onsoundend: any;
            onsoundstart: any;
            onspeechend: any;
            onspeechstart: any;
            onstart: any;
            start(): void;
            _startOnce(): Promise<void>;
            abort: (() => void) | undefined;
            stop: (() => void) | undefined;
        };
    };
    SpeechRecognitionEvent: typeof SpeechRecognitionEvent;
};
declare function _default$2(options: any): {};

declare class SpeechRecognitionEvent {
    constructor(type: any, { data, emma, interpretation, resultIndex, results }?: {
        data: any;
        emma: any;
        interpretation: any;
        resultIndex: any;
        results: any;
    });
    data: any;
    emma: any;
    interpretation: any;
    resultIndex: any;
    results: any;
}

declare function _default$1(options: any): {
    speechSynthesis?: never;
    SpeechSynthesisEvent?: never;
    SpeechSynthesisUtterance?: never;
} | {
    speechSynthesis: {
        queue: _default$4;
        cancel(): void;
        getVoices(): any[];
        onvoiceschanged: any;
        pause(): void;
        resume(): void;
        speak(utterance: any): Promise<any>;
        readonly speaking: boolean;
        updateVoices(): Promise<void>;
    };
    SpeechSynthesisEvent: typeof SpeechSynthesisEvent;
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
};

declare function _default({ region, subscriptionKey }: {
    region: any;
    subscriptionKey: any;
}): Promise<string>;

declare function createSpeechServicesPonyfill(options?: {}, ...args: any[]): {
    speechSynthesis?: never;
    SpeechSynthesisEvent?: never;
    SpeechSynthesisUtterance?: never;
} | {
    speechSynthesis: {
        queue: _default$4;
        cancel(): void;
        getVoices(): any[];
        onvoiceschanged: any;
        pause(): void;
        resume(): void;
        speak(utterance: any): Promise<any>;
        readonly speaking: boolean;
        updateVoices(): Promise<void>;
    };
    SpeechSynthesisEvent: typeof SpeechSynthesisEvent;
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
};

export { _default$2 as createSpeechRecognitionPonyfill, createSpeechRecognitionPonyfillFromRecognizer, createSpeechServicesPonyfill, _default$1 as createSpeechSynthesisPonyfill, _default as fetchAuthorizationToken };

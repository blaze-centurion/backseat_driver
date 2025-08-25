// Add this at the top of speech.ts
declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

interface SpeechCallbacks {
  onResult: (text: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      // this.recognition = new SpeechRecognition();
      // const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      // const recognition = new SpeechRec();

      
      // this.recognition.continuous = true;
      // this.recognition.interimResults = true;
      // this.recognition.lang = 'en-US';
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRec();

      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported in this browser');
        return;
      }

    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  startListening(callbacks: SpeechCallbacks, streamInterim = false) {
    if (!this.recognition || this.isListening) {
      callbacks.onError('Speech recognition not available or already listening');
      return;
    }

    this.isListening = true;
    let lastFinalResult = '';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results if streaming is enabled
      if (streamInterim && interimTranscript) {
        callbacks.onResult(interimTranscript, false);
      }

      // Handle final results with debouncing
      if (finalTranscript && finalTranscript !== lastFinalResult) {
        lastFinalResult = finalTranscript;
        
        // Clear existing debounce timer
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        
        // Debounce final results to avoid rapid-fire processing
        this.debounceTimer = setTimeout(() => {
          callbacks.onResult(finalTranscript.trim(), true);
        }, 500);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      
      // Handle permission errors gracefully
      if (event.error === 'not-allowed') {
        callbacks.onError('Microphone permission denied. Please allow microphone access.');
      } else {
        callbacks.onError(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      callbacks.onError('Failed to start speech recognition');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  getListeningState(): boolean {
    return this.isListening;
  }
}
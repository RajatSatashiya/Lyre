const { PitchDetector } = await import("pitchy");

const STANDARD_TUNING = {
  E2: 82.41, // thickest string
  A2: 110.0,
  D3: 146.83,
  G3: 196.0,
  B3: 246.94,
  E4: 329.63, // thinnest string
};

export const analyzePitch = async (
  stream: MediaStream,
  setTuningStatus: (status: string) => void,
  audioContext: AudioContext,
) => {
  try {
    // Create analyserNode
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);

    // Initialize pitch detector
    const inputLength = 1024;
    const detector = PitchDetector.forFloat32Array(inputLength);
    const input = new Float32Array(detector.inputLength);

    let animationFrameId: number;
    const silenceThreshold = 0.01; // silence threshold so pitch detection happens only when guitar is playing

    const updatePitch = () => {
      analyzer.getFloatTimeDomainData(input);

      // Calculate signal amplitude (RMS)
      const rms = Math.sqrt(
        input.reduce((sum, x) => sum + x * x, 0) / input.length
      );

      if (rms > silenceThreshold) {
        // Guitar is playing
        const [pitch] = detector.findPitch(input, audioContext.sampleRate);

        if (pitch > 0) {
          setTuningStatus(checkTuning(pitch));
        }
      } else {
        // Guitar is not playing
        setTuningStatus("Waiting for sound...");
      }

      animationFrameId = requestAnimationFrame(updatePitch);
    };

    updatePitch();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  } catch (error) {
    console.error("Error in analyzePitch:", error);
  }
};

// Function to check tuning status
const checkTuning = (detectedPitch: number): string => {
  const diff = detectedPitch - STANDARD_TUNING.E4;
  const absDiff = Math.abs(diff);
  const tolerance = 2; // Allow small deviation

  if (absDiff <= tolerance) {
    return "Tuned";
  } else if (diff > 0) {
    return "" + Math.round(diff);
  } else if (diff < 0) {
    return "" + Math.round(diff);
  } else {
    return "";
  }
};

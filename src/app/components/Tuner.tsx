"use client";

import { useState, useRef, useEffect } from "react";
import { analyzePitch } from "../utils/analyzePitch";
import styles from "./Tuner.module.css";

const GUITAR_STRINGS = {
  E2: {
    // thickest String
    key: "E2",
    display: "E",
  },
  A: {
    key: "A2",
    display: "A",
  },
  D: {
    key: "D3",
    display: "D",
  },
  G: {
    key: "G3",
    display: "G",
  },
  B: {
    key: "B3",
    display: "B",
  },
  E: {
    key: "E4",
    display: "E",
  },
};

export default function Tuner() {
  const [tuningStatus, setTuningStatus] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const selectedStringRef = useRef<string>(GUITAR_STRINGS.E.key);
  const [selectedString, setSelectedString] = useState<string>(
    GUITAR_STRINGS.E.key
  );

  useEffect(() => {
    selectedStringRef.current = selectedString;
  }, [selectedString]);

  const startTuning = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Microphone access is not supported in this browser.");
      return;
    }

    try {
      audioContextRef.current = new AudioContext();
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      await analyzePitch(
        mediaStreamRef.current,
        setTuningStatus,
        audioContextRef.current,
        selectedStringRef,
        stopTuning
      );
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopAudio = async () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const stopTuning = () => {
    stopAudio();
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
      });
    }
    setIsListening(false);
  };

  return (
    <div className="tuner">
      <h2>LyreBird - Guitar Tuner</h2>
      <p>Status: {tuningStatus}</p>

      {isListening ? (
        <button onClick={stopTuning}>Stop Tuning</button>
      ) : (
        <button onClick={startTuning}>Start Tuning</button>
      )}

      <div className={styles.stringContainer}>
        {Object.entries(GUITAR_STRINGS).map(([key, guitar_string]) => (
          <div
            key={key}
            onClick={() => {
              setSelectedString(guitar_string.key);
            }}
            className={`${styles.stringBox} ${
              selectedString === guitar_string.key
                ? styles.active
                : styles.inactive
            }`}
          >
            {guitar_string.display}
          </div>
        ))}
      </div>
    </div>
  );
}

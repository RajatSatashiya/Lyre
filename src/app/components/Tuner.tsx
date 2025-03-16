"use client";

import { useState, useRef } from "react";
import { analyzePitch } from "../utils/analyzePitch";

export default function Tuner() {
  const [tuningStatus, setTuningStatus] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

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
        audioContextRef.current
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
      <h2>Guitar Tuner</h2>
      <p>Status: {tuningStatus}</p>

      {isListening ? (
        <button onClick={stopTuning}>Stop Tuning</button>
      ) : (
        <button onClick={startTuning}>Start Tuning</button>
      )}
    </div>
  );
}

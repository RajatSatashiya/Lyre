"use client";

import * as Tone from "tone";

const notes = {
  E: 82.41,
  A: 110,
  D: 146.83,
  G: 196,
  B: 246.94,
  e: 329.63,
};

const playTone = (freq: number) => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(freq, "1s");
};

export default function ReferenceTones() {
  return (
    <div>
      {Object.entries(notes).map(([note, freq]) => (
        <button
          key={note}
          onClick={() => {
            playTone(freq);
          }}
        >
          Play {note}
        </button>
      ))}
    </div>
  );
}

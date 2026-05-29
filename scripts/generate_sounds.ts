/**
 * Genera i file audio WAV per i feedback del quiz.
 * Eseguire con: tsx scripts/generate_sounds.ts
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

const SAMPLE_RATE = 44100;

function writeWav(samples: Float32Array, filePath: string) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2; // 16-bit
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);        // chunk size
  buffer.writeUInt16LE(1, 20);         // PCM
  buffer.writeUInt16LE(1, 22);         // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);         // block align
  buffer.writeUInt16LE(16, 34);        // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  writeFileSync(filePath, buffer);
}

function envelope(i: number, total: number): number {
  const attack = 0.01 * total;
  const release = 0.2 * total;
  if (i < attack) return i / attack;
  if (i > total - release) return (total - i) / release;
  return 1;
}

// correct.mp3 — ding ascendente (C5 → E5 → G5)
function generateCorrect(): Float32Array {
  const duration = 0.5;
  const total = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(total);
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const noteDur = Math.floor(total / notes.length);

  for (let n = 0; n < notes.length; n++) {
    const freq = notes[n];
    const start = n * noteDur;
    const end = Math.min(start + noteDur, total);
    for (let i = start; i < end; i++) {
      const t = i - start;
      samples[i] = Math.sin(2 * Math.PI * freq * t / SAMPLE_RATE) * 0.6 * envelope(t, end - start);
    }
  }
  return samples;
}

// wrong.mp3 — buzz discendente (B3 → G3)
function generateWrong(): Float32Array {
  const duration = 0.4;
  const total = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(total);
  const freqStart = 246.94; // B3
  const freqEnd = 196.00;   // G3

  for (let i = 0; i < total; i++) {
    const freq = freqStart + (freqEnd - freqStart) * (i / total);
    samples[i] = Math.sin(2 * Math.PI * freq * i / SAMPLE_RATE) * 0.6 * envelope(i, total);
  }
  return samples;
}

const outDir = join(process.cwd(), 'assets', 'sounds');

writeWav(generateCorrect(), join(outDir, 'correct.wav'));
writeWav(generateWrong(), join(outDir, 'wrong.wav'));

console.log('Suoni generati in assets/sounds/');

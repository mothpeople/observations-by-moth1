#!/usr/bin/env python3
"""
Procedural Cyber-Zen Sound Design & Soundtrack Engine for Observations by Moth1
Replaces sharp percussive hits with subtle acoustic clock ticking and deep,
multi-layered Japanese temple bells and Tibetan singing bowls.

Key Elements:
  - Subtle Clock Ticking: Minimalist acoustic watch escapement / pendulum pulse (no harshness)
  - Deep Temple Gongs: Resonant, warm inharmonic bells with soft felt mallet strikes & long decay
  - Crystalline Singing Bowls: Shimmering metallic overtones providing spatial sanctuary depth
  - Atmospheric Foundation: Sub-bass meditation drone + rainstorm (Issue 01) / industrial hum (Issue 02)
"""

import os
import sys
import math
import wave
import subprocess
import numpy as np

SR = 44100 # Standard 44.1kHz sample rate
AUDIO_DIR = "public/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# ==============================================================================
# DSP UTILITIES & SOUND GENERATORS
# ==============================================================================

def create_pink_noise(num_samples):
    """Generate warm pink noise using spectral shaping (1/f roll-off)."""
    white = np.random.randn(num_samples)
    fft_vals = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(num_samples)
    freqs[0] = 1e-5
    pink_fft = fft_vals / np.sqrt(freqs)
    pink = np.fft.irfft(pink_fft, n=num_samples)
    return pink / np.max(np.abs(pink))

def lowpass_filter(signal, cutoff_freq, sr=SR):
    """Smooth 2nd-order frequency domain lowpass filter."""
    fft_vals = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(len(signal), d=1.0/sr)
    gain = 1.0 / (1.0 + (freqs / cutoff_freq)**4)
    filtered = np.fft.irfft(fft_vals * gain, n=len(signal))
    return filtered

def bandpass_filter(signal, center_freq, bandwidth, sr=SR):
    """Bandpass filter for soft acoustic transients."""
    fft_vals = np.fft.rfft(signal)
    freqs = np.fft.rfftfreq(len(signal), d=1.0/sr)
    # Bandpass gaussian or rational filter
    q = center_freq / bandwidth
    gain = np.exp(-0.5 * ((freqs - center_freq) / (bandwidth / 2.0))**2)
    filtered = np.fft.irfft(fft_vals * gain, n=len(signal))
    return filtered

def sub_bass_drone(duration, freq=55.0, sr=SR):
    """
    Stereo meditative sub-bass drone with binaural detuning (+/- 0.25Hz)
    and breathing LFO amplitude modulation.
    """
    n_samples = int(duration * sr)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Left channel
    l_osc1 = np.sin(2 * np.pi * (freq - 0.25) * t)
    l_osc2 = 0.35 * np.sin(2 * np.pi * ((freq * 1.5) - 0.15) * t)
    l_osc3 = 0.18 * np.sin(2 * np.pi * (freq * 2.0) * t)
    left = l_osc1 + l_osc2 + l_osc3
    
    # Right channel
    r_osc1 = np.sin(2 * np.pi * (freq + 0.25) * t)
    r_osc2 = 0.35 * np.sin(2 * np.pi * ((freq * 1.5) + 0.15) * t)
    r_osc3 = 0.18 * np.sin(2 * np.pi * (freq * 2.0) * t)
    right = r_osc1 + r_osc2 + r_osc3
    
    # 8-second breathing LFO
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.125 * t)
    left *= lfo
    right *= lfo
    
    left = np.tanh(left * 0.75)
    right = np.tanh(right * 0.75)
    return np.vstack([left, right])

def subtle_clock_ticking(duration, bpm=60, sr=SR):
    """
    Acoustic mechanical watch escapement / pendulum clock ticking.
    Warm, muted wooden/metallic precision ticks (no harsh highs).
    """
    n_samples = int(duration * sr)
    left = np.zeros(n_samples)
    right = np.zeros(n_samples)
    
    beat_interval = 60.0 / bpm
    tick_len = int(0.022 * sr)
    
    # Generate individual 'Tick' (higher wood resonance) and 'Tock' (lower wood response)
    t_tick = np.linspace(0, 0.022, tick_len, endpoint=False)
    
    # Tick: 2200Hz centered bandpass with 3ms decay
    tick_pulse = np.sin(2 * np.pi * 2200 * t_tick) * np.exp(-180 * t_tick)
    tick_noise = np.random.randn(tick_len) * np.exp(-260 * t_tick)
    tick_sound = bandpass_filter(tick_pulse + 0.3 * tick_noise, 2100, 700, sr)
    tick_sound = tick_sound / np.max(np.abs(tick_sound)) * 0.35
    
    # Tock: 1550Hz centered bandpass with 4ms decay
    tock_pulse = np.sin(2 * np.pi * 1550 * t_tick) * np.exp(-150 * t_tick)
    tock_noise = np.random.randn(tick_len) * np.exp(-220 * t_tick)
    tock_sound = bandpass_filter(tock_pulse + 0.3 * tock_noise, 1500, 600, sr)
    tock_sound = tock_sound / np.max(np.abs(tock_sound)) * 0.32
    
    # Step through timeline placing alternating ticks and tocks every half beat
    current_t = 0.4
    tick_count = 0
    while current_t < duration - 0.2:
        idx = int(current_t * sr)
        is_tick = (tick_count % 2 == 0)
        sound = tick_sound if is_tick else tock_sound
        
        # Subtle spatial movement (tick slightly left, tock slightly right)
        pan = -0.15 if is_tick else 0.15
        l_gain = 0.5 * (1.0 - pan)
        r_gain = 0.5 * (1.0 + pan)
        
        if idx + tick_len < n_samples:
            left[idx:idx + tick_len] += sound * l_gain
            right[idx:idx + tick_len] += sound * r_gain
            
        current_t += (beat_interval / 2.0)
        tick_count += 1
        
    return np.vstack([left, right])

def deep_temple_gong(fundamental=98.0, duration=5.5, sr=SR):
    """
    Warm, resonant Japanese temple bell / rin gong with soft felt mallet strike
    and long, rich inharmonic metallic decay (zero sharp edges).
    """
    n_samples = int(duration * sr)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Authentic Japanese bronze bell inharmonic partial series
    # (Ratio, Amplitude, Decay Rate)
    partials = [
        (1.0, 1.00, 1.1),     # Fundamental deep hum (longest ring)
        (1.58, 0.55, 1.6),    # Minor third
        (2.04, 0.40, 2.2),    # Octave
        (2.76, 0.30, 2.8),    # Quint
        (3.42, 0.18, 3.8),    # High bronze ring
        (4.20, 0.08, 5.2),    # Highest overtone
    ]
    
    mono = np.zeros(n_samples)
    att_samples = int(0.015 * sr) # Soft 15ms attack (felt mallet, removes sharp transient!)
    
    for ratio, amp, decay_rate in partials:
        freq = fundamental * ratio
        # Add subtle 0.3Hz beat modulation for organic acoustic warmth
        chorus = 1.0 + 0.003 * np.sin(2 * np.pi * 0.3 * t)
        wave = np.sin(2 * np.pi * freq * chorus * t)
        
        env = np.exp(-decay_rate * t)
        env[:att_samples] = np.sin(np.linspace(0, np.pi/2, att_samples))
        mono += wave * env * amp
        
    mono = np.tanh(mono * 0.9)
    mono = mono / np.max(np.abs(mono))
    
    # Stereo width: reverberant spatial spread
    left = mono.copy()
    delay_s = int(0.018 * sr)
    right = np.zeros_like(mono)
    right[delay_s:] = mono[:-delay_s]
    right += mono * 0.75
    right = right / np.max(np.abs(right))
    
    return np.vstack([left, right])

def singing_bowl_chime(fundamental=293.7, duration=5.0, sr=SR):
    """
    Tibetan singing bowl / crystalline chime with ethereal shimmering partials.
    Provides pristine acoustic spatial depth.
    """
    n_samples = int(duration * sr)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # High metallic bell partials
    partials = [
        (1.0, 0.85, 1.3),
        (2.76, 0.45, 2.0),
        (5.40, 0.25, 3.2),
        (8.90, 0.12, 4.5),
    ]
    
    mono = np.zeros(n_samples)
    att_samples = int(0.020 * sr) # Soft 20ms swell
    
    for ratio, amp, decay_rate in partials:
        freq = fundamental * ratio
        # Gentle tremolo
        trem = 1.0 + 0.08 * np.sin(2 * np.pi * 2.5 * t)
        wave = np.sin(2 * np.pi * freq * t) * trem
        env = np.exp(-decay_rate * t)
        env[:att_samples] = np.sin(np.linspace(0, np.pi/2, att_samples))
        mono += wave * env * amp
        
    mono = mono / np.max(np.abs(mono)) * 0.75
    
    # Stereo delay
    left = mono.copy()
    delay_s = int(0.024 * sr)
    right = np.zeros_like(mono)
    right[delay_s:] = mono[:-delay_s]
    right += mono * 0.65
    
    return np.vstack([left, right])

def storm_texture(duration, sr=SR):
    """Subtle continuous rainstorm ambience with distant gentle rolling thunder."""
    n_samples = int(duration * sr)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    # Soft rainbed
    rain = create_pink_noise(n_samples)
    rain_l = lowpass_filter(rain, 380.0, sr)
    rain_r = lowpass_filter(create_pink_noise(n_samples), 380.0, sr)
    
    # Gentle wind breathing
    wind_lfo = 0.70 + 0.30 * np.sin(2 * np.pi * 0.07 * t)
    rain_l *= wind_lfo
    rain_r *= wind_lfo
    
    # Distant low thunder rumbles (soft sub-bass rumbles, not loud bangs)
    thunder = np.zeros(n_samples)
    thunder_times = [3.0, 15.0, 25.0]
    for tt in thunder_times:
        idx = int(tt * sr)
        t_len = int(5.0 * sr)
        if idx + t_len < n_samples:
            t_t = np.linspace(0, 5.0, t_len, endpoint=False)
            t_noise = lowpass_filter(np.random.randn(t_len), 65.0, sr)
            t_env = np.sin(np.pi * (t_t / 5.0))**2.0
            thunder[idx:idx + t_len] += t_noise * t_env * 1.1
            
    left = rain_l * 0.22 + thunder * 0.25
    right = rain_r * 0.22 + thunder * 0.25
    return np.vstack([left, right])

def industrial_ambient_bed(duration, sr=SR):
    """
    Subtle industrial mechanical hum with gentle turbine harmonics.
    """
    n_samples = int(duration * sr)
    t = np.linspace(0, duration, n_samples, endpoint=False)
    
    hum_l = 0.45 * np.sin(2 * np.pi * 50 * t) + 0.20 * np.sin(2 * np.pi * 100 * t)
    hum_r = 0.45 * np.sin(2 * np.pi * 50.25 * t) + 0.20 * np.sin(2 * np.pi * 100.5 * t)
    
    # Soft filtered air release at key transitions
    air = np.zeros(n_samples)
    air_times = [6.2, 14.2, 22.2]
    for at in air_times:
        idx = int(at * sr)
        a_len = int(1.4 * sr)
        if idx + a_len < n_samples:
            a_t = np.linspace(0, 1.4, a_len, endpoint=False)
            a_noise = lowpass_filter(np.random.randn(a_len), 1200.0, sr)
            a_env = np.exp(-3.0 * a_t)
            air[idx:idx + a_len] += a_noise * a_env * 0.18
            
    left = hum_l * 0.22 + air
    right = hum_r * 0.22 + air
    return np.vstack([left, right])

def mix_track(base, event, start_sec, volume=1.0, sr=SR):
    """Overlay an event stereo buffer onto the base buffer at start_sec."""
    start_idx = int(start_sec * sr)
    event_len = event.shape[1]
    total_len = base.shape[1]
    
    end_idx = min(total_len, start_idx + event_len)
    actual_len = end_idx - start_idx
    if actual_len > 0:
        base[:, start_idx:end_idx] += event[:, :actual_len] * volume

def master_audio(stereo_signal, target_peak_db=-1.2, fade_in_s=1.0, fade_out_s=2.4, sr=SR):
    """
    Mastering chain: analog warmth limiter and peak normalization.
    """
    n_samples = stereo_signal.shape[1]
    
    # Smooth Fade In
    fi_len = int(fade_in_s * sr)
    if fi_len > 0:
        fade_curve = np.sin(np.linspace(0, np.pi/2, fi_len))**2
        stereo_signal[:, :fi_len] *= fade_curve
        
    # Smooth Fade Out
    fo_len = int(fade_out_s * sr)
    if fo_len > 0:
        fade_curve = np.cos(np.linspace(0, np.pi/2, fo_len))**2
        stereo_signal[:, -fo_len:] *= fade_curve
        
    # Soft saturation curve
    stereo_signal = np.tanh(stereo_signal * 1.05)
    
    # Peak normalization
    max_peak = np.max(np.abs(stereo_signal))
    if max_peak > 0:
        target_amp = 10.0 ** (target_peak_db / 20.0)
        stereo_signal = (stereo_signal / max_peak) * target_amp
        
    return stereo_signal

def save_wav(stereo_signal, filename, sr=SR):
    """Write 16-bit PCM stereo WAV."""
    int16_data = (stereo_signal * 32767).clip(-32768, 32767).astype(np.int16)
    interleaved = np.empty((int16_data.shape[1] * 2,), dtype=np.int16)
    interleaved[0::2] = int16_data[0]
    interleaved[1::2] = int16_data[1]
    
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(interleaved.tobytes())
    print(f"Saved WAV: {filename} ({int16_data.shape[1] / sr:.2f}s)")

# ==============================================================================
# COMPOSING ISSUE 01 & ISSUE 02 SOUNDTRACKS (BELLS & CLOCKS ONLY)
# ==============================================================================

def generate_issue01_soundtrack(duration=35.00):
    """
    Issue 01 (Watering Grass in a Thunderstorm):
    - Base: Atmospheric storm rainbed + 55Hz sub-bass meditation drone
    - Rhythm: Subtle acoustic clock escapement (ticking through the countdown)
    - Accents: Deep resonant Japanese temple bells & Tibetan singing bowls (NO TAIKO)
    """
    print(f"\n[Sound Design] Composing Issue 01 (Bells & Clock Ticking, 35.00s)...")
    n_samples = int(duration * SR)
    master = np.zeros((2, n_samples))
    
    # Layer 1: Rainstorm & Wind Bed
    storm = storm_texture(duration)
    master += storm * 0.75
    
    # Layer 2: Deep Sub-Bass Drone (A1: 55Hz)
    drone = sub_bass_drone(duration, freq=55.0)
    master += drone * 0.40
    
    # Layer 3: Subtle Acoustic Clock Ticking (60 BPM)
    ticking = subtle_clock_ticking(duration, bpm=60)
    master += ticking * 0.38
    
    # Layer 4: Multi-Layered Temple Bells & Singing Bowls (Timed to visual cards)
    # Card 1: 0.1s (Cold Open Hook) -> Grand Opening Temple Bell (98Hz) + Singing Bowl Shimmer (293.7Hz)
    mix_track(master, deep_temple_gong(fundamental=98.0, duration=6.0), 0.1, volume=0.85)
    mix_track(master, singing_bowl_chime(fundamental=293.7, duration=5.0), 0.3, volume=0.70)
    
    # Card 2: 7.0s (The Balcony / Geriatric Disconnect) -> Resonant Rin Gong (110.0Hz)
    mix_track(master, deep_temple_gong(fundamental=110.0, duration=5.5), 7.0, volume=0.80)
    mix_track(master, singing_bowl_chime(fundamental=329.6, duration=4.5), 7.2, volume=0.65) # E4 chime
    
    # Card 3: 14.8s (The 4-Stage Protest Loop) -> Deeper G Gong (82.4Hz)
    mix_track(master, deep_temple_gong(fundamental=82.4, duration=6.0), 14.8, volume=0.85)
    mix_track(master, singing_bowl_chime(fundamental=246.9, duration=4.5), 15.0, volume=0.60) # B3 chime
    
    # Card 4: 22.8s (The Tipping Scales) -> Bronze Temple Chime (130.8Hz)
    mix_track(master, deep_temple_gong(fundamental=130.8, duration=5.0), 22.8, volume=0.80)
    mix_track(master, singing_bowl_chime(fundamental=392.0, duration=4.5), 23.0, volume=0.65) # G4 chime
    
    # Card 5: 29.2s (The Anchor Finale) -> Grand Low Bell (73.4Hz D2) + Harmonious Shimmer Chord
    mix_track(master, deep_temple_gong(fundamental=73.4, duration=6.5), 29.2, volume=0.90)
    mix_track(master, singing_bowl_chime(fundamental=440.0, duration=5.5), 29.4, volume=0.75) # A4 pure ring
    
    mastered = master_audio(master, target_peak_db=-1.2, fade_in_s=1.0, fade_out_s=2.4)
    out_wav = os.path.join(AUDIO_DIR, "issue-01-soundtrack.wav")
    save_wav(mastered, out_wav)
    return out_wav

def generate_issue02_soundtrack(duration=36.00):
    """
    Issue 02 (The Meat Grinder Needs More Meat):
    - Base: Industrial motor hum + 49Hz sub-bass tension drone
    - Rhythm: Relentless mechanical clockwork ratchet ticking (machine cogs)
    - Accents: Deep resonant gongs, black hole singing bowl chords, and serene biological resolution bells (NO TAIKO)
    """
    print(f"\n[Sound Design] Composing Issue 02 (Bells & Clock Ticking, 36.00s)...")
    n_samples = int(duration * SR)
    master = np.zeros((2, n_samples))
    
    # Layer 1: Heavy Industrial Turbine Bed
    gear = industrial_ambient_bed(duration)
    master += gear * 0.70
    
    # Layer 2: Sub-Bass Tension Drone (G1: 49Hz)
    drone = sub_bass_drone(duration, freq=49.0)
    master += drone * 0.42
    
    # Layer 3: Relentless Clockwork Ticking (60 BPM)
    ticking = subtle_clock_ticking(duration, bpm=60)
    master += ticking * 0.42
    
    # Layer 4: Resonant Bells & Singing Bowls at visual beats
    # Card 1: 0.1s (The Cold Open Machine) -> Low Industrial Bell (82.4Hz E2)
    mix_track(master, deep_temple_gong(fundamental=82.4, duration=6.0), 0.1, volume=0.88)
    mix_track(master, singing_bowl_chime(fundamental=261.6, duration=5.0), 0.3, volume=0.65)
    
    # Card 2: 6.2s (Venn Diagram Black Hole Void) -> Deep Dark Gong (73.4Hz) + Dual Bowl Void Chord
    mix_track(master, deep_temple_gong(fundamental=73.4, duration=6.5), 6.2, volume=0.90)
    mix_track(master, singing_bowl_chime(fundamental=220.0, duration=5.0), 6.4, volume=0.70)
    mix_track(master, singing_bowl_chime(fundamental=330.0, duration=4.5), 6.5, volume=0.55)
    
    # Card 3: 14.0s (The Four Grand Contradictions) -> Meditative Bronze Chime (110.0Hz)
    mix_track(master, deep_temple_gong(fundamental=110.0, duration=5.5), 14.0, volume=0.82)
    mix_track(master, singing_bowl_chime(fundamental=329.6, duration=4.5), 14.2, volume=0.65)
    
    # Card 4: 22.0s (The Three Taboo Counter-Proposals) -> Resonant Temple Bell (98.0Hz)
    mix_track(master, deep_temple_gong(fundamental=98.0, duration=5.5), 22.0, volume=0.85)
    mix_track(master, singing_bowl_chime(fundamental=293.7, duration=4.8), 22.2, volume=0.65)
    
    # Card 5: 29.8s (Quiet Earth / Biological Correction) -> Serene Multi-Bell Sanctuary Chord
    # C3 (130.8Hz) + G3 (196.0Hz) + C4 (261.6Hz) pure chime decay
    mix_track(master, deep_temple_gong(fundamental=130.8, duration=6.5), 29.8, volume=0.88)
    mix_track(master, singing_bowl_chime(fundamental=196.0, duration=6.0), 30.0, volume=0.75)
    mix_track(master, singing_bowl_chime(fundamental=261.6, duration=6.0), 30.2, volume=0.70)
    mix_track(master, singing_bowl_chime(fundamental=523.2, duration=5.0), 30.4, volume=0.50) # High serene harmonic
    
    mastered = master_audio(master, target_peak_db=-1.2, fade_in_s=1.0, fade_out_s=2.4)
    out_wav = os.path.join(AUDIO_DIR, "issue-02-soundtrack.wav")
    save_wav(mastered, out_wav)
    return out_wav

def generate_issue03_soundtrack(duration=36.00):
    """
    Issue 03 (The War No One Was Supposed to Win):
    - Base: Forensic surveillance hum + 52Hz sub-bass tension drone
    - Rhythm: Precision mechanical watch escapement ticking (60 BPM)
    - Accents: Deep resonant Japanese temple gongs & crystalline singing bowls timed to the 5 scenes:
      * 0.1s  (Scene 1: The $1 Trillion Hook)
      * 3.0s  (Scene 1 Part B: Class Contradiction Split)
      * 6.0s  (Scene 2: The Lancet 16-Criteria Harm Matrix)
      * 13.0s (Scene 3: 4 Rapid Forensic Evidence Slides)
      * 22.3s (Scene 4: Portugal Law 30/2000 Blueprint & Civic Renewal)
      * 29.3s (Scene 5: The Mirror Finale & Verdict)
    """
    print(f"\n[Sound Design] Composing Issue 03 (Bells & Clock Ticking, 36.00s)...")
    n_samples = int(duration * SR)
    master = np.zeros((2, n_samples))

    # Layer 1: Subtle Forensic Surveillance Room Bed
    room = industrial_ambient_bed(duration)
    master += room * 0.65

    # Layer 2: Deep Sub-Bass Tension Drone (52Hz)
    drone = sub_bass_drone(duration, freq=52.0)
    master += drone * 0.42

    # Layer 3: Precision Clock Escapement Ticking (60 BPM)
    ticking = subtle_clock_ticking(duration, bpm=60)
    master += ticking * 0.40

    # Layer 4: Resonant Temple Bells & Singing Bowls aligned with WarOnDrugsReel scenes
    # Scene 1A (0.1s): Opening Dossier Gong (87.3Hz F2) + Singing Bowl (261.6Hz C4)
    mix_track(master, deep_temple_gong(fundamental=87.3, duration=6.0), 0.1, volume=0.88)
    mix_track(master, singing_bowl_chime(fundamental=261.6, duration=5.0), 0.3, volume=0.68)

    # Scene 1B (3.0s): Class Contradiction Shift -> Minor Bowl Chime (311.1Hz Eb4)
    mix_track(master, singing_bowl_chime(fundamental=311.1, duration=4.2), 3.0, volume=0.58)

    # Scene 2 (6.0s): The Alcohol Paradox / Lancet Matrix -> Deep Bronze Gong (73.4Hz D2)
    mix_track(master, deep_temple_gong(fundamental=73.4, duration=6.2), 6.0, volume=0.90)
    mix_track(master, singing_bowl_chime(fundamental=293.7, duration=4.8), 6.2, volume=0.68)

    # Scene 3 (13.0s): 4 Forensic Evidence Slides -> Resonant Temple Bell (98.0Hz G2)
    mix_track(master, deep_temple_gong(fundamental=98.0, duration=5.8), 13.0, volume=0.85)
    mix_track(master, singing_bowl_chime(fundamental=349.2, duration=4.5), 13.2, volume=0.64)

    # Scene 4 (22.3s): Portugal Law 30/2000 & Sunlit Civic Renewal -> Warm Harmonic Gong (110.0Hz A2)
    mix_track(master, deep_temple_gong(fundamental=110.0, duration=5.8), 22.3, volume=0.85)
    mix_track(master, singing_bowl_chime(fundamental=329.6, duration=4.8), 22.5, volume=0.70)
    mix_track(master, singing_bowl_chime(fundamental=440.0, duration=4.5), 22.7, volume=0.55)

    # Scene 5 (29.3s): The Mirror Finale -> Deep Resolution Chord (65.4Hz C2 + 196Hz G3 + 392Hz G4)
    mix_track(master, deep_temple_gong(fundamental=65.4, duration=6.5), 29.3, volume=0.92)
    mix_track(master, singing_bowl_chime(fundamental=196.0, duration=6.0), 29.5, volume=0.75)
    mix_track(master, singing_bowl_chime(fundamental=392.0, duration=5.5), 29.7, volume=0.68)

    mastered = master_audio(master, target_peak_db=-1.2, fade_in_s=1.0, fade_out_s=2.4)
    out_wav = os.path.join(AUDIO_DIR, "issue-03-soundtrack.wav")
    save_wav(mastered, out_wav)
    return out_wav

def mux_audio_into_video(video_path, audio_path):
    """
    Muxes the generated audio stream into the target video using Remotion's bundled ffmpeg.
    Replaces silent/old audio with stereo AAC 192kbps.
    """
    if not os.path.exists(video_path):
        print(f"⚠️ Video file not found: {video_path}")
        return False
        
    temp_out = video_path + ".temp.mp4"
    cmd = [
        "npx", "remotion", "ffmpeg",
        "-y",
        "-i", video_path,
        "-i", audio_path,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        temp_out
    ]
    
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0 and os.path.exists(temp_out):
        os.replace(temp_out, video_path)
        print(f"✅ Muxed audio into: {video_path}")
        return True
    else:
        print(f"❌ Failed to mux audio: {res.stderr[:200]}")
        if os.path.exists(temp_out):
            os.remove(temp_out)
        return False

def main():
    print("==================================================================")
    print("PROCEDURAL CYBER-ZEN AUDIO ENGINE (BELLS & CLOCK TICKS)")
    print("==================================================================")
    
    # 1. Synthesize Issue 01 Soundtrack (35.00s)
    wav_01 = generate_issue01_soundtrack(duration=35.00)
    
    # 2. Synthesize Issue 02 Soundtrack (36.00s)
    wav_02 = generate_issue02_soundtrack(duration=36.00)
    
    # 3. Mux into Issue 01 Video Packages (YouTube Shorts + X Reel)
    print("\n--- Muxing Audio into Issue 01 Packages ---")
    mux_audio_into_video("dist-packages/issue-01-watering-grass/youtube/video/watering-grass-in-a-thunderstorm-shorts-1080x1920.mp4", wav_01)
    mux_audio_into_video("dist-packages/issue-01-watering-grass/x/video/watering-grass-in-a-thunderstorm-reel-1080x1920.mp4", wav_01)
    
    # 4. Mux into Issue 02 Video Packages (YouTube Shorts + X Reel)
    print("\n--- Muxing Audio into Issue 02 Packages ---")
    mux_audio_into_video("dist-packages/issue-02-the-meat-grinder/youtube/video/the-meat-grinder-needs-more-meat-shorts-1080x1920.mp4", wav_02)
    mux_audio_into_video("dist-packages/issue-02-the-meat-grinder/x/video/the-meat-grinder-needs-more-meat-reel-1080x1920.mp4", wav_02)

    # 5. Synthesize Issue 03 Soundtrack (36.00s) & Mux into Issue 03 Reel Packages
    wav_03 = generate_issue03_soundtrack(duration=36.00)
    print("\n--- Muxing Audio into Issue 03 Packages ---")
    import shutil
    os.makedirs("dist-packages/issue-03-war-on-drugs/x/video", exist_ok=True)
    os.makedirs("dist-packages/issue-03-war-on-drugs/youtube/video", exist_ok=True)
    if os.path.exists("out/war-on-drugs-reel.mp4"):
        mux_audio_into_video("out/war-on-drugs-reel.mp4", wav_03)
        shutil.copy2("out/war-on-drugs-reel.mp4", "dist-packages/issue-03-war-on-drugs/x/video/the-war-no-one-was-supposed-to-win-reel-1080x1920.mp4")
        shutil.copy2("out/war-on-drugs-reel.mp4", "dist-packages/issue-03-war-on-drugs/youtube/video/the-war-no-one-was-supposed-to-win-shorts-1080x1920.mp4")
        print("✅ Copied muxed Issue 03 Reel to dist-packages/issue-03-war-on-drugs/x/video/ and youtube/video/")

    print("\nAll videos upgraded with bells and subtle clock ticking!")

if __name__ == "__main__":
    main()

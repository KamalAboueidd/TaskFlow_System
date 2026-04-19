import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaPlay, FaPause, FaRedoAlt, FaVolumeUp } from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";
import { useToast } from "../components/Ui/ToastProvider";

function Pomodoro() {
  usePageTitle("Pomodoro");

  const { showToast } = useToast();
  const [taskName, setTaskName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning]);

  const alertAudioRef = useRef(null);

  useEffect(() => {
    alertAudioRef.current = new Audio("/sounds/pomodoro-alert.mp3");
    alertAudioRef.current.volume = 0.75;
  }, []);

  const fallbackBeep = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, context.currentTime);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);

      setTimeout(() => {
        context.close();
      }, 700);
    } catch (error) {
      console.warn("Unable to play fallback sound", error);
    }
  }, []);

  const playAlert = useCallback(() => {
    const audio = alertAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        fallbackBeep();
      });
    } else {
      fallbackBeep();
    }
  }, [fallbackBeep]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setSessionCount((count) => count + 1);
          playAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, playAlert]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timerLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleStart = () => {
    if (!taskName.trim()) {
      showToast("Please write a task name to start", "error");
      return;
    }

    setIsRunning(true);
    showToast("Started a Pomodoro session", "success");
  };

  const handlePause = () => {
    setIsRunning(false);
    showToast("Paused the timer", "info");
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(selectedDuration * 60);
    showToast("Reset the timer", "info");
  };

  const applyCustomDuration = () => {
    const minutesValue = Number(customMinutes);

    if (!minutesValue || minutesValue < 1 || minutesValue > 180) {
      showToast("Please enter a valid duration between 1 and 180 minutes", "error");
      return;
    }

    setSelectedDuration(minutesValue);
    setCustomMinutes("");
    setIsRunning(false);
    setRemainingSeconds(minutesValue * 60);
    showToast("New duration set", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950 p-4 md:p-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-white text-sm font-semibold">
                <FaClock /> Study with Pomodoro
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white">Pomodoro</h1>
              <p className="mt-2 max-w-2xl text-gray-300">
                Write the task name, set the duration, and start a focus session. The sound will play when the time is up.
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-6">
          <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Session Details</h2>
                <p className="text-gray-400">Task name and duration for your Pomodoro session.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-gray-300">Task name</label>
                <input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Enter the task you want to study"
                  className="w-full rounded-3xl border border-white/20 bg-slate-950/70 p-4 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">Choose duration</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[25, 15, 45, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSelectedDuration(value)}
                      className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                        selectedDuration === value
                          ? "border-transparent bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                          : "border-white/10 bg-white/5 text-gray-200 hover:border-white/20"
                      }`}
                    >
                      {value} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Custom duration (minutes)"
                  className="w-full rounded-3xl border border-white/20 bg-slate-950/70 p-4 text-white outline-none focus:border-cyan-400"
                />
                <button
                  onClick={applyCustomDuration}
                  className="rounded-3xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                >
                  Set
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Countdown</p>
                    <h3 className="text-5xl font-bold text-white">{timerLabel}</h3>
                    <p className="mt-2 text-sm text-gray-300">Selected duration: {selectedDuration} min</p>
                  </div>
                  <div className="rounded-full bg-white/10 p-4 text-cyan-300">
                    <FaClock className="text-3xl" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={handleStart}
                      disabled={isRunning}
                      className="flex-1 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 text-white font-semibold hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaPlay className="inline mr-2" />
                      Start
                    </button>
                    <button
                      onClick={handlePause}
                      disabled={!isRunning}
                      className="flex-1 rounded-3xl bg-white/10 px-5 py-3 text-white font-semibold hover:bg-white/20 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaPause className="inline mr-2" />
                      Pause
                    </button>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleReset}
                      className="rounded-3xl bg-white/10 px-8 py-3 text-white font-semibold hover:bg-white/20 transition"
                    >
                      <FaRedoAlt className="inline mr-2" />
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white/5 p-4 text-sm text-gray-300">
                  <p>Completed Pomodoro sessions: <span className="font-semibold text-white">{sessionCount}</span></p>
                  <p className="mt-2">A system sound will play when the timer ends.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Pomodoro;

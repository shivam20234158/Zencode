import { create } from "zustand";
import axiosClient from "../utils/axiosClient";

export const useBattleStore = create((set, get) => ({
    battle: null,
    opponentProgress: null,
    submissionStatus: null,
    isSubmitting: false,
    timeLeft: 0,
    error: null,

    setBattle: (battle) => set({ battle, error: null }),
    setOpponentProgress: (progress) => set({ opponentProgress: progress }),
    setSubmissionStatus: (status) => set({ submissionStatus: status }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setTimeLeft: (timeLeft) => set({ timeLeft }),
    setError: (error) => set({ error }),

    resetBattle: () =>
        set({
            battle: null,
            opponentProgress: null,
            submissionStatus: null,
            isSubmitting: false,
            timeLeft: 0,
            error: null,
        }),

    fetchBattle: async (idOrCode) => {
        try {
            const { data } = await axiosClient.get(`/battles/${idOrCode}`);
            set({ battle: data, error: null });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            set({ error: msg });
            throw new Error(msg);
        }
    },

    createBattle: async (difficulty) => {
        try {
            const { data } = await axiosClient.post("/battles/create", { difficulty });
            set({ battle: data, error: null });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            set({ error: msg });
            throw new Error(msg);
        }
    },

    joinBattle: async (roomCode) => {
        try {
            const { data } = await axiosClient.post("/battles/join", { roomCode });
            set({ battle: data, error: null });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            set({ error: msg });
            throw new Error(msg);
        }
    },

    submitSolution: async (battleId, code, language) => {
        set({ isSubmitting: true, error: null });
        try {
            const { data } = await axiosClient.post(`/battles/${battleId}/submit`, {
                code,
                language,
            });
            set({ submissionStatus: { submissionId: data.submissionId, status: "queued" } });
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            set({ error: msg, isSubmitting: false });
            throw new Error(msg);
        }
    },
}));

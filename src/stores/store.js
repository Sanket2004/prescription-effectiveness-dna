import { create } from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  subjects: [],
  subjectData: {},
  lowAdherenceSummary: [],
  belowThresholdSubjects: [],
  loading: false,
  error: null,

  // Fetch subjects and set them in the store
  fetchSubjects: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:5000/api/subjects");
      set({ subjects: response.data || [], loading: false });
    } catch (error) {
      console.error("Fetch subjects error:", error);
      set({ error: "Failed to fetch subjects", loading: false });
    }
  },

  // Fetch subject data and set it in the store
  fetchSubjectData: async (subject_id) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `http://localhost:5000/api/subject/${subject_id}`
      );
      set({ subjectData: response.data || {}, loading: false });
    } catch (error) {
      console.error("Fetch subject data error:", error);
      set({ error: "Failed to fetch subject data", loading: false });
    }
  },

  // Fetch low adherence summary and set it in the store
  fetchLowAdherenceSummary: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        "http://localhost:5000/api/low-adherence-summary"
      );
      set({ lowAdherenceSummary: response.data || [], loading: false });
    } catch (error) {
      console.error("Fetch summary error:", error);
      set({ error: "Failed to fetch low adherence summary", loading: false });
    }
  },

  fetchSubjectsBelowThreshold: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        "http://localhost:5000/api/below-threshold"
      );
      set({ belowThresholdSubjects: response.data || [], loading: false });
    } catch (error) {
      console.error("Fetch summary error:", error);
      set({
        error: "Failed to fetch below-threshold subjects",
        loading: false,
      });
    }
  },
}));

export default useStore;

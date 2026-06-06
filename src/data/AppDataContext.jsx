import { createContext, useContext, useState } from "react";

const AppDataContext = createContext(null);

const SEED_REQUESTS = [
  { id: 1, hospital: "Aga Khan Hospital", bloodGroup: "O+", units: 4, urgency: "critical", fulfilled: 2, status: "pending", time: "09:14" },
  { id: 2, hospital: "Liaquat National", bloodGroup: "A-", units: 2, urgency: "high", fulfilled: 2, status: "fulfilled", time: "08:50" },
  { id: 3, hospital: "Civil Hospital", bloodGroup: "B+", units: 6, urgency: "medium", fulfilled: 1, status: "pending", time: "10:02" },
  { id: 4, hospital: "South City Hospital", bloodGroup: "AB+", units: 3, urgency: "high", fulfilled: 3, status: "fulfilled", time: "07:30" },
];

const SEED_DONORS = [
  { id: 1, name: "Hamza Sheikh", bloodGroup: "O+", area: "Gulshan-e-Iqbal", lastDonation: "2024-10-12", available: true },
  { id: 2, name: "Sara Naqvi", bloodGroup: "A-", area: "Defence", lastDonation: "2025-01-05", available: true },
  { id: 3, name: "Bilal Ahmed", bloodGroup: "B+", area: "Clifton", lastDonation: "2024-08-20", available: false },
  { id: 4, name: "Nadia Khan", bloodGroup: "O-", area: "Nazimabad", lastDonation: "2025-03-01", available: true },
];

export function AppDataProvider({ children }) {
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [donors, setDonors] = useState(SEED_DONORS);

  const addRequest = (req) => {
    setRequests(prev => [{ ...req, id: Date.now(), fulfilled: 0, status: "pending", time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) }, ...prev]);
  };

  const addDonor = (donor) => {
    setDonors(prev => [...prev, { ...donor, id: Date.now(), available: true }]);
  };

  const confirmDonor = (donorId) => {
    setDonors(prev => prev.map(d => d.id === donorId ? { ...d, available: false } : d));
  };

  return (
    <AppDataContext.Provider value={{ requests, donors, addRequest, addDonor, confirmDonor }}>
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);

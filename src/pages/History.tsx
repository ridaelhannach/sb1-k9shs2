import React, { useState, useEffect } from 'react';

interface RandomizedPerson {
  id: string;
  name: string;
  doorNumber: number;
}

interface HistoryEntry {
  date: string;
  results: RandomizedPerson[];
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('randomizationHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('randomizationHistory');
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Randomization History</h1>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <>
          {history.map((entry, index) => (
            <div key={index} className="mb-8 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">
                {new Date(entry.date).toLocaleString()}
              </h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Door Number</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.results.map(person => (
                    <tr key={person.id}>
                      <td>{person.name}</td>
                      <td>{person.doorNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear History
          </button>
        </>
      )}
    </div>
  );
};

export default History;
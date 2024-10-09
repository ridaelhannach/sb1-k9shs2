import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Person {
  id: string;
  name: string;
}

interface RandomizedPerson extends Person {
  doorNumber: number;
}

const Home: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [randomizedResults, setRandomizedResults] = useState<RandomizedPerson[]>([]);
  const [minDoorNumber, setMinDoorNumber] = useState(1);
  const [maxDoorNumber, setMaxDoorNumber] = useState(100);

  useEffect(() => {
    const storedPeople = localStorage.getItem('people');
    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = { id: Date.now().toString(), name: newPersonName.trim() };
      setPeople([...people, newPerson]);
      setNewPersonName('');
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
    setSelectedPeople(selectedPeople.filter(personId => personId !== id));
  };

  const togglePersonSelection = (id: string) => {
    setSelectedPeople(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(personId => personId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPeople.length === people.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(people.map(person => person.id));
    }
  };

  const randomize = () => {
    const availableDoorNumbers = Array.from(
      { length: maxDoorNumber - minDoorNumber + 1 },
      (_, i) => i + minDoorNumber
    );
    const shuffledDoorNumbers = availableDoorNumbers.sort(() => Math.random() - 0.5);

    const results = selectedPeople.map((personId, index) => {
      const person = people.find(p => p.id === personId)!;
      return {
        ...person,
        doorNumber: shuffledDoorNumbers[index]
      };
    });

    setRandomizedResults(results);
    saveToHistory(results);
  };

  const saveToHistory = (results: RandomizedPerson[]) => {
    const currentUser = localStorage.getItem('currentUser') || 'anonymous';
    const historyEntry = {
      username: currentUser,
      date: new Date().toISOString(),
      results
    };
    
    // Save to user-specific history
    const userHistory = JSON.parse(localStorage.getItem('randomizationHistory') || '[]');
    userHistory.push(historyEntry);
    localStorage.setItem('randomizationHistory', JSON.stringify(userHistory));
    
    // Save to all-users history
    const allHistory = JSON.parse(localStorage.getItem('allRandomizationHistory') || '[]');
    allHistory.push(historyEntry);
    localStorage.setItem('allRandomizationHistory', JSON.stringify(allHistory));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const companyInfo = JSON.parse(localStorage.getItem('companyInfo') || '{}');

    // Add company logo
    if (companyInfo.logo) {
      doc.addImage(companyInfo.logo, 'JPEG', 10, 10, 40, 40);
    }

    // Add company name and header
    doc.setFontSize(18);
    doc.text(companyInfo.name || 'Randomizer Results', 60, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 60, 30);
    doc.text(`Generated by: ${companyInfo.username || 'User'}`, 60, 40);

    // Add table with results
    doc.autoTable({
      head: [['Name', 'Door Number']],
      body: randomizedResults.map(person => [person.name, person.doorNumber]),
      startY: 60
    });

    // Save the PDF
    doc.save('randomizer_results.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Randomizer</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Person</h2>
        <div className="flex">
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder="Enter name"
          />
          <button onClick={addPerson} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">People List</h2>
        <div className="mb-2">
          <button
            onClick={toggleSelectAll}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            {selectedPeople.length === people.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <ul>
          {people.map(person => (
            <li key={person.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedPeople.includes(person.id)}
                onChange={() => togglePersonSelection(person.id)}
                className="mr-2"
              />
              <span>{person.name}</span>
              <button
                onClick={() => removePerson(person.id)}
                className="ml-auto text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Randomization Settings</h2>
        <div className="flex items-center mb-2">
          <label className="mr-2">Min Door Number:</label>
          <input
            type="number"
            value={minDoorNumber}
            onChange={(e) => setMinDoorNumber(parseInt(e.target.value))}
            className="p-2 border rounded w-20"
          />
        </div>
        <div className="flex items-center">
          <label className="mr-2">Max Door Number:</label>
          <input
            type="number"
            value={maxDoorNumber}
            onChange={(e) => setMaxDoorNumber(parseInt(e.target.value))}
            className="p-2 border rounded w-20"
          />
        </div>
      </div>

      <button
        onClick={randomize}
        disabled={selectedPeople.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        Randomize
      </button>

      {randomizedResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Door Number</th>
              </tr>
            </thead>
            <tbody>
              {randomizedResults.map(person => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.doorNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF} className="bg-purple-500 text-white px-4 py-2 rounded">
            Save as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
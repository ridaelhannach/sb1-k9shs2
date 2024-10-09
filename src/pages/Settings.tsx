import React, { useState, useEffect } from 'react';

interface CompanyInfo {
  name: string;
  logo: string;
  username: string;
}

const Settings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    logo: '',
    username: '',
  });

  useEffect(() => {
    const storedInfo = localStorage.getItem('companyInfo');
    if (storedInfo) {
      setCompanyInfo(JSON.parse(storedInfo));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo(prevInfo => ({ ...prevInfo, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={companyInfo.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={companyInfo.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="logo" className="block mb-1">Company Logo</label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {companyInfo.logo && (
          <div>
            <p className="mb-1">Preview:</p>
            <img src={companyInfo.logo} alt="Company Logo" className="max-w-xs" />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
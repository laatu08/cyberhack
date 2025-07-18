import React, { useState } from "react";
import { User, Database, LogOut, CheckCircle, XCircle } from "lucide-react";
import { authAPI } from "../api";
import LoadingSpinner from "./LoadingSpinner";

interface DashboardProps {
  email: string;
  onLogout: () => void;
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

const Dashboard: React.FC<DashboardProps> = ({ email, onLogout, onToast }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<Record<string, string> | null>(
    null
  );

  console.log("📊 Dashboard component rendered with email:", email);
  const availableFields = [
    {
      id: "accountNo",
      label: "Account Number",
      description: "Your bank account number",
    },
    {
      id: "balance",
      label: "Account Balance",
      description: "Current account balance",
    },
    {
      id: "transactions",
      label: "Recent Transactions",
      description: "Latest transaction history",
    },
    {
      id: "creditScore",
      label: "Credit Score",
      description: "Your current credit score",
    },
    {
      id: "loanDetails",
      label: "Loan Information",
      description: "Active loan details",
    },
    {
      id: "investmentPortfolio",
      label: "Investments",
      description: "Your investment portfolio",
    },
  ];

  console.log("📊 Available fields:", availableFields);
  const handleFieldToggle = (fieldId: string) => {
    console.log("📊 Field toggle clicked for:", fieldId);
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  // Log selected fields changes
  React.useEffect(() => {
    console.log("📊 Selected fields updated:", selectedFields);
  }, [selectedFields]);
  const handleGetData = async () => {
    console.log(
      "📊 Get data button clicked with selected fields:",
      selectedFields
    );

    if (selectedFields.length === 0) {
      console.log("📊 No fields selected, showing error toast");
      onToast("Please select at least one field", "error");
      return;
    }

    console.log("📊 Starting data fetch process");
    setFetchedData(null);
    setIsLoading(true);
    try {
      console.log("📊 Calling getData API...");
      const response = await authAPI.getData({ email, fields: selectedFields });
      console.log("📊 GetData API call successful, response:", response);
      const data = response.data;

      if (!data || Object.keys(data).length === 0) {
        console.log("📊 Response is empty");
        setFetchedData({}); // So UI knows it's not loading anymore, but empty
        onToast("No fields were allowed by user consent.", "info");
      } else {
        setFetchedData(data);
        console.log("📊 Fetched data set to state:", data);
        onToast("Data fetched successfully!", "success");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        // User denied all requested fields by consent
        setFetchedData({}); // force empty display
        onToast("No fields were allowed by user consent.", "info");
      } else {
        onToast("Failed to fetch data. Please try again.", "error");
      }
    } finally {
      console.log("📊 Data fetch process completed, setting loading to false");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log("📊 Logout button clicked");
    onLogout();
  };
  const renderDataResult = (fieldId: string) => {
    console.log("📊 Rendering data result for field:", fieldId);
    const field = availableFields.find((f) => f.id === fieldId);
    if (!field) {
      console.log("📊 Field not found in available fields:", fieldId);
      return null;
    }

    const hasData = fetchedData && fetchedData[fieldId];
    console.log("📊 Field has data:", {
      fieldId,
      hasData,
      data: fetchedData?.[fieldId],
    });

    return (
      <div key={fieldId} className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          {hasData ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <h4 className="font-semibold text-gray-800">{field.label}</h4>
        </div>
        {hasData ? (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Data:</span> {fetchedData![fieldId]}
          </p>
        ) : (
          <p className="text-sm text-red-600">Not included in consent policy</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome to Z-Pay
                </h1>
                <p className="text-gray-600">
                  Logged in as:{" "}
                  <span className="font-semibold text-blue-600">{email}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Data Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Select Data Fields
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableFields.map((field) => (
              <label
                key={field.id}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => handleFieldToggle(field.id)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{field.label}</h3>
                  <p className="text-sm text-gray-600">{field.description}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleGetData}
            disabled={isLoading || selectedFields.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                Get Respective Data
                <Database className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Data Results */}
        {fetchedData && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Data Results
            </h3>
            <div className="space-y-3">
              {selectedFields.map((fieldId) => renderDataResult(fieldId))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

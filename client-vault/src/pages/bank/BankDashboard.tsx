import React, { useState, useEffect } from "react";
import { Users, AlertTriangle, Bell, Eye, Check, X, RefreshCw } from "lucide-react";
import { Layout } from "../../components/Layout";
import { consentApi } from "../../api/consent";
import { alertsApi } from "../../api/alerts";
import { toast } from "../../utils/toast";
import type { User, Consent, RevokeRequest, Alert } from "../../types";

export const BankDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"consents" | "revokes" | "alerts">(
    "consents"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userConsents, setUserConsents] = useState<Consent[]>([]);
  const [revokeRequests, setRevokeRequests] = useState<RevokeRequest[]>([]);
  const [alertUsers, setAlertUsers] = useState<User[]>([]);
  const [selectedAlertUser, setSelectedAlertUser] = useState<User | null>(null);
  const [userAlerts, setUserAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userViewTab, setUserViewTab] = useState<
    "consents" | "revokes" | "alerts"
  >("consents");

  useEffect(() => {
    if (activeTab === "consents") {
      fetchUsers();
    } else if (activeTab === "revokes") {
      fetchRevokeRequests();
    } else if (activeTab === "alerts") {
      fetchAlertUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedUser) return;

    if (userViewTab === "revokes") fetchRevokeRequests();
    // else if (userViewTab === "alerts") fetchUserAlerts(selectedUser.id);
    else if (userViewTab === "consents") fetchUserConsents(selectedUser.id);
  }, [userViewTab, selectedUser]);

  const fetchUsers = async () => {
    console.log("🔄 BankDashboard - Fetching all users");
    try {
      setLoading(true);
      const response = await consentApi.getAllUsers();
      console.log(
        "✅ BankDashboard - Users fetched successfully:",
        response.users.length,
        "users"
      );
      setUsers(response.users);
    } catch (error) {
      console.error("❌ BankDashboard - Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserConsents = async (userId: string) => {
    console.log("🔄 BankDashboard - Fetching consents for user:", userId);
    try {
      setLoading(true);
      const response = await consentApi.getUserConsentsById(userId);
      console.log(
        "✅ BankDashboard - User consents fetched successfully:",
        response.consents.length,
        "consents"
      );
      setUserConsents(response.consents);
    } catch (error) {
      console.error("❌ BankDashboard - Failed to fetch user consents:", error);
      toast.error("Failed to fetch user consents");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevokeRequests = async () => {
    console.log("🔄 BankDashboard - Fetching revoke requests");
    try {
      setLoading(true);
      const requests = await consentApi.getRevokeRequests();
      console.log(
        "✅ BankDashboard - Revoke requests fetched successfully:",
        requests.length,
        "requests"
      );
      setRevokeRequests(requests);
    } catch (error) {
      console.error(
        "❌ BankDashboard - Failed to fetch revoke requests:",
        error
      );
      toast.error("Failed to fetch revoke requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertUsers = async () => {
    console.log("🔄 BankDashboard - Fetching users for alerts");
    try {
      setLoading(true);
      const response = await alertsApi.getAllUsersForAlerts();
      console.log(
        "✅ BankDashboard - Alert users fetched successfully:",
        response.userIds.length,
        "users"
      );
      setAlertUsers(response.userIds);
    } catch (error) {
      console.error(
        "❌ BankDashboard - Failed to fetch users for alerts:",
        error
      );
      toast.error("Failed to fetch users for alerts");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAlerts = async (userId: string) => {
    console.log("🔄 BankDashboard - Fetching alerts for user:", userId);
    try {
      setLoading(true);
      const alerts = await alertsApi.getUserAlertsById(userId);
      console.log(
        "✅ BankDashboard - User alerts fetched successfully:",
        alerts.length,
        "alerts"
      );
      setUserAlerts(alerts);
    } catch (error) {
      console.error("❌ BankDashboard - Failed to fetch user alerts:", error);
      toast.error("Failed to fetch user alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAlerts = async () => {
    console.log("🔄 BankDashboard - Refreshing alerts data");
    try {
      setRefreshing(true);
      
      if (selectedAlertUser) {
        // If viewing specific user alerts, refresh that user's alerts
        await fetchUserAlerts(selectedAlertUser.id);
      } else {
        // If viewing all alert users, refresh the users list
        await fetchAlertUsers();
      }
      
      toast.success("Alerts refreshed successfully");
    } catch (error) {
      console.error("❌ BankDashboard - Failed to refresh alerts:", error);
      toast.error("Failed to refresh alerts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleProcessRevoke = async (
    revokeRequestId: string,
    status: "approved" | "rejected"
  ) => {
    console.log("🔄 BankDashboard - Processing revoke request:", {
      revokeRequestId,
      status,
    });
    try {
      await consentApi.processRevokeRequest({ revokeRequestId, status });
      console.log("✅ BankDashboard - Revoke request processed successfully");
      toast.success(`Revoke request ${status}`);
      fetchRevokeRequests(); // Refresh the list
    } catch (error) {
      console.error(
        "❌ BankDashboard - Failed to process revoke request:",
        error
      );
      toast.error(`Failed to ${status} revoke request`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderConsentsTab = () => (
    <div className="space-y-4">
      {!selectedUser ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Users
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">ID: {user.id}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      fetchUserConsents(user.id);
                    }}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Consents</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setUserConsents([]);
                setUserViewTab("consents");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Users
            </button>
          </div>

          {/* Nested tabs */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setUserViewTab("consents")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  userViewTab === "consents"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Consents
              </button>
              <button
                onClick={() => setUserViewTab("revokes")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  userViewTab === "revokes"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Revoke Requests
              </button>
              {/* <button
                onClick={() => setUserViewTab("alerts")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  userViewTab === "alerts"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Alerts
              </button> */}
            </nav>
          </div>

          {/* Nested content */}
          {userViewTab === "consents" &&
            (loading ? (
              <div className="flex justify-center h-32 items-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {userConsents.map((consent) => (
                  <div
                    key={consent.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {consent.appId}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consent.revoked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {consent.revoked ? "Revoked" : "Active"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {consent.purpose}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Data Fields:</strong>{" "}
                        {consent.dataFields.join(", ")}
                      </p>
                      <p>
                        <strong>Expires:</strong>{" "}
                        {formatDate(consent.expiresAt)}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {formatDate(consent.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {userViewTab === "revokes" && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center h-32 items-center">
                  <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
                </div>
              ) : (
                revokeRequests
                  .filter((req) => req.userId === selectedUser.id)
                  .map((request) => (
                    <div
                      key={request.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Consent ID: {request.consentId}
                          </h4>
                          <p className="text-sm text-gray-600">
                            App: {request.consent.appId.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Requested: {formatDateTime(request.createdAt)}
                          </p>
                          </div>
                            {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleProcessRevoke(request.id, "approved")
                      }
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() =>
                        handleProcessRevoke(request.id, "rejected")
                      }
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* {userViewTab === "alerts" && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center h-32 items-center">
                  <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
                </div>
              ) : (
                userAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Field: {alert.field}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Access Count: {alert.count}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(alert.timestamp)}
                        </p>
                      </div>
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Bell className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )} */}
        </>
      )}
    </div>
  );

  const renderRevokesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Revoke Requests</h3>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : revokeRequests.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No revoke requests
          </h3>
          <p className="text-gray-600">There are no pending revoke requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {revokeRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Consent ID: {request.consentId}
                  </h4>
                  <p className="text-sm text-gray-600">
                    User ID: {request.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    User Email: {request.user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    App: {request.consent.appId.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Requested: {formatDateTime(request.createdAt)}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleProcessRevoke(request.id, "approved")
                      }
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() =>
                        handleProcessRevoke(request.id, "rejected")
                      }
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-4">
      {!selectedAlertUser ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Users with Alerts
            </h3>
            <button
              onClick={handleRefreshAlerts}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : alertUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Everything is fine, no anomaly for any user
              </h3>
              <p className="text-gray-600">All users are operating within normal parameters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {alertUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    {/* <p className="text-sm text-gray-600">{user.email}</p> */}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAlertUser(user);
                      fetchUserAlerts(user.id);
                    }}
                    className="flex items-center space-x-2 px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    <Bell className="h-4 w-4" />
                    <span>View Alerts</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Alerts for {selectedAlertUser.name}
              </h3>
              <p className="text-sm text-gray-600">{selectedAlertUser.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleRefreshAlerts}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAlertUser(null);
                  setUserAlerts([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Users
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {userAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Field: {alert.field}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Access Count: {alert.count}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(alert.timestamp)}
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Bell className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bank Dashboard
              </h1>
              <p className="text-gray-600">
                Manage user consents, revoke requests, and alerts
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("consents")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "consents"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>All User Consents</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("revokes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "revokes"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>All Revoke Requests</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "alerts"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>All User Alerts</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "consents" && renderConsentsTab()}
            {activeTab === "revokes" && renderRevokesTab()}
            {activeTab === "alerts" && renderAlertsTab()}
          </div>
        </div>
      </div>
    </Layout>
  );
};
import React from 'react';
import { FileText, Eye } from 'lucide-react';
import './RequestsTable.css';

const RequestsTable = ({ recentRequests, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewClick = (request) => {
    if (onViewDetails) {
      onViewDetails(request);
    }
  };

  return (
    <div className="requests-table-container">
      <div className="requests-table-header">
        <h2 className="requests-table-title">
          <FileText size={20} />
          Demandes récentes
        </h2>
        <button className="requests-table-view-all">
          Voir tout
        </button>
      </div>

      <div className="requests-table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Demandeur</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((request) => (
              <tr key={request.id}>
                <td className="request-id">{request.id}</td>
                <td>
                  <div>
                    <div className="request-user-name">{request.name}</div>
                    <div className="request-user-email">{request.email}</div>
                  </div>
                </td>
                <td>
                  <span
                    className="request-status"
                    style={{
                      background: `${getStatusColor(request.status)}15`,
                      color: getStatusColor(request.status)
                    }}
                  >
                    {getStatusText(request.status)}
                  </span>
                </td>
                <td className="request-date">{formatDate(request.submittedAt)}</td>
                <td className="request-documents">{request.documents} docs</td>
                <td className="request-actions">
                  <button
                    className="request-view-btn"
                    aria-label={`Voir les détails de ${request.name}`}
                    onClick={() => handleViewClick(request)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;
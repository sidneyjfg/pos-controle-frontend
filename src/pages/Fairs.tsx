import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input } from '../components/common';
import { useFairs } from '../hooks';
import type { CreateFairDTO, Fair } from '../types';

export const Fairs: React.FC = () => {
  const { fairs, loading, error, refetch, createFair, syncFair } = useFairs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateFairDTO>({
    Name: '',
    Date: new Date().toISOString().split('T')[0],
    Location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createFair.execute(formData);
    if (result) {
      setIsModalOpen(false);
      setFormData({
        Name: '',
        Date: new Date().toISOString().split('T')[0],
        Location: '',
      });
      refetch();
    }
  };

  const handleSync = async (fairId: string) => {
    if (window.confirm('Deseja sincronizar esta feira com o sistema externo?')) {
      await syncFair.execute(fairId);
      refetch();
    }
  };

  const columns = [
    { header: 'Nome', accessor: 'Name' as keyof Fair },
    {
      header: 'Data',
      accessor: (row: Fair) => new Date(row.Date).toLocaleDateString('pt-BR'),
    },
    { header: 'Local', accessor: 'Location' as keyof Fair },
    {
      header: 'Status',
      accessor: (row: Fair) => (
        <div className="flex gap-2">
          {row.IsActive && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Ativa</span>
          )}
          {row.IsSynced && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Sincronizada</span>
          )}
        </div>
      ),
    },
    {
      header: 'Sincronizada em',
      accessor: (row: Fair) => row.SyncedAt ? new Date(row.SyncedAt).toLocaleString('pt-BR') : '-',
    },
    {
      header: 'Ações',
      accessor: (row: Fair) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleSync(row.FairID)}
          disabled={row.IsSynced}
        >
          {row.IsSynced ? 'Sincronizada' : 'Sincronizar'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Feiras</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Nova Feira
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <Table
          data={fairs || []}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhuma feira encontrada"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Feira"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={createFair.loading}>
              Criar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            required
          />
          <Input
            label="Data"
            type="date"
            value={formData.Date}
            onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
            required
          />
          <Input
            label="Local"
            value={formData.Location}
            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
          />
        </form>
        {createFair.error && (
          <div className="text-red-600 text-sm mt-2">{createFair.error}</div>
        )}
      </Modal>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Button, Card, Table } from '../components/common';
import { invoiceService } from '../services';
import type { Invoice, InvoicePage } from '../types';

const initialPage: InvoicePage = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  data: [],
};

export const Invoices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState<InvoicePage>(initialPage);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadInvoices = async (nextPage = page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.list(nextPage, 10);
      setInvoicePage(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao carregar notas fiscais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(page);
  }, [page]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setMessage(null);
      const result = await invoiceService.sync();
      setMessage(`${result.syncedCount} nota(s) nova(s) sincronizada(s) de ${result.totalReceived} recebida(s).`);
      await loadInvoices(1);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao sincronizar notas fiscais');
    } finally {
      setSyncing(false);
    }
  };

  const downloadXml = async (invoice: Invoice) => {
    try {
      setError(null);
      let xml = invoice.xml;

      if (!xml) {
        const fullInvoice = await invoiceService.getByInvoice(invoice.numero, invoice.serie);
        xml = fullInvoice.xml;
      }

      if (!xml) {
        setError('XML não disponível para esta nota fiscal.');
        return;
      }

      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nfce-${invoice.numero}-${invoice.serie}.xml`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao baixar XML');
    }
  };

  const columns = [
    { header: 'Número', accessor: 'numero' as keyof Invoice },
    { header: 'Série', accessor: 'serie' as keyof Invoice },
    {
      header: 'Emissão',
      accessor: (row: Invoice) => row.datetimeSale ? new Date(row.datetimeSale).toLocaleString('pt-BR') : '-',
    },
    {
      header: 'Status',
      accessor: (row: Invoice) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          row.saleStatus === 'C' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {row.saleStatus || '-'}
        </span>
      ),
    },
    {
      header: 'Chave de acesso',
      accessor: (row: Invoice) => (
        <span className="font-mono text-xs text-gray-700">{row.accessKey || '-'}</span>
      ),
      className: 'max-w-md whitespace-normal',
    },
    {
      header: 'XML',
      accessor: (row: Invoice) => (
        <Button size="sm" variant="secondary" onClick={() => downloadXml(row)}>
          <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          Baixar
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Notas fiscais</h1>
          <p className="text-gray-600">Consulte e baixe os XMLs das NFC-e sincronizadas</p>
        </div>

        <Button onClick={handleSync} loading={syncing} disabled={syncing}>
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M20 9a8 8 0 00-14.9-4M4 15a8 8 0 0014.9 4" />
          </svg>
          Sincronizar notas
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border-l-4 border-green-600 text-green-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
          {message}
        </div>
      )}

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">NFC-e emitidas</h2>
            <p className="text-sm text-gray-500">{invoicePage.total} registro(s) encontrado(s)</p>
          </div>
        </div>

        <Table
          data={invoicePage.data}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhuma nota fiscal sincronizada"
        />

        {invoicePage.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="secondary"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </Button>
            <span className="text-sm font-semibold text-gray-600">
              Página {invoicePage.page} de {invoicePage.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= invoicePage.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

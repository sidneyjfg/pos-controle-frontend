import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Modal, Table } from '../components/common';
import { productGroupService, productService } from '../services';
import type { CreateProductGroupDTO, ProductGroup, Status } from '../types';

const emptyForm: CreateProductGroupDTO = {
  Name: '',
  StatusID: '',
  ProductGroupID: '',
  ImageGroupBase64: '',
};

const CATEGORY_NAME_ERROR_MESSAGE =
  'Nome da categoria deve conter apenas letras e números, sem espaços, acentos, cedilha, pontos, vírgulas, traços ou caracteres especiais. Exemplo: TigelasDePote';

const isValidCategoryName = (value: string) => /^[A-Za-z0-9]+$/.test(value);

export const ProductGroups: React.FC = () => {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [formData, setFormData] = useState<CreateProductGroupDTO>(emptyForm);
  const [selectedGroup, setSelectedGroup] = useState<ProductGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const statusMap = useMemo(
    () => Object.fromEntries(statuses.map(status => [status.ExternalID, status.Name])),
    [statuses]
  );

  const defaultStatusID = useMemo(() => {
    return statuses.find(status => status.Name === 'Habilitado')?.ExternalID || statuses[0]?.ExternalID || '';
  }, [statuses]);

  const filteredGroups = useMemo(() => {
    const filter = nameFilter.trim().toLowerCase();

    if (!filter) return productGroups;

    return productGroups.filter(group => group.Name?.toLowerCase().includes(filter));
  }, [nameFilter, productGroups]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / limit));
  const paginatedGroups = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredGroups.slice(start, start + limit);
  }, [filteredGroups, limit, page]);

  useEffect(() => {
    setPage(1);
  }, [nameFilter, limit]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [groups, statusTypes] = await Promise.all([
        productGroupService.getAll(),
        productService.getstatustypes(),
      ]);

      setProductGroups(groups);
      setStatuses(statusTypes);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      ...emptyForm,
      StatusID: defaultStatusID,
    });
    setSelectedGroup(null);
    setFieldErrors({});
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (group: ProductGroup) => {
    setSelectedGroup(group);
    setFormData({
      Name: group.Name || '',
      StatusID: group.StatusExternalID || defaultStatusID,
      ProductGroupID: group.ExternalID || '',
      ImageGroupBase64: group.ImageGroupBase64 || '',
    });
    setFieldErrors({});
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const mapValidationErrors = (err: any) => {
    const validationErrors = err.response?.data?.validationErrors;

    if (!validationErrors) return false;

    const formattedErrors: Record<string, string> = {};
    validationErrors.forEach((item: any) => {
      formattedErrors[item.field] = item.message;
    });

    setFieldErrors(formattedErrors);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const name = formData.Name.trim();

      if (!isValidCategoryName(name)) {
        setFieldErrors({ Name: CATEGORY_NAME_ERROR_MESSAGE });
        return;
      }

      const payload = {
        ...formData,
        Name: name,
        ProductGroupID: formData.ProductGroupID?.trim() || null,
        ImageGroupBase64: formData.ImageGroupBase64?.trim() || null,
      };

      const result = selectedGroup
        ? await productGroupService.update(selectedGroup.ProductGroupID, payload)
        : await productGroupService.create(payload);

      setSuccess(result.message);
      closeModal();
      await loadData();
    } catch (err: any) {
      const handled = mapValidationErrors(err);

      if (!handled) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Erro ao salvar categoria.');
      }
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'ProductGroupID' as keyof ProductGroup },
    { header: 'Nome', accessor: 'Name' as keyof ProductGroup },
    {
      header: 'Status',
      accessor: (row: ProductGroup) => {
        const status = row.StatusExternalID ? statusMap[row.StatusExternalID] : null;

        if (!status) return '-';

        const enabled = status === 'Habilitado';

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Imagem',
      accessor: (row: ProductGroup) => row.ImageGroupBase64 ? (
        <img
          src={`data:image/png;base64,${row.ImageGroupBase64}`}
          alt={row.Name}
          className="h-10 w-10 rounded-lg object-cover border border-gray-200"
        />
      ) : '-',
    },
    {
      header: 'Ações',
      accessor: (row: ProductGroup) => (
        <Button variant="secondary" size="sm" onClick={() => openEditModal(row)}>
          <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Categorias</h1>
          <p className="text-gray-600">Gerencie os grupos de produtos enviados para a Nérus Mobile</p>
        </div>
        <Button onClick={openCreateModal} size="lg" disabled={loading || statuses.length === 0}>
          <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Categoria
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-600 text-green-800 px-6 py-4 rounded-xl mb-6 shadow-sm">
          {success}
        </div>
      )}

      <Card className="animate-slide-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Categorias existentes</h2>
            <p className="text-sm text-gray-500">
              {filteredGroups.length} de {productGroups.length} categoria(s) encontrada(s)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
                placeholder="Filtrar por nome"
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-nerus-500 focus:ring-2 focus:ring-nerus-100"
              />
            </div>
            {nameFilter && (
              <Button type="button" variant="ghost" onClick={() => setNameFilter('')} disabled={loading}>
                Limpar
              </Button>
            )}
            <Button variant="secondary" onClick={loadData} disabled={loading}>
              Atualizar lista
            </Button>
          </div>
        </div>

        <Table
          data={paginatedGroups}
          columns={columns}
          loading={loading}
          emptyMessage={nameFilter ? 'Nenhuma categoria encontrada para esse nome' : 'Nenhuma categoria encontrada'}
        />

        {!loading && filteredGroups.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 px-4 pb-4">
            <select
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(currentPage => Math.max(1, currentPage - 1))}
              >
                Anterior
              </Button>

              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                Página {page} de {totalPages}
              </span>

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(currentPage => Math.min(totalPages, currentPage + 1))}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedGroup ? 'Editar Categoria' : 'Nova Categoria'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={saving}>
              {selectedGroup ? 'Salvar' : 'Criar'}
            </Button>
          </>
        }
      >
        {Object.keys(fieldErrors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold mb-1">Corrija os seguintes erros:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {Object.entries(fieldErrors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome *"
            value={formData.Name}
            onChange={(event) => setFormData({ ...formData, Name: event.target.value })}
            error={fieldErrors.Name}
            placeholder="TigelasDePote"
            required
          />
          <p className="-mt-3 text-xs text-gray-500">
            Use apenas letras e números, sem espaços, acentos, cedilha, ponto, vírgula ou traço.
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
            <select
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
              value={formData.StatusID}
              onChange={(event) => setFormData({ ...formData, StatusID: event.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {statuses.map(status => (
                <option key={status.ExternalID} value={status.ExternalID}>
                  {status.Name}
                </option>
              ))}
            </select>
            {fieldErrors.StatusID && <p className="mt-2 text-sm text-red-600">{fieldErrors.StatusID}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Imagem Base64</label>
            <textarea
              value={formData.ImageGroupBase64 || ''}
              onChange={(event) => setFormData({ ...formData, ImageGroupBase64: event.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300 font-mono text-xs"
              placeholder="Cole apenas o conteúdo base64 da imagem"
            />
            {fieldErrors.ImageGroupBase64 && <p className="mt-2 text-sm text-red-600">{fieldErrors.ImageGroupBase64}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

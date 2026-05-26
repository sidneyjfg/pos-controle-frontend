import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Input } from '../components/common';
import { useProducts } from '../hooks';
import type { CreateProductDTO, Product, ProductGroup, ProductType, Status, UnitType } from '../types';
import { productService } from '../services';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { products, pagination, loading, error, refetch, createProduct } =
    useProducts(page, limit, search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncAllDone, setSyncAllDone] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Estados para os dropdowns
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [statustypes, setStatustypes] = useState<Status[]>([]);

  const enabledStatus = statustypes.find(s => s.Name === "Habilitado");
  const disabledStatus = statustypes.find(s => s.Name === "Desabilitado");
  const statusMap = Object.fromEntries(
    statustypes.map(s => [s.ExternalID, s.Name])
  );

  const groupMap = Object.fromEntries(
    productGroups.map(g => [g.ExternalID, g.Name])
  );

  const unitMap = Object.fromEntries(
    unitTypes.map(u => [u.ExternalID, u.Name])
  );

  const initialFormData: CreateProductDTO = {
    Name: '',
    InternalCode: '',
    SalePrice: 0,
    ProductGroupID: '',
    UnitTypeID: '',
    ProductTypeID: '',
    StatusID: '', // Default: Desabilitado
    NFCeNCM: '',
    NFCeCFOP: '',
    NFCeCST: '',
    NFCeCSTPIS: '',
    NFCeAliqPIS: 0,
    NFCeCSTCOFINS: '',
    NFCeAliqCOFINS: 0,
  };

  const [formData, setFormData] = useState<CreateProductDTO>(initialFormData);

  const clearFieldErrors = () => {
    setFieldErrors({});
  };

  const resetForm = () => {
    setFormData(initialFormData);
    clearFieldErrors();
    setUpdateError(null);
  };

  const mapValidationErrors = (err: any) => {
    const validationErrors = err.response?.data?.validationErrors;

    if (!validationErrors) return false;

    const formattedErrors: Record<string, string> = {};

    validationErrors.forEach((e: any) => {
      formattedErrors[e.field] = e.message;
    });

    setFieldErrors(formattedErrors);
    return true;
  };

  const loadDropdownData = async () => {
      try {
        const [groups, types, units, statuses] = await Promise.all([
          productService.getProductGroups(),
          productService.getProductTypes(),
          productService.getUnitTypes(),
          productService.getstatustypes(),
        ]);

        setProductGroups(groups);
        setProductTypes(types);
        setUnitTypes(units);
        setStatustypes(statuses);

        const disabled = statuses.find(s => s.Name === "Desabilitado");

        if (disabled) {
          setFormData(prev => ({
            ...prev,
            StatusID: disabled.ExternalID
          }));
        }

      } catch (err) {
        console.error('Erro ao carregar dados dos dropdowns:', err);
      }
    };

  useEffect(() => {
    loadDropdownData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    setSyncError(null);
    setSyncMessage(null);

    try {
      const result = await productService.syncAll();
      setSyncAllDone(true);
      setSyncMessage(
        `Sincronização concluída: ${result.totalCreated || 0} criados e ${result.totalUpdated || 0} atualizados.`
      );
      await loadDropdownData();
      refetch();
    } catch (err: any) {
      setSyncAllDone(false);
      setSyncError(err.response?.data?.message || err.response?.data?.error || 'Erro ao sincronizar dados. Corrija antes de criar produtos.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleOpenCreateModal = () => {
    if (!syncAllDone) {
      setSyncError('Sincronize todos os dados sem erros antes de criar produtos.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFieldErrors();

    try {
      const result = await createProduct.execute(formData);

      if (result) {
        setIsModalOpen(false);
        resetForm();
        refetch();
      }
    } catch (err: any) {
      mapValidationErrors(err);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      Name: product.Name || '',
      NameEng: product.NameEng || '',
      InternalCode: product.InternalCode,
      BarCode: product.BarCode || '',
      SalePrice: product.SalePrice ?? 0,
      ProductGroupID: product.ProductGroupID ?? '',
      ProductTypeID: product.ProductTypeID ?? '',
      UnitTypeID: product.UnitTypeID ?? '',
      StatusID: product.StatusID ?? '',
      NFCeNCM: product.NFCeNCM || '',
      NFCeCFOP: product.NFCeCFOP || '',
      NFCeCST: product.NFCeCST || '',
      NFCeCEST: product.NFCeCEST || '',
      NFCeAliqICMS: product.NFCeAliqICMS,
      NFCeCSTPIS: product.NFCeCSTPIS || '',
      NFCeAliqPIS: product.NFCeAliqPIS,
      NFCeCSTCOFINS: product.NFCeCSTCOFINS || '',
      NFCeAliqCOFINS: product.NFCeAliqCOFINS,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsUpdating(true);
    setUpdateError(null);
    clearFieldErrors();

    try {
      await productService.update(selectedProduct.ProductID, formData);

      setIsEditModalOpen(false);
      setSelectedProduct(null);
      resetForm();
      refetch();
    } catch (err: any) {
      const handled = mapValidationErrors(err);

      if (!handled) {
        setUpdateError(err.response?.data?.message || 'Erro ao atualizar produto');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Função para deletar produto (será implementada quando necessário)
  // const handleDeleteProduct = async (product: Product) => {
  //   if (!window.confirm(`Deseja realmente excluir o produto "${product.Name}"?`)) {
  //     return;
  //   }
  //
  //   try {
  //     await productService.delete(product.ProductID);
  //     refetch();
  //   } catch (err: any) {
  //     alert(err.response?.data?.message || 'Erro ao excluir produto');
  //   }
  // };

  const columns = [
    { header: 'ID', accessor: 'ProductID' as keyof Product },
    { header: 'Nome', accessor: 'Name' as keyof Product },
    {
      header: 'Status',
      accessor: (row: Product) => {
        const status = row.StatusID ? statusMap[row.StatusID] : null;

        if (!status) return "-";

        const enabled = status === "Habilitado";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {status}
          </span>
        );
      }
    },
    { header: 'Código Interno', accessor: 'InternalCode' as keyof Product },
    { header: 'Código de Barras', accessor: 'BarCode' as keyof Product },
    {
      header: 'Preço',
      accessor: (row: Product) =>
        row.SalePrice ? `R$ ${Number(row.SalePrice).toFixed(2)}` : '-',
    },
    {
      header: 'Ações',
      accessor: (row: Product) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleViewDetails(row)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Ver
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditProduct(row)}
          >
            <svg className="h-4 w-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSyncAll}
            size="lg"
            variant="secondary"
            loading={isSyncingAll}
            disabled={isSyncingAll}
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M20 9a8 8 0 00-14.9-4M4 15a8 8 0 0014.9 4" />
            </svg>
            Sincronizar dados
          </Button>
          <Button onClick={handleOpenCreateModal} size="lg" disabled={!syncAllDone || isSyncingAll}>
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Produto
          </Button>
        </div>
      </div>

      {!syncAllDone && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 px-6 py-4 rounded-xl mb-6 shadow-sm animate-slide-in">
          <p className="font-semibold">Sincronização obrigatória</p>
          <p className="text-sm mt-1">
            Antes de criar produtos, sincronize Product Groups, Product Types, Unit Types, Status Types e Products. O cadastro só será liberado se a sincronização terminar sem erros.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-900 px-6 py-4 rounded-xl mb-6 shadow-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold">Como os produtos são publicados</p>
            <p className="text-sm mt-1">
              Produtos criados aqui ficam salvos no painel. Eles só são enviados para a POS Controle quando uma feira é sincronizada.
              O envio externo respeita lotes de até 25 produtos por requisição.
            </p>
          </div>
        </div>
      </div>

      {syncMessage && (
        <div className="bg-green-50 border-l-4 border-green-600 text-green-800 px-6 py-4 rounded-xl mb-6 shadow-sm animate-slide-in">
          {syncMessage}
        </div>
      )}

      {syncError && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-sm animate-slide-in">
          {syncError}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-nerus-600 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center shadow-sm animate-slide-in">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}  
      <Card className="animate-slide-in">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Catálogo</h2>
            <p className="text-sm text-gray-500">
              {pagination?.total || 0} produto(s) encontrado(s)
              {search ? ` para "${search}"` : ''}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-96">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar por nome, código, barras ou ID externo"
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-nerus-500 focus:ring-2 focus:ring-nerus-100"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={loading}>
              Buscar
            </Button>
            {search && (
              <Button type="button" variant="ghost" onClick={handleClearSearch} disabled={loading}>
                Limpar
              </Button>
            )}
          </div>
        </form>

        <Table
          data={products || []}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhum produto encontrado"
        />

        {pagination && (
          <div className="flex justify-between items-center mt-4 px-4 pb-4">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Anterior
            </Button>

            <span className="text-sm text-gray-600 font-medium">
              Página {pagination.page} de {pagination.totalPages}
              {" • "}
              {pagination.total} produtos
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Próxima →
            </Button>

          </div>
        )}
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Novo Produto"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={createProduct.loading} disabled={!syncAllDone}>
              Criar
            </Button>
          </>
        }
      >
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-xl mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">
              Este cadastro salva o produto localmente. Para enviar à POS Controle, vincule o produto em uma feira e sincronize a feira.
            </p>
          </div>
        </div>
        {Object.keys(fieldErrors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold mb-1">Corrija os seguintes erros:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(fieldErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome *"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              error={fieldErrors.Name}
              required
            />
            <Input
              label="Descrição Completa"
              value={formData.NameEng || ''}
              onChange={(e) => setFormData({ ...formData, NameEng: e.target.value })}
              error={fieldErrors.NameEng}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código Interno *"
              value={formData.InternalCode}
              onChange={(e) => setFormData({ ...formData, InternalCode: e.target.value })}
              error={fieldErrors.InternalCode}
              required
            />
            <Input
              label="Código de Barras"
              value={formData.BarCode || ''}
              onChange={(e) => setFormData({ ...formData, BarCode: e.target.value })}
              error={fieldErrors.BarCode}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grupo de Produto *</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.ProductGroupID || ''}
                onChange={(e) => setFormData({ ...formData, ProductGroupID: e.target.value ? e.target.value : '' })}
                required
              >
                <option value="">Selecione...</option>
                {productGroups.map(group => (
                  <option key={group.ExternalID} value={group.ExternalID}>
                    {group.Name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Produto</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.ProductTypeID || ''}
                onChange={(e) => setFormData({ ...formData, ProductTypeID: e.target.value ? e.target.value : '' })}
              >
                <option value="">Selecione...</option>
                {productTypes.map(type => (
                  <option key={type.ExternalID} value={type.ExternalID}>
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unidade *</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.UnitTypeID || ''}
                onChange={(e) => setFormData({ ...formData, UnitTypeID: e.target.value ? e.target.value : '' })}
                required
              >
                <option value="">Selecione...</option>
                {unitTypes.map(unit => (
                  <option key={unit.ExternalID} value={unit.ExternalID}>
                    {unit.Name} ({unit.Abbreviation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status do Produto</label>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    StatusID:
                      formData.StatusID === enabledStatus?.ExternalID
                        ? disabledStatus?.ExternalID || ""
                        : enabledStatus?.ExternalID || ""
                  })
                }
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:ring-offset-2 ${formData.StatusID === enabledStatus?.ExternalID
                  ? "bg-green-500"
                  : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.StatusID === enabledStatus?.ExternalID
                    ? "translate-x-8"
                    : "translate-x-1"
                    }`}
                />
              </button>
              <span
                className={`text-sm font-semibold ${formData.StatusID === enabledStatus?.ExternalID
                  ? "text-green-600"
                  : "text-gray-600"
                  }`}
              >
                {formData.StatusID ? statusMap[formData.StatusID] || "Desabilitado" : "Desabilitado"}
              </span>
            </div>
          </div>

          <Input
            label="Preço de Venda"
            type="number"
            step="0.01"
            value={formData.SalePrice || ''}
            onChange={(e) => setFormData({ ...formData, SalePrice: e.target.value ? parseFloat(e.target.value) : 0 })}
          />

          <div className="border-t-2 border-gray-100 pt-6 mt-2">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-nerus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Informações Fiscais (NFC-e)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="NCM *"
                value={formData.NFCeNCM || ''}
                onChange={(e) => setFormData({ ...formData, NFCeNCM: e.target.value })}
                error={fieldErrors.NFCeNCM}
                required
                maxLength={8}
                placeholder="8 dígitos"
              />
              <Input
                label="CFOP *"
                value={formData.NFCeCFOP || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCFOP: e.target.value })}
                error={fieldErrors.NFCeCFOP}
                required
                maxLength={4}
                placeholder="4 dígitos"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST ICMS *"
                value={formData.NFCeCST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCST: e.target.value })}
                error={fieldErrors.NFCeCST}
                required
                maxLength={3}
                placeholder="3 dígitos"
              />
              <Input
                label="CEST"
                value={formData.NFCeCEST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCEST: e.target.value })}
                error={fieldErrors.NFCeCEST}
                placeholder="Se CST=110"
              />
              <Input
                label="Alíquota ICMS (%)"
                type="number"
                step="0.01"
                value={formData.NFCeAliqICMS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqICMS: e.target.value ? parseFloat(e.target.value) : undefined })}
                error={fieldErrors.NFCeAliqICMS}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST PIS *"
                value={formData.NFCeCSTPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTPIS: e.target.value })}
                error={fieldErrors.NFCeCSTPIS}
                required
                maxLength={2}
                placeholder="2 dígitos"
              />
              <Input
                label="Alíquota PIS (%) *"
                type="number"
                step="0.01"
                value={formData.NFCeAliqPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqPIS: e.target.value ? parseFloat(e.target.value) : undefined })}
                error={fieldErrors.NFCeAliqPIS}
                required
                placeholder="Ex: 1.65"
              />
              <Input
                label="CST COFINS *"
                value={formData.NFCeCSTCOFINS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTCOFINS: e.target.value })}
                error={fieldErrors.NFCeCSTCOFINS}
                required
                maxLength={2}
                placeholder="2 dígitos"
              />
            </div>

            <Input
              label="Alíquota COFINS (%) *"
              type="number"
              step="0.01"
              value={formData.NFCeAliqCOFINS || ''}
              onChange={(e) => setFormData({ ...formData, NFCeAliqCOFINS: e.target.value ? parseFloat(e.target.value) : undefined })}
              error={fieldErrors.NFCeAliqCOFINS}
              required
              placeholder="Ex: 7.60"
            />
          </div>
        </form>
      </Modal>

      {/* Modal de Edição do Produto */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
          resetForm();
        }}
        title="Editar Produto"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProduct} loading={isUpdating}>
              Salvar Alterações
            </Button>
          </>
        }
      >
        {Object.keys(fieldErrors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold mb-1">Corrija os seguintes erros:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(fieldErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {updateError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{updateError}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome *"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              error={fieldErrors.Name}
              required
            />
            <Input
              label="Nome (Inglês)"
              value={formData.NameEng || ''}
              onChange={(e) => setFormData({ ...formData, NameEng: e.target.value })}
              error={fieldErrors.NameEng}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código Interno *"
              value={formData.InternalCode}
              onChange={(e) => setFormData({ ...formData, InternalCode: e.target.value })}
              error={fieldErrors.InternalCode}
              required
              disabled
            />
            <Input
              label="Código de Barras"
              value={formData.BarCode || ''}
              onChange={(e) => setFormData({ ...formData, BarCode: e.target.value })}
              error={fieldErrors.BarCode}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grupo de Produto</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.ProductGroupID || ''}
                onChange={(e) => setFormData({ ...formData, ProductGroupID: e.target.value ? e.target.value : '' })}
              >
                <option value="">Selecione...</option>
                {productGroups.map(group => (
                  <option
                    key={group.ExternalID ?? group.ProductGroupID}
                    value={group.ExternalID ?? ""}
                  >
                    {group.Name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Produto</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.ProductTypeID || ''}
                onChange={(e) => setFormData({ ...formData, ProductTypeID: e.target.value ? e.target.value : '' })}
              >
                <option value="">Selecione...</option>
                {productTypes.map(type => (
                  <option
                    key={type.ExternalID ?? type.ProductTypeID}
                    value={type.ExternalID ?? ""}
                  >
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unidade</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.UnitTypeID || ''}
                onChange={(e) => setFormData({ ...formData, UnitTypeID: e.target.value ? e.target.value : '' })}
              >
                <option value="">Selecione...</option>
                {unitTypes.map(unit => (
                  <option
                    key={unit.ExternalID ?? unit.UnitTypeID}
                    value={unit.ExternalID ?? ""}
                  >
                    {unit.Name} ({unit.Abbreviation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status do Produto
            </label>

            <select
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
              value={formData.StatusID || ""}
              onChange={(e) =>
                setFormData({ ...formData, StatusID: e.target.value })
              }
            >
              <option value="">Selecione...</option>

              {statustypes.map(status => (
                <option
                  key={status.ExternalID ?? status.StatusID}
                  value={status.ExternalID}
                >
                  {status.Name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Preço de Venda"
            type="number"
            step="0.01"
            value={formData.SalePrice || ''}
            onChange={(e) => setFormData({ ...formData, SalePrice: e.target.value ? parseFloat(e.target.value) : 0 })}
            error={fieldErrors.SalePrice}
          />

          <div className="border-t-2 border-gray-100 pt-6 mt-2">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-nerus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Informações Fiscais (NFC-e)
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="NCM"
                value={formData.NFCeNCM || ''}
                onChange={(e) => setFormData({ ...formData, NFCeNCM: e.target.value })}
                error={fieldErrors.NFCeNCM}
              />
              <Input
                label="CFOP"
                value={formData.NFCeCFOP || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCFOP: e.target.value })}
                error={fieldErrors.NFCeCFOP}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST ICMS"
                value={formData.NFCeCST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCST: e.target.value })}
                error={fieldErrors.NFCeCST}
                maxLength={3}
                placeholder="3 dígitos"
              />
              <Input
                label="CEST"
                value={formData.NFCeCEST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCEST: e.target.value })}
                error={fieldErrors.NFCeCEST}
                placeholder="Se CST=110"
              />
              <Input
                label="Alíquota ICMS (%)"
                type="number"
                step="0.01"
                value={formData.NFCeAliqICMS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqICMS: e.target.value ? parseFloat(e.target.value) : undefined })}
                error={fieldErrors.NFCeAliqICMS}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST PIS"
                value={formData.NFCeCSTPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTPIS: e.target.value })}
                error={fieldErrors.NFCeCSTPIS}
                maxLength={2}
                placeholder="2 dígitos"
              />
              <Input
                label="Alíquota PIS (%)"
                type="number"
                step="0.01"
                value={formData.NFCeAliqPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqPIS: e.target.value ? parseFloat(e.target.value) : undefined })}
                error={fieldErrors.NFCeAliqPIS}
                placeholder="Ex: 1.65"
              />
              <Input
                label="CST COFINS"
                value={formData.NFCeCSTCOFINS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTCOFINS: e.target.value })}
                error={fieldErrors.NFCeCSTCOFINS}
                maxLength={2}
                placeholder="2 dígitos"
              />
            </div>

            <Input
              label="Alíquota COFINS (%)"
              type="number"
              step="0.01"
              value={formData.NFCeAliqCOFINS || ''}
              onChange={(e) => setFormData({ ...formData, NFCeAliqCOFINS: e.target.value ? parseFloat(e.target.value) : undefined })}
              error={fieldErrors.NFCeAliqCOFINS}
              placeholder="Ex: 7.60"
            />
          </div>
        </form>
        {updateError && (
          <div className="text-red-600 text-sm mt-2">{updateError}</div>
        )}
      </Modal>

      {/* Modal de Detalhes do Produto */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Produto"
        size="xl"
        footer={
          <Button onClick={() => setIsDetailModalOpen(false)} variant="secondary">
            Fechar
          </Button>
        }
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* Header com ID e Preço */}
            <div className="bg-gradient-to-r from-nerus-50 to-nerus-100/50 rounded-xl p-4 border border-nerus-200">
              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-xs font-semibold text-nerus-700 uppercase tracking-wide">ID do Produto</label>
                  <p className="text-2xl font-bold text-nerus-900">#{selectedProduct.ProductID}</p>
                </div>
                <div className="text-right">
                  <label className="block text-xs font-semibold text-nerus-700 uppercase tracking-wide">Preço de Venda</label>
                  <p className="text-2xl font-bold text-nerus-900">
                    {selectedProduct.SalePrice ? `R$ ${Number(selectedProduct.SalePrice).toFixed(2)}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Básicas */}
            <div>
              <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                <div className="w-1 h-4 bg-nerus-600 rounded mr-2"></div>
                Informações Básicas
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nome</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.Name || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nome (Inglês)</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.NameEng || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Código Interno</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.InternalCode}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Código de Barras</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.BarCode || '-'}</p>
                </div>
              </div>
            </div>

            {/* Classificação */}
            <div>
              <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                <div className="w-1 h-4 bg-nerus-600 rounded mr-2"></div>
                Classificação
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Grupo</label>
                  <p className="text-gray-900 font-medium">
                    {
                      selectedProduct.ProductGroupID
                        ? groupMap[selectedProduct.ProductGroupID] || "-"
                        : "-"
                    }
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Unidade</label>
                  <p className="text-gray-900 font-medium">
                    {
                      selectedProduct.UnitTypeID
                        ? unitMap[selectedProduct.UnitTypeID] || "-"
                        : "-"
                    }
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                  <p className="font-semibold text-gray-800">
                    {
                      statustypes.find(
                        (s) => s.ExternalID === selectedProduct.StatusID
                      )?.Name || "-"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Fiscais */}
            <div className="border-t-2 border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center">
                <div className="w-1 h-4 bg-nerus-600 rounded mr-2"></div>
                Informações Fiscais (NFC-e)
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">NCM</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeNCM || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CFOP</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeCFOP || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CST</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeCST || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CEST</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeCEST || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Alíquota ICMS</label>
                  <p className="text-gray-900 font-medium">
                    {selectedProduct.NFCeAliqICMS ? `${selectedProduct.NFCeAliqICMS}%` : '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CST PIS</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeCSTPIS || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Alíquota PIS</label>
                  <p className="text-gray-900 font-medium">
                    {selectedProduct.NFCeAliqPIS ? `${selectedProduct.NFCeAliqPIS}%` : '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">CST COFINS</label>
                  <p className="text-gray-900 font-medium font-mono">{selectedProduct.NFCeCSTCOFINS || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Alíquota COFINS</label>
                  <p className="text-gray-900 font-medium">
                    {selectedProduct.NFCeAliqCOFINS ? `${selectedProduct.NFCeAliqCOFINS}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
};

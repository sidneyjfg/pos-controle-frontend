import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input } from '../components/common';
import { useFairs, useProducts } from '../hooks';
import { fairService } from '../services';
import type { CreateFairDTO, Fair, Product, FairProduct } from '../types';

export const Fairs: React.FC = () => {
  const { fairs, loading, error, refetch, createFair, syncFair } = useFairs();
  const { products } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [selectedFair, setSelectedFair] = useState<Fair | null>(null);
  const [fairProducts, setFairProducts] = useState<FairProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

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

  const handleToggleStatus = async (fair: Fair) => {
    const newStatus = !fair.IsActive;
    const action = newStatus ? 'ativar' : 'desativar';

    if (!window.confirm(`Deseja ${action} a feira "${fair.Name}"?`)) {
      return;
    }

    try {
      await fairService.toggleFairStatus(fair.FairID, newStatus);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || `Erro ao ${action} feira`);
    }
  };

  const handleManageProducts = async (fair: Fair) => {
    setSelectedFair(fair);
    setIsProductsModalOpen(true);
    setLoadingProducts(true);

    try {
      const products = await fairService.getFairProducts(fair.FairID);
      setFairProducts(products);
    } catch (err) {
      console.error('Erro ao carregar produtos da feira:', err);
      setFairProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProductToFair = async (product: Product) => {
    if (!selectedFair) return;

    try {
      await fairService.addProductToFair(selectedFair.FairID, {
        internalCode: product.InternalCode,
        customPrice: product.SalePrice // Usa preço padrão inicialmente
      });

      // Recarregar produtos da feira
      const updated = await fairService.getFairProducts(selectedFair.FairID);
      setFairProducts(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao adicionar produto');
    }
  };

  const [editingPrice, setEditingPrice] = useState<{ internalCode: string; currentPrice: number } | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  const handleEditPrice = (fairProduct: FairProduct) => {
    if (!fairProduct.product) return;

    setEditingPrice({
      internalCode: fairProduct.product.InternalCode,
      currentPrice: Number(fairProduct.SalePrice)
    });
    setNewPrice(fairProduct.SalePrice.toString());
  };

  const handleSavePrice = async () => {
    if (!selectedFair || !editingPrice) return;

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue < 0) {
      alert('Preço inválido');
      return;
    }

    try {
      await fairService.updateFairProductPrice(selectedFair.FairID, editingPrice.internalCode, {
        customPrice: priceValue
      });

      // Recarregar produtos da feira
      const updated = await fairService.getFairProducts(selectedFair.FairID);
      setFairProducts(updated);

      setEditingPrice(null);
      setNewPrice('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar preço');
    }
  };

  const handleRemoveProduct = async (fairProduct: FairProduct) => {
    if (!selectedFair || !fairProduct.product) return;

    if (!window.confirm(`Deseja remover "${fairProduct.product.Name}" desta feira?`)) {
      return;
    }

    try {
      await fairService.removeProductFromFair(selectedFair.FairID, fairProduct.product.InternalCode);

      // Recarregar produtos da feira
      const updated = await fairService.getFairProducts(selectedFair.FairID);
      setFairProducts(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao remover produto');
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
          {row.IsActive ? (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded font-semibold">Ativa</span>
          ) : (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Inativa</span>
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
        <div className="flex gap-2">
          <Button
            variant={row.IsActive ? "secondary" : "primary"}
            size="sm"
            onClick={() => handleToggleStatus(row)}
            className={!row.IsActive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={row.IsActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
            {row.IsActive ? 'Desativar' : 'Ativar'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleManageProducts(row)}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Produtos
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSync(row.FairID)}
            disabled={row.IsSynced || !row.IsActive}
            title={!row.IsActive ? "Ative a feira primeiro" : ""}
          >
            {row.IsSynced ? 'Sincronizada' : 'Sincronizar'}
          </Button>
        </div>
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

      {/* Modal de Gestão de Produtos da Feira */}
      <Modal
        isOpen={isProductsModalOpen}
        onClose={() => {
          setIsProductsModalOpen(false);
          setSelectedFair(null);
        }}
        title={`Produtos da Feira: ${selectedFair?.Name || ''}`}
        size="xl"
        footer={
          <Button variant="secondary" onClick={() => {
            setIsProductsModalOpen(false);
            setSelectedFair(null);
          }}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Informações da Feira */}
          {selectedFair && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide">Data</label>
                  <p className="text-sm text-blue-900 mt-1">
                    {new Date(selectedFair.Date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide">Local</label>
                  <p className="text-sm text-blue-900 mt-1">{selectedFair.Location || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide">Status</label>
                  <div className="flex gap-2 mt-1">
                    {selectedFair.IsActive ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Ativa
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        Inativa
                      </span>
                    )}
                      {selectedFair.IsSynced ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-semibold">
                          Sincronizada
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          Não sincronizada
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Produtos Disponíveis para Adicionar */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
              <div className="w-1 h-4 bg-nerus-600 rounded mr-2"></div>
              Adicionar Produtos à Feira
            </h4>

            {loadingProducts ? (
              <p className="text-gray-500 text-center py-4">Carregando produtos...</p>
            ) : (
              <div className="max-h-96 overflow-y-auto border rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Produto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Código
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Preço Padrão
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.ProductID} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {product.Name || 'Sem nome'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                            {product.InternalCode}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {product.SalePrice ? `R$ ${Number(product.SalePrice).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleAddProductToFair(product)}
                            >
                              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Adicionar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          Nenhum produto disponível
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Produtos já Adicionados à Feira */}
          <div className="border-t-2 border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
              <div className="w-1 h-4 bg-green-600 rounded mr-2"></div>
              Produtos na Feira ({fairProducts.length})
            </h4>

            {fairProducts.length > 0 ? (
              <div className="border rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Produto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Preço Customizado
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fairProducts.map((fp) => (
                      <tr key={fp.FairProductID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{fp.product?.Name || 'Produto sem nome'}</p>
                            <p className="text-xs text-gray-500">Código: {fp.product?.InternalCode}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-semibold text-green-600">R$ {Number(fp.SalePrice).toFixed(2)}</p>
                            {fp.product?.SalePrice && fp.SalePrice !== fp.product.SalePrice && (
                              <p className="text-xs text-gray-500 line-through">
                                Padrão: R$ {Number(fp.product.SalePrice).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {fp.IsActive ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Ativo</span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Inativo</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditPrice(fp)}
                            >
                              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Preço
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleRemoveProduct(fp)}
                              className="text-red-600 hover:bg-red-50 border-red-200"
                            >
                              <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remover
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-500 font-medium">Nenhum produto adicionado a esta feira</p>
                <p className="text-sm text-gray-400 mt-1">Adicione produtos usando a tabela acima</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de Edição de Preço */}
      <Modal
        isOpen={!!editingPrice}
        onClose={() => {
          setEditingPrice(null);
          setNewPrice('');
        }}
        title="Editar Preço do Produto"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingPrice(null);
                setNewPrice('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSavePrice}>
              Salvar Preço
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Preço atual:</strong> R$ {editingPrice?.currentPrice.toFixed(2)}
            </p>
          </div>

          <Input
            label="Novo Preço (R$) *"
            type="number"
            step="0.01"
            min="0"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="0.00"
            required
            autoFocus
          />

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-600">
              💡 <strong>Dica:</strong> O preço customizado será aplicado apenas nesta feira.
              O preço padrão do produto permanece inalterado.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

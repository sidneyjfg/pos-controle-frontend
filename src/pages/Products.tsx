import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Input } from '../components/common';
import { useProducts } from '../hooks';
import type { CreateProductDTO, Product, ProductGroup, ProductType, UnitType, Status } from '../types';
import { productService } from '../services';

export const Products: React.FC = () => {
  const { products, loading, error, refetch, createProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Estados para os dropdowns
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  
  const [formData, setFormData] = useState<CreateProductDTO>({
    Name: '',
    InternalCode: '',
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [groups, types, units, statusList] = await Promise.all([
          productService.getProductGroups(),
          productService.getProductTypes(),
          productService.getUnitTypes(),
          productService.getStatuses(),
        ]);
        setProductGroups(groups);
        setProductTypes(types);
        setUnitTypes(units);
        setStatuses(statusList);
      } catch (err) {
        console.error('Erro ao carregar dados dos dropdowns:', err);
      }
    };
    loadDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createProduct.execute(formData);
    if (result) {
      setIsModalOpen(false);
      setFormData({
        Name: '',
        InternalCode: '',
      });
      refetch();
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'ProductID' as keyof Product },
    { header: 'Nome', accessor: 'Name' as keyof Product },
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
          Detalhes
        </Button>
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
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Produto
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-nerus-600 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center shadow-sm animate-slide-in">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <Card className="animate-slide-in">
        <Table
          data={products || []}
          columns={columns}
          loading={loading}
          emptyMessage="Nenhum produto encontrado"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Produto"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={createProduct.loading}>
              Criar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome *"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              required
            />
            <Input
              label="Nome (Inglês)"
              value={formData.NameEng || ''}
              onChange={(e) => setFormData({ ...formData, NameEng: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código Interno *"
              value={formData.InternalCode}
              onChange={(e) => setFormData({ ...formData, InternalCode: e.target.value })}
              required
            />
            <Input
              label="Código de Barras"
              value={formData.BarCode || ''}
              onChange={(e) => setFormData({ ...formData, BarCode: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grupo de Produto</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.ProductGroupID || ''}
                onChange={(e) => setFormData({ ...formData, ProductGroupID: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione...</option>
                {productGroups.map(group => (
                  <option key={group.ProductGroupID} value={group.ProductGroupID}>
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
                onChange={(e) => setFormData({ ...formData, ProductTypeID: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione...</option>
                {productTypes.map(type => (
                  <option key={type.ProductTypeID} value={type.ProductTypeID}>
                    {type.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unidade</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.UnitTypeID || ''}
                onChange={(e) => setFormData({ ...formData, UnitTypeID: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione...</option>
                {unitTypes.map(unit => (
                  <option key={unit.UnitTypeID} value={unit.UnitTypeID}>
                    {unit.Name} ({unit.Abbreviation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nerus-500 focus:border-transparent bg-white hover:border-gray-300"
                value={formData.StatusID || ''}
                onChange={(e) => setFormData({ ...formData, StatusID: e.target.value ? Number(e.target.value) : undefined })}
              >
                <option value="">Selecione...</option>
                {statuses.map(status => (
                  <option key={status.StatusID} value={status.StatusID}>
                    {status.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Preço de Venda"
            type="number"
            step="0.01"
            value={formData.SalePrice || ''}
            onChange={(e) => setFormData({ ...formData, SalePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
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
              />
              <Input
                label="CFOP"
                value={formData.NFCeCFOP || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCFOP: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST"
                value={formData.NFCeCST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCST: e.target.value })}
              />
              <Input
                label="CEST"
                value={formData.NFCeCEST || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCEST: e.target.value })}
              />
              <Input
                label="Alíquota ICMS (%)"
                type="number"
                step="0.01"
                value={formData.NFCeAliqICMS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqICMS: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CST PIS"
                value={formData.NFCeCSTPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTPIS: e.target.value })}
              />
              <Input
                label="Alíquota PIS (%)"
                type="number"
                step="0.01"
                value={formData.NFCeAliqPIS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeAliqPIS: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
              <Input
                label="CST COFINS"
                value={formData.NFCeCSTCOFINS || ''}
                onChange={(e) => setFormData({ ...formData, NFCeCSTCOFINS: e.target.value })}
              />
            </div>

            <Input
              label="Alíquota COFINS (%)"
              type="number"
              step="0.01"
              value={formData.NFCeAliqCOFINS || ''}
              onChange={(e) => setFormData({ ...formData, NFCeAliqCOFINS: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
        </form>
        {createProduct.error && (
          <div className="text-red-600 text-sm mt-2">{createProduct.error}</div>
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
                  <p className="text-gray-900 font-medium">{selectedProduct.ProductGroupID || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.ProductTypeID || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Unidade</label>
                  <p className="text-gray-900 font-medium">{selectedProduct.UnitTypeID || '-'}</p>
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
    </div>
  );
};

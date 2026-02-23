import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common';
import { useProducts, useFairs } from '../hooks';

export const Dashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { fairs, loading: fairsLoading } = useFairs();

  const stats = [
    {
      title: 'Total de Produtos',
      value: products?.length || 0,
      icon: '📦',
      link: '/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Total de Feiras',
      value: fairs?.length || 0,
      icon: '🎪',
      link: '/fairs',
      color: 'bg-green-500',
    },
    {
      title: 'Feiras Ativas',
      value: fairs?.filter(f => f.IsActive).length || 0,
      icon: '✅',
      link: '/fairs',
      color: 'bg-purple-500',
    },
    {
      title: 'Feiras Sincronizadas',
      value: fairs?.filter(f => f.IsSynced).length || 0,
      icon: '🔄',
      link: '/fairs',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {productsLoading || fairsLoading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} text-white text-4xl p-4 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Produtos Recentes">
          {productsLoading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {products?.slice(0, 5).map((product) => (
                <div key={product.ProductID} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{product.Name || 'Sem nome'}</p>
                    <p className="text-sm text-gray-500">{product.InternalCode}</p>
                  </div>
                  <p className="font-bold text-green-600">
                    {product.SalePrice
                      ? `R$ ${Number(product.SalePrice).toFixed(2)}`
                      : '-'}
                  </p>
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
              )}
            </div>
          )}
        </Card>

        <Card title="Feiras Recentes">
          {fairsLoading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {fairs?.slice(0, 5).map((fair) => (
                <div key={fair.FairID} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{fair.Name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(fair.Date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {fair.IsActive && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Ativa</span>
                    )}
                    {fair.IsSynced && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Sync</span>
                    )}
                  </div>
                </div>
              ))}
              {(!fairs || fairs.length === 0) && (
                <p className="text-gray-500 text-center py-4">Nenhuma feira cadastrada</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

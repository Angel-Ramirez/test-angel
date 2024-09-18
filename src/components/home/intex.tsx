import React from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Tipos de datos para TypeScript
interface CatData {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface UserData {
  name: { first: string; last: string };
  picture: { large: string };
}

// Funciones para obtener datos de las APIs
const fetchCats = async (page: number) => {
  const { data } = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=10&page=${page}`);
  return data;
};

const fetchUsers = async (page: number) => {
  const { data } = await axios.get(`https://randomuser.me/api/?results=10&page=${page}`);
  return data.results;
};

// Componente principal
const App: React.FC = () => {
  const {
    data: catsData,
    fetchNextPage: fetchNextCatsPage,
    hasNextPage: hasNextCatsPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    'cats',
    ({ pageParam = 1 }) => fetchCats(pageParam),
    {
      getNextPageParam: (lastPage, pages) => (lastPage.length ? pages.length + 1 : undefined),
    }
  );

  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetching: isUsersFetching,
    isFetchingNextPage: isUsersFetchingNextPage,
  } = useInfiniteQuery(
    'users',
    ({ pageParam = 1 }) => fetchUsers(pageParam),
    {
      getNextPageParam: (lastPage, pages) => (lastPage.length ? pages.length + 1 : undefined),
    }
  );

  const cats = catsData?.pages.flat() ?? [];
  const users = usersData?.pages.flat() ?? [];

  if (isFetching || isUsersFetching) return <div className="p-4">Cargando...</div>;
  if (catsData.error || usersData.error) return <div className="p-4">Error al cargar datos</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gatos y Personas Aleatorias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cats.map((cat) => (
          <div key={cat.id} className="border p-4 rounded-md shadow-md">
            <img src={cat.url} alt="Gato" className="w-full h-auto mb-2 rounded-md" />
            <p className="text-center">Gato</p>
          </div>
        ))}
        <button
          onClick={() => fetchNextCatsPage()}
          disabled={!hasNextCatsPage || isFetchingNextPage}
          className="col-span-full mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {isFetchingNextPage ? 'Cargando más gatos...' : 'Cargar más gatos'}
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user, index) => (
          <div key={index} className="border p-4 rounded-md shadow-md">
            <img src={user.picture.large} alt="Persona Aleatoria" className="w-full h-auto mb-2 rounded-md" />
            <p className="text-center">
              {user.name.first} {user.name.last}
            </p>
          </div>
        ))}
        <button
          onClick={() => fetchNextUsersPage()}
          disabled={!hasNextUsersPage || isUsersFetchingNextPage}
          className="col-span-full mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {isUsersFetchingNextPage ? 'Cargando más usuarios...' : 'Cargar más usuarios'}
        </button>
      </div>
    </div>
  );
};

export default App;
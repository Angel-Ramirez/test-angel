import React, {useEffect, useState} from 'react';
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const [clients, setClients] = useState([])
  const [cats, setCats] = useState([])
  const [counter, setCounter] = useState(0)


  
  const fetchUsers = async () => {
    let page = Math.floor(Math.random() * 34)
    const getUser = await fetch("https://randomuser.me/api");
    const responseUser = await getUser.json();    
    const getCats = await fetch(`https://catfact.ninja/facts?page=${page}`);
    const responseCats = await getCats.json();
    let description = Math.floor(Math.random() * 9)
    setClients(prevClients => [...prevClients, {
      photo:responseUser.results[0].picture?.thumbnail,
      name: responseUser.results[0].name?.first,
      lastName: responseUser.results[0].name?.last,
      description:responseCats.data[description].fact
    }]);
    return true
  };

  useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    staleTime:1000,
    cacheTime:10000,
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  })

  return (
    <>
      { 
        clients.map((client,index) => (
          <div key={index} className='border-2 border-slate-600 m-2 p-2 rounded-md'>
          <ul role="list" className="divide-y divide-gray-100">
              <li className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                      <img
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={client?.photo}
                          alt=""
                          />
                      <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">{client?.name} {client?.lastName}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{client?.description}</p>
                      </div>
                  </div>
              </li>
          </ul>
      </div>
))
}</>
    );
};

export default Home;

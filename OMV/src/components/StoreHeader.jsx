'use client'
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function StoreHeader({ onSearch, onSort, cartItemsCount = 0 }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptionsState, setSortOptionsState] = useState(sortOptions);

  // Fixed: Only call onSearch when form is submitted, not on every input change
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Fixed: Update local state but don't trigger search on every keystroke
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Removed the onSearch call from here to fix the issue
  };

  const handleSort = (selectedName) => {
    const updatedOptions = sortOptionsState.map(option => ({
      ...option,
      current: option.name === selectedName,
    }));
    setSortOptionsState([
      ...updatedOptions.filter(option => option.current),
      ...updatedOptions.filter(option => !option.current)
    ]);
    onSort(selectedName);
  };

  return (
    <div className="bg-white w-full">
      <div className="w-full">
        <main className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6 w-full">
            <h1 className="text-4xl font-bold tracking-tight bg-gray-900"></h1>
            <div className="w-full max-w-lg min-w-[300px]">
              <form onSubmit={handleSearch} className="relative">
                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-base border border-slate-200 rounded-md pl-3 pr-28 py-2.5 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Fresh Fruits, Quality Grains..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="absolute top-1.5 right-1.5 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                  Search
                </button>
              </form>
            </div>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium bg-gray-800 px-4 py-2 rounded-md text-white hover:bg-gray-700 focus:outline-none">
                    Sort
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 ml-2 h-5 w-5" />
                  </MenuButton>
                </div>
                <MenuItems transition className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="py-1">
                    {sortOptionsState.map((option) => (
                      <MenuItem key={option.name}>
                        {({ active }) => (
                          <button
                            onClick={() => handleSort(option.name)}
                            className={classNames(
                              option.current ? 'font-bold text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block w-full text-left px-4 py-2 text-sm'
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
              <div className="relative ml-4">
                <button
                  type="button"
                  className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none flex items-center ${cartItemsCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Shopping Cart"
                  onClick={() => cartItemsCount > 0 && navigate('/cart')}
                  disabled={cartItemsCount === 0}
                >
                  <ShoppingCart size={18} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
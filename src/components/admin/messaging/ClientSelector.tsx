import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ClientOption {
  id: string;
  full_name: string;
  email: string;
  company?: string;
}

interface ClientSelectorProps {
  clients: ClientOption[];
  selectedClients: ClientOption[];
  onSelectionChange: (clients: ClientOption[]) => void;
  isLoading?: boolean;
  allowMultiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClients,
  onSelectionChange,
  isLoading = false,
  allowMultiple = true,
  disabled = false,
  placeholder = "Select clients..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClientSelect = (client: ClientOption) => {
    if (disabled) return;

    if (allowMultiple) {
      const isSelected = selectedClients.some(c => c.id === client.id);
      if (isSelected) {
        onSelectionChange(selectedClients.filter(c => c.id !== client.id));
      } else {
        onSelectionChange([...selectedClients, client]);
      }
    } else {
      onSelectionChange([client]);
      setIsOpen(false);
    }
  };

  const handleRemoveClient = (clientId: string) => {
    if (disabled) return;
    onSelectionChange(selectedClients.filter(c => c.id !== clientId));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    if (selectedClients.length === filteredClients.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredClients);
    }
  };

  const isClientSelected = (clientId: string) => {
    return selectedClients.some(c => c.id === clientId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Clients Display */}
      <div
        className={`min-h-[42px] w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors duration-200 ${
          disabled 
            ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
            : isOpen 
              ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedClients.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedClients.map((client) => (
                  <span
                    key={client.id}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    <UserIcon className="h-3 w-3 mr-1" />
                    {client.full_name}
                    {!disabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveClient(client.id);
                        }}
                        className="ml-1 hover:text-blue-600"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          {!disabled && (
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Select All Option */}
            {allowMultiple && filteredClients.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <button
                  onClick={handleSelectAll}
                  className="w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 rounded transition-colors duration-200"
                >
                  <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                    selectedClients.length === filteredClients.length
                      ? 'bg-blue-600 border-blue-600'
                      : selectedClients.length > 0
                        ? 'bg-blue-100 border-blue-300'
                        : 'border-gray-300'
                  }`}>
                    {selectedClients.length === filteredClients.length && (
                      <CheckIcon className="h-3 w-3 text-white" />
                    )}
                    {selectedClients.length > 0 && selectedClients.length < filteredClients.length && (
                      <div className="w-2 h-2 bg-blue-600 rounded-sm" />
                    )}
                  </div>
                  <span className="font-medium">
                    {selectedClients.length === filteredClients.length ? 'Deselect All' : 'Select All'}
                  </span>
                  <span className="ml-2 text-gray-500">
                    ({filteredClients.length} clients)
                  </span>
                </button>
              </div>
            )}

            {/* Client List */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading clients...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <UserIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    {searchTerm ? 'No clients found matching your search' : 'No clients available'}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {filteredClients.map((client) => {
                    const isSelected = isClientSelected(client.id);
                    
                    return (
                      <motion.button
                        key={client.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleClientSelect(client)}
                        className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        {allowMultiple && (
                          <div className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                          </div>
                        )}
                        
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {client.full_name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {client.full_name}
                            </p>
                            {isSelected && !allowMultiple && (
                              <CheckIcon className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{client.email}</p>
                          {client.company && (
                            <p className="text-xs text-gray-400 truncate">{client.company}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientSelector;